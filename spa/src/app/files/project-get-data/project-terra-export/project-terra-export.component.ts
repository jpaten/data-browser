/*
 * Human Cell Atlas
 * https://www.humancellatlas.org/
 *
 * Component responsible for displaying project-specific export to Terra component, and handling the corresponding
 * functionality.
 * 
 *  * Example Hierarchy:
 * ------------------
 * ProjectTerraExportComponent
 *   - Dispatch
 *     - fetch project
 *     - fetch project-specific summary (required for right side stats)
 *     - fetch project-specific file type summaries excluding file types (required for file type form, requires update on select of file type)
 *     - fetch project-specific file facets (requires update on select of file type)
 *   - Select
 *     - select project
 *     - project-specific file type summaries excluding file types (required for file type form)
  *     - select project-specific file facets (requires update on select of file type)
 *     - select project-specific summary (required for right side stats)
 *   - Renders
 *     - different states of download (file type summary form, in progress, completed)
 * 
 * ProjectLayoutComponent
 *   - Renders
 *     - general layout and right side states
 */

// Core dependencies
import { Component, OnDestroy, OnInit  } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { BehaviorSubject, combineLatest, Subject } from "rxjs";
import { filter, map, take, takeUntil, tap } from "rxjs/operators";

// App dependencies
import { ConfigService } from "../../../config/config.service";
import { FileFacetName } from "../../facet/file-facet/file-facet-name.model";
import { FacetTermSelectedEvent } from "../../facet/file-facet/facet-term-selected.event";
import { ManifestDownloadFormat } from "../../file-manifest/manifest-download-format.model";
import { ManifestResponse } from "../../file-manifest/manifest-response.model";
import { BulkDownloadExecutionEnvironment } from "../../get-data/bulk-download/bulk-download-execution-environment.model";
import { AppState } from "../../../_ngrx/app.state";
import { FetchProjectFilesFacetsRequestAction } from "../../_ngrx/facet/fetch-project-files-facets-request.action";
import { ClearFilesFacetsAction } from "../../_ngrx/file-manifest/clear-files-facets.action";
import { ClearFileManifestFileTypeSummaries } from "../../_ngrx/file-manifest/clear-file-manifest-file-type.summaries";
import { FetchProjectFileSummaryRequestAction } from "../../_ngrx/file-manifest/fetch-project-file-summary-request.actions";
import {
    selectFileManifestFileTypeSummaries, selectFilesFacets,
    selectProjectFileSummary, selectProjectSelectedSearchTerms
} from "../../_ngrx/file-manifest/file-manifest.selectors";
import { selectSelectedProject } from "../../_ngrx/files.selectors";
import { CopyToClipboardProjectTerraUrlAction } from "../../_ngrx/project/copy-to-clipboard-project-terra-url.action";
import { FetchProjectRequestAction } from "../../_ngrx/table/table.actions";
import { ResetExportToTerraStatusAction } from "../../_ngrx/terra/reset-export-to-terra-status.action";
import { selectExportToTerra } from "../../_ngrx/terra/terra.selectors";
import { ProjectDetailService } from "../../project-detail/project-detail.service";
import { ProjectTab } from "../../project-detail/project-tab.model";
import { ProjectTerraExportState } from "./project-terra-export.state";
import { SearchTerm } from "../../search/search-term.model";
import EntitySpec from "../../shared/entity-spec";
import { ExportToTerraStatus } from "../../shared/export-to-terra-status.model";
import { Project } from "../../shared/project.model";
import { TerraService } from "../../shared/terra.service";
import { SelectProjectFileFacetTermAction } from "../../_ngrx/file-manifest/select-project-file-facet-term.action";
import { FetchFileManifestFileTypeSummariesRequestAction } from "../../_ngrx/file-manifest/fetch-file-manifest-file-type-summaries-request.action";
import { LaunchProjectTerraAction } from "../../_ngrx/project/launch-project-terra.action";
import { ExportProjectToTerraRequestAction } from "../../_ngrx/project/export-project-to-terra-request.action";

@Component({
    selector: "project-terra-export",
    templateUrl: "./project-terra-export.component.html",
    styleUrls: ["./project-terra-export.component.scss"]
})
export class ProjectTerraExportComponent implements OnDestroy, OnInit {

    // Template variables
    public manifestDownloadFormat = ManifestDownloadFormat.TERRA_BDBAG;
    public portalURL: string;
    public selectedSearchTermNames: string[] = [];
    public selectedSearchTerms: SearchTerm[] = [];
    public state$ = new BehaviorSubject<ProjectTerraExportState>({
        loaded: false
    });

    // Locals
    private ngDestroy$ = new Subject<boolean>();

    /**
     * @param {ConfigService} configService
     * @param {ProjectDetailService} projectDetailService
     * @param {TerraService} terraService
     * @param {Store<AppState>} store
     * @param {ActivatedRoute} activatedRoute
     * @param {Router} router
     */
    constructor(
        private configService: ConfigService,
        private projectDetailService: ProjectDetailService,
        private terraService: TerraService,
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
     * Return set of possible manifest download formats.
     */
    public getManifestDownloadFormats(): ManifestDownloadFormat[] {

        return [ManifestDownloadFormat.TERRA_BDBAG, ManifestDownloadFormat.TERRA_PFB];
    }

    /**
     * Returns the terra workspace URL.
     *
     * @param exportToTerraUrl
     * @returns {string}
     */
    public getTerraServiceUrl(exportToTerraUrl): string {

        return this.terraService.buildExportToTerraWorkspaceUrl(exportToTerraUrl);
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
     * Returns true if current environment is dev.
     *
     * @returns {boolean}
     */
    public isManifestDownloadFormatEnabled(): boolean {

        return this.configService.isEnvCGLDev();
    }

    /**
     * Returns true if export to Terra request has been completed.
     *
     * @param {ExportToTerraStatus} status
     * @returns {boolean}
     */
    public isRequestComplete(status: ExportToTerraStatus): boolean {

        return this.terraService.isExportToTerraRequestComplete(status);
    }

    /**
     * Returns true if an error occurred during the export to Terra request.
     *
     * @param {ExportToTerraStatus} status
     * @returns {boolean}
     */
    public isRequestFailed(status: ExportToTerraStatus): boolean {

        return this.terraService.isExportToTerraRequestFailed(status);
    }

    /**
     * Returns true if export to Terra request is in progress.
     *
     * @param {ExportToTerraStatus} status
     * @returns {boolean}
     */
    public isRequestInProgress(status: ExportToTerraStatus): boolean {

        return (this.terraService.isExportToTerraRequestInitiated(status) ||
            this.terraService.isExportToTerraRequestInProgress(status));
    }

    /**
     * Returns true if export to Terra request has not yet been started.
     *
     * @param {ExportToTerraStatus} status
     * @returns {boolean}
     */
    public isRequestNotStarted(status: ExportToTerraStatus): boolean {

        return this.terraService.isExportToTerraRequestNotStarted(status);
    }

    /**
     * Track click on Terra data link.
     *
     * @param {Project} project
     * @param {string} exportToTerraUrl
     */
    public onDataLinkClicked(project: Project, exportToTerraUrl: string) {

        this.store.dispatch(new LaunchProjectTerraAction(project, exportToTerraUrl));
    }


    /**
     * Track click on copy of Terra data link.
     *
     * @param {Project} project
     * @param {string} exportToTerraUrl
     */
    public onDataLinkCopied(project: Project, exportToTerraUrl: string) {

        this.store.dispatch(new CopyToClipboardProjectTerraUrlAction(project, exportToTerraUrl));
    }

    /**
     * Dispatch action to export to Terra.
     * 
     * @param {Project} project
     * @param {ManifestDownloadFormat} manifestDownloadFormat
     */
    public onExportToTerra(project: Project, manifestDownloadFormat: ManifestDownloadFormat) {

        this.store.dispatch(new ExportProjectToTerraRequestAction(project, manifestDownloadFormat));
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
            null, // Display value only required for project ID facet,
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
     * Handle select on manifest download format radio button.
     */
    public onManifestDownloadFormat(manifestDownloadFormat: ManifestDownloadFormat) {

        this.manifestDownloadFormat = manifestDownloadFormat;
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
     * Open new window on completion of export to Terra request.
     */
    private initRequestCompleteSubscriber() {

        this.state$
            .pipe(
                takeUntil(this.ngDestroy$),
                filter(({exportToTerraStatus}) => this.isRequestComplete(exportToTerraStatus))
            )
            .subscribe((state) => {

                window.open(this.terraService.buildExportToTerraWorkspaceUrl(state.exportToTerraUrl));
            });
    }

    /**
     * Clear summary and kill subscriptions on exit of component.
     */
    public ngOnDestroy() {

        // Clear project-specific:
        // - file type summaries
        // - project file summary
        this.store.dispatch(new ClearFileManifestFileTypeSummaries());

        // Clear project-specific files facets.
        this.store.dispatch(new ClearFilesFacetsAction());

        // Reset export to Terra request status
        this.store.dispatch(new ResetExportToTerraStatusAction());

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

        // Update the UI with any changes in the Terra export request status and URL
        const exportToTerra$ = this.store.pipe(select(selectExportToTerra));

        combineLatest([
            project$,
            fileTypeSummaries$,
            filesFacets$,
            projectFileSummary$,
            projectSelectedSearchTerms$,
            exportToTerra$
        ]).pipe(
            filter(([, , filesFacets, fileSummary]) => {
                return filesFacets.length && Object.keys(fileSummary).length > 0
            }),
            map(([project, fileTypeSummaries, filesFacets, fileSummary, selectedSearchTerms, exportToTerra]) => {

                const selectedSearchTermNames = selectedSearchTerms
                    .map(searchTerm => searchTerm.getDisplayValue());

                return {
                    filesFacets,
                    fileSummary,
                    fileTypeSummaries,
                    loaded: true,
                    selectedSearchTerms,
                    selectedSearchTermNames,
                    project,
                    ...exportToTerra
                };
            }),
            takeUntil(this.ngDestroy$)
        ).subscribe(state => {

            this.state$.next(state);

            // Update description meta for this project
            this.projectDetailService.addProjectMeta(state.project.projectTitle, ProjectTab.PROJECT_TERRA_EXPORT);
        });

        this.initRequestCompleteSubscriber();
    }
}