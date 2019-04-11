/**
 * Human Cell Atlas
 * https://www.humancellatlas.org/
 *
 * File manifest-related effects.
 */

// Core dependencies
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";

// App dependencies
import { DownloadFileManifestRequestedAction } from "./download-file-manifest-requested.action";
import { DownloadFileManifestAction } from "./download-file-manifest.action";
import { FetchManifestDownloadFileSummaryRequestAction } from "./fetch-manifest-download-file-summary-request.action";
import { FetchManifestDownloadFileSummarySuccessAction } from "./fetch-manifest-download-file-summary-success.action";
import { FileSummary } from "../../file-summary/file-summary";
import { AppState } from "../../../_ngrx/app.state";
import { selectSearchTerms } from "../search/search.selectors";
import { FilesService } from "../../shared/files.service";

@Injectable()
export class FileManifestEffects {

    /**
     * @param {Store<AppState>} store
     * @param {Actions} actions$
     * @param {FilesService} fileService
     */
    constructor(private store: Store<AppState>,
                private actions$: Actions,
                private fileService: FilesService) {
    }

    /**
     * Trigger download of manifest.
     */
    @Effect()
    downloadFileManifest$: Observable<Action> = this.actions$
        .pipe(
            ofType(DownloadFileManifestAction.ACTION_TYPE),
            switchMap(() => this.store.pipe(
                select(selectSearchTerms),
                take(1)
            )),
            switchMap((searchTerms) => this.fileService.downloadFileManifest(searchTerms)),
            map(response => new DownloadFileManifestRequestedAction(response))
        );

    /**
     * Fetch file summary to populate file type summaries on manifest modal. Include all selected facets except any
     * selected file types, in request.
     */
    @Effect()
    fetchManifestDownloadFileSummary: Observable<Action> = this.actions$
        .pipe(
            ofType(FetchManifestDownloadFileSummaryRequestAction.ACTION_TYPE),
            switchMap(() => this.store.pipe(
                select(selectSearchTerms),
                take(1)
            )),
            switchMap((searchTerms) => this.fileService.fetchFileManifestFileSummary(searchTerms)),
            map((fileSummary: FileSummary) => new FetchManifestDownloadFileSummarySuccessAction(fileSummary))
        );
}