/*
 * Human Cell Atlas
 * https://www.humancellatlas.org/
 *
 * Component responsible for displaying project bulk download component, and handling the corresponding functionality.
 * 
 *  * Example Hierarchy:
 * ------------------
 * ProjectBulkDownloadComponent
 *   - Dispatch
 *       - onInit
 *           - fetch project
 *           - fetch project-specific summary (required for right side stats)
 *           - fetch project-specific file type summaries excluding file types (required for file type form, requires update on select of file type)
 *           - fetch project-specific file facets (requires update on select of file type)
 *           - fetch project download-specific selected facets (project, species, file types) 
 *        - onRequest
 *            - request project manifest download
 *   - Select
 *     - select project
 *     - project-specific file type summaries excluding file types (required for file type form)
 *     - select project-specific file facets (requires update on select of file type)
 *     - select project-specific summary (required for right side stats)
 *     - select download status
 *   - Renders
 *     - different states of download (file type summary form, in progress, completed)
 * 
 * ProjectLayoutComponent
 *   - Renders
 *     - general layout and right side states
 */

// Core dependencies
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { BehaviorSubject, combineLatest, Subject } from "rxjs";
import { filter, map, take, takeUntil, tap } from "rxjs/operators";

// App dependencies
import { ConfigService } from "../../../config/config.service";
import { FacetTermSelectedEvent } from "../../facet/file-facet/facet-term-selected.event";
import { FileFacetName } from "../../facet/file-facet/file-facet-name.model";
import { ManifestDownloadFormat } from "../../file-manifest/manifest-download-format.model";
import { ManifestResponse } from "../../file-manifest/manifest-response.model";
import { ManifestStatus } from "../../file-manifest/manifest-status.model";
import { FileTypeSummary } from "../../file-summary/file-type-summary";
import { BulkDownloadExecutionEnvironment } from "../../get-data/bulk-download/bulk-download-execution-environment.model";
import { AppState } from "../../../_ngrx/app.state";
import { FetchProjectFilesFacetsRequestAction } from "../../_ngrx/facet/fetch-project-files-facets-request.action";
import { ClearFilesFacetsAction } from "../../_ngrx/file-manifest/clear-files-facets.action";
import { ClearFileManifestFileTypeSummaries } from "../../_ngrx/file-manifest/clear-file-manifest-file-type.summaries";
import { FetchFileManifestUrlRequestAction } from "../../_ngrx/file-manifest/fetch-file-manifest-url-request.action";
import { FetchFileManifestFileTypeSummariesRequestAction } from "../../_ngrx/file-manifest/fetch-file-manifest-file-type-summaries-request.action";
import { FetchProjectFileSummaryRequestAction } from "../../_ngrx/file-manifest/fetch-project-file-summary-request.actions";
import {
    selectFileManifestFileTypeSummaries,
    selectFileManifestManifestResponse, selectFilesFacets,
    selectProjectFileSummary, selectProjectSelectedSearchTerms
} from "../../_ngrx/file-manifest/file-manifest.selectors";
import { SelectProjectFileFacetTermAction } from "../../_ngrx/file-manifest/select-project-file-facet-term.action";
import { selectSelectedProject } from "../../_ngrx/files.selectors";
import { CopyToClipboardProjectBulkDownloadAction } from "../../_ngrx/project/copy-to-clipboard-project-bulk-download.action";
import { RequestProjectBulkDownloadAction } from "../../_ngrx/project/request-project-bulk-download.action";
import { FetchProjectRequestAction } from "../../_ngrx/table/table.actions";
import { ProjectBulkDownloadState } from "./project-bulk-download.state";
import { ProjectDetailService } from "../../project-detail/project-detail.service";
import { ProjectTab } from "../../project-detail/project-tab.model";
import { SearchTerm } from "../../search/search-term.model";
import EntitySpec from "../../shared/entity-spec";
import { Project } from "../../shared/project.model";

@Component({
    selector: "project-bulk-download",
    templateUrl: "./project-bulk-download.component.html",
    styleUrls: ["./project-bulk-download.component.scss"]
})
export class ProjectBulkDownloadComponent implements OnDestroy, OnInit {

    // Template variables
    public executionEnvironment: BulkDownloadExecutionEnvironment = BulkDownloadExecutionEnvironment.BASH;

    // Template variables
    public portalURL: string;
    public state$ = new BehaviorSubject<ProjectBulkDownloadState>({
        loaded: false
    });

    // Locals
    private ngDestroy$ = new Subject<boolean>();

    /**
     * @param {ConfigService} configService
     * @param {ProjectDetailService} projectDetailService
     * @param {Store<AppState>} store
     * @param {ActivatedRoute} activatedRoute
     * @param {Router} router
     */
    constructor(
        private configService: ConfigService,
        private projectDetailService: ProjectDetailService,
        private store: Store<AppState>,
        private activatedRoute: ActivatedRoute,
        private router: Router) {

        this.portalURL = this.configService.getPortalUrl();
    }

    /**
     * Return the curl command for the generated manifest.
     *
     * @param {ManifestResponse} manifestResponse
     * @param {BulkDownloadExecutionEnvironment} executionEnvironment
     * @returns {string}
     */
    public getCurlCommand(manifestResponse: ManifestResponse, executionEnvironment: BulkDownloadExecutionEnvironment): string {

        return manifestResponse.commandLine[executionEnvironment];
    }

    /**
     * Return user to project overview
     */
    public getBackButtonTab(): EntitySpec[] {

        const key = "Project Overview";
        return [{
            key,
            displayName: key
        }];
    }

    /**
     * Returns true if any "fileFormat" facet terms are selected.
     * @param {SearchTerm[]} selectedSearchTerms
     * @returns {boolean}
     */
    public isAnyFileFormatSelected(selectedSearchTerms: SearchTerm[]): boolean {

        return selectedSearchTerms.some(selectedSearchTerm =>
            selectedSearchTerm.getSearchKey() === FileFacetName.FILE_FORMAT);
    }

    /**
     * Returns true if there no file type summaries.
     */
    public isFileTypeSummariesEmpty(fileTypeSummaries: FileTypeSummary[]): boolean {

        return fileTypeSummaries.length === 0;
    }

    /**
     * Returns true if download has completed.
     *
     * @param {ManifestResponse} manifestResponse
     * @returns {boolean}
     */
    public isDownloadComplete(manifestResponse: ManifestResponse): boolean {

        return manifestResponse.status === ManifestStatus.COMPLETE;
    }

    /**
     * Returns true if download has been initiated but is not yet complete.
     *
     * @param {ManifestResponse} manifestResponse
     * @returns {boolean}
     */
    public isDownloadInProgress(manifestResponse: ManifestResponse): boolean {

        return manifestResponse.status === ManifestStatus.IN_PROGRESS;
    }

    /**
     * Returns true if download has not yet been initiated.
     *
     * @param {ManifestResponse} manifestResponse
     * @returns {boolean}
     */
    public isDownloadNotStarted(manifestResponse: ManifestResponse): boolean {

        return manifestResponse.status === ManifestStatus.NOT_STARTED;
    }

    /**
     * Returns true if bulk download request form is valid. That is, at least one file format as well as the operating
     * system (for the curl command) are selected.
     *
     * @param {SearchTerm[]} selectedSearchTerms
     * @param {BulkDownloadExecutionEnvironment} os
     * @returns {boolean}
     */
    public isRequestFormValid(selectedSearchTerms: SearchTerm[], os: BulkDownloadExecutionEnvironment): boolean {

        return this.isAnyFileFormatSelected(selectedSearchTerms) && !!os;
    }

    /**
     * Track click on copy of bulk download data link.
     *
     * @param {Project} project
     * @param {BulkDownloadExecutionEnvironment} shell
     * @param {string} curl
     */
    public onDataLinkCopied(project: Project, shell: BulkDownloadExecutionEnvironment, curl: string) {

        this.store.dispatch(new CopyToClipboardProjectBulkDownloadAction(project, shell, curl));
    }

    /**
     * Handle click on term in list of selected file types; update store and toggle selected value of term.
     *
     * @param facetTermSelectedEvent {FacetTermSelectedEvent}
     */
    public onFacetTermSelected(facetTermSelectedEvent: FacetTermSelectedEvent) {

        // Dispatch action to update project download-specific facets
        const action = new SelectProjectFileFacetTermAction(
            facetTermSelectedEvent.facetName,
            facetTermSelectedEvent.termName,
            null, // Display value only required for project ID facet
            facetTermSelectedEvent.selected);
        this.store.dispatch(action);

        // Kick off request for project-specific summary including any selected file types. Required for updating
        // right side stats on select of file type.
        this.store.dispatch(new FetchProjectFileSummaryRequestAction());

        // Get the list of facets to display. Must pull these from the files endpoint and specific to this project.
        //  Required for updating right side stats on select of file type.
        this.store.dispatch(new FetchProjectFilesFacetsRequestAction());
    }

    /**
     * Dispatch action to generate bulk download URL. Also track export action with GA.
     *
     * @param {Project} project
     * @param {BulkDownloadExecutionEnvironment} shell
     */
    public onRequestManifest(project: Project,
                             shell: BulkDownloadExecutionEnvironment) {

        this.store.dispatch(new FetchFileManifestUrlRequestAction(ManifestDownloadFormat.CURL, true));
        this.store.dispatch(new RequestProjectBulkDownloadAction(project, shell));
    }

    /**
     * Handle click on back button.
     *
     * @param {string} projectId
     */
    public onTabSelected(projectId: string): void {

        this.router.navigate(["/projects", projectId]);
    }

    /**
     * Clear download-related state from store, kill subscriptions.
     */
    public ngOnDestroy() {

        // Clear project-specific:
        // - file type summaries
        // - response status
        // - project file summary
        this.store.dispatch(new ClearFileManifestFileTypeSummaries());

        // Clear project-specific files facets.
        this.store.dispatch(new ClearFilesFacetsAction());

        // Remove project description meta
        this.projectDetailService.removeProjectMeta();

        this.ngDestroy$.next(true);
        this.ngDestroy$.complete();
    }

    /**
     * Set up selectors and request initial data set.
     */
    public ngOnInit() {

        // Add selected project to state - grab the project ID from the URL. Update download state to include selected
        // project ID.
        const projectId = this.activatedRoute.parent.snapshot.paramMap.get("id");
        this.store.dispatch(new FetchProjectRequestAction(projectId));

        // Grab reference to selected project then dispatch related events
        const project$ = this.store.pipe(
            select(selectSelectedProject),
            takeUntil(this.ngDestroy$),
            filter(project => !!project),
            take(1),
            tap(project => {
                
                this.store.dispatch(
                    new SelectProjectFileFacetTermAction(FileFacetName.PROJECT_ID, projectId, project.projectShortname, true));

                // Kick off request for project-specific file type summaries. Required for populating file type form.
                this.store.dispatch(new FetchFileManifestFileTypeSummariesRequestAction(true));

                // Kick off request for project-specific summary including any selected file types. Required for populating
                // right side stats.
                this.store.dispatch(new FetchProjectFileSummaryRequestAction());

                // Get the list of facets to display. Must pull these from the files endpoint and specific to this project.
                this.store.dispatch(new FetchProjectFilesFacetsRequestAction());
            })
        );

        // Grab file summary for displaying file types form. 
        const fileTypeSummaries$ = this.store.pipe(select(selectFileManifestFileTypeSummaries));

        // Grab file facets, required for right side stats. Files facets are project-specific (on dispatch) but share
        // the same slot in the store as the general "filesFacets" for selected data download.
        const filesFacets$ = this.store.pipe(select(selectFilesFacets));

        // Grab project-specific file summary, required for right side stats.
        const projectFileSummary$ = this.store.pipe(select(selectProjectFileSummary));

        // Grab project download-specific selected facets, required for right side stats.
        const projectSelectedSearchTerms$ = this.store.pipe(select(selectProjectSelectedSearchTerms));

        // Update the UI with any changes in the download request request status and URL
        const fileManifestManifestResponse$ = this.store.pipe(select(selectFileManifestManifestResponse));

        combineLatest([
            project$,
            fileTypeSummaries$,
            filesFacets$,
            projectFileSummary$,
            projectSelectedSearchTerms$,
            fileManifestManifestResponse$
        ]).pipe(
            filter(([, , filesFacets, fileSummary]) => {
                return filesFacets.length && Object.keys(fileSummary).length > 0
            }),
            map(([project, fileTypeSummaries, filesFacets, fileSummary, selectedSearchTerms, manifestResponse]) => {

                const selectedSearchTermNames = selectedSearchTerms
                    .map(searchTerm => searchTerm.getDisplayValue());

                return {
                    filesFacets,
                    fileSummary,
                    fileTypeSummaries,
                    loaded: true,
                    manifestResponse,
                    selectedSearchTerms,
                    selectedSearchTermNames,
                    project
                };
            }),
            takeUntil(this.ngDestroy$)
        ).subscribe(state => {

            this.state$.next(state);

            // Update description meta for this project
            this.projectDetailService.addProjectMeta(state.project.projectTitle, ProjectTab.PROJECT_BULK_DOWNLOAD);
        });
    }
}