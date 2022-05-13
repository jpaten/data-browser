/**
 * Hook to make API async calls and handles the API result state.
 */
import React, { useCallback, useLayoutEffect, useReducer, useRef } from 'react'

/**
 * Hook to safely call a async function, by checking if the component is mounted before the call
 * 
 * @param dispatch function to be called in case the component is mounted
 * @returns a memoized function that will call the @dispatch param or nothing
 */
const useSafeDispatch = <T>(dispatch: (args: T) => void) => {
  const mounted = React.useRef(false)
  useLayoutEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  return useCallback(
    (args: T) => (mounted.current ? dispatch(args) : void 0),
    [dispatch]
  )
}

type Error = { message: string }

interface State<T> {
  status: 'idle' | 'pending' | 'rejected' | 'resolved'
  data?: T
  error?: Error
}

/**
 * Hook to safely call async functions and managing the result's state.
 * @param state API request's initial state. Default to idle
 * @returns set of functions to be used to as request handlers
 */
export const useAsync = <T>(state: State<T> = { status: 'idle' }) => {
  const initialStateRef = useRef<State<T>>(state)
  const [{ status, data, error }, setState] = useReducer(
    (s: State<T>, a: State<T>) => ({ ...s, ...a }),
    initialStateRef.current
  )

  const safeSetState = useSafeDispatch(setState)

  const setData = useCallback(
    (data?: T) => safeSetState({ data, status: 'resolved' }),
    [safeSetState]
  )
  const setError = useCallback(
    (error: Error) => safeSetState({ error, status: 'rejected' }),
    [safeSetState]
  )
  const reset = useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState]
  )

  const run = useCallback(
    (promise: Promise<T>) => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise.`
        )
      }
      safeSetState({ status: 'pending' })
      return promise.then(
        (data: T) => {
          setData(data)
          return data
        },
        (error: Error) => {
          setError(error)
          return Promise.reject(error)
        }
      )
    },
    [safeSetState, setData, setError]
  )

  return {
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',
    error,
    status,
    data,
    run,
    reset,
  }
}