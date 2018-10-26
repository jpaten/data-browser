/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Top-level application component.
 */

// Core dependencies
import { Location } from "@angular/common";
import { Component, ElementRef } from "@angular/core";
import { ActivatedRoute, ParamMap, Params, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import "rxjs/add/operator/skip";
import { Subscription } from "rxjs/Subscription";

// App dependencies
import { SetViewStateAction } from "./files/_ngrx/file-facet-list/file-facet-list.actions";
import { AppState } from "./_ngrx/app.state";
import { QueryStringFacet } from "./files/shared/query-string-facet.model";

@Component({
    selector: "app-root",
    templateUrl: "app.component.html",
    styleUrls: ["app.component.scss"]
})

export class AppComponent {

    // Public variables
    public noScroll: boolean;

    // Locals
    private actionsSubscription: Subscription;

    /**
     * @param {Router} router
     * @param {Store<AppState>} store
     * @param {ActivatedRoute} activatedRoute
     * @param {Location} location
     */
    constructor(private router: Router,
                private store: Store<AppState>,
                private activatedRoute: ActivatedRoute,
                private elementRef: ElementRef,
                private location: Location) {
    }

    /**
     * Public API
     */

    /**
     * Remove scroll on body when menu is open
     *
     * @param value
     */
    public isMenuOpen(value) {

        this.noScroll = value;
        this.preventScroll();
    }

    /**
     * Prevent scroll on body when menu is open
     */
    public preventScroll() {

        let nativeElement = this.elementRef.nativeElement;
        let openedMenu = nativeElement.classList.contains("noScroll");
        if ( this.noScroll && !openedMenu ) {
            nativeElement.classList.add("noScroll");
        }
        else if ( !this.noScroll && openedMenu ) {
            nativeElement.classList.remove("noScroll");
        }
    }

    /**
     * Privates
     */

    /**
     * Returns true if a filter state is encoded in the query params.
     *
     * @param {ParamMap} paramMap
     * @returns {boolean}
     */
    private isFilterParamSpecified(paramMap: ParamMap): boolean {

        return paramMap.keys.some((key: string) => {
            return key === "filter";
        });
    }

    /**
     * Determine the current selected tab.
     *
     * @returns {string}
     */
    private parseTab(): string {

        const path = this.location.path().split("?")[0];
        if ( path === "/files" ) {
            return "files";
        }

        if ( path === "/specimens" ) {
            return "specimens";
        }

        return "projects";
    }

    /**
     * Parse the "filter" query string param, if specified.
     *
     * @param {ParamMap} paramMap
     * @returns {QueryStringFacet[]}
     */
    private parseQueryStringFacets(paramMap: ParamMap): QueryStringFacet[] {

        if ( this.isFilterParamSpecified(paramMap) ) {

            // We have a filter, let's extract it.
            let filter;
            const filterParam = paramMap.get("filter");
            try {
                filter = JSON.parse(filterParam);
            }
            catch (error) {
                console.log(error);
            }

            let queryStringFacets = [];
            if ( filter && filter.length && filter[0].facetName ) {
                queryStringFacets = filter.map((selectedFacet) => {
                    return new QueryStringFacet(selectedFacet["facetName"], selectedFacet["terms"]);
                });
            }

            return queryStringFacets;
        }

        return [];
    }

    /**
     * Set up app state from query string parameters, if any.
     */
    private setAppStateFromURL() {

        this.actionsSubscription =
            this.activatedRoute.queryParamMap
                .map((paramMap: ParamMap): QueryStringFacet[] => {

                    return this.parseQueryStringFacets(paramMap);
                })
                .subscribe((filter: QueryStringFacet[]) => {

                    const tab = this.parseTab();
                    this.store.dispatch(new SetViewStateAction(tab, filter));
                });
    }

    /**
     * Life cycle hooks
     */

    /**
     * Kill subscriptions on destroy of component.
     */
    public ngOnDestroy() {

        if ( !!this.actionsSubscription ) {
            this.actionsSubscription.unsubscribe();
        }
    }

    /**
     * Set up app state from URL, if specified.
     */
    public ngOnInit() {

        this.setAppStateFromURL();
    }
}

