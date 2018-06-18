/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Core files component, displays results summary as well as facets.
 */
// Core dependencies
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
// App dependencies
import { FileFacet } from "./shared/file-facet.model";
import { FileSummary } from "./file-summary/file-summary";

import { FetchFileManifestSummaryRequestAction } from "./_ngrx/file-manifest-summary/file-manifest-summary.actions";
import { selectFileFacetsFileFacets, selectFileSummary, selectSelectedFileFacets } from "./_ngrx/file.selectors";
import { AppState } from "../_ngrx/app.state";
import { FetchFileFacetsRequestAction } from "./_ngrx/file-facet-list/file-facet-list.actions";
import { FileFacetSelectedEvent } from "./file-facets/file-facet.events";

@Component({
    selector: "bw-files",
    templateUrl: "files.component.html",
    styleUrls: ["files.component.scss"]
})
export class FilesComponent implements OnInit {

    // Public variables
    public hcaExplore;
    public hcaFileSummary;
    public hcaFilterWrapper;
    public hcaStickyOverlay;
    public hcaTab;
    public selectFileSummary$: Observable<FileSummary>;
    public fileFacets$: Observable<FileFacet[]>;
    public selectedFileFacets$: Observable<FileFacet[]>;
    // Locals
    private route: ActivatedRoute;
    private store: Store<AppState>;

    /**
     * @param route {ActivatedRoute}
     * @param store {Store<AppState>}
     */
    constructor(route: ActivatedRoute,
                store: Store<AppState>) {

        this.route = route;
        this.store = store;
    }

    /**
     * Public API
     */

    /**
     * Sets up element by id
     */
    public getComponentElementById() {

        // Set up component HTML reference
        this.hcaStickyOverlay = document.getElementById("hcaStickyOverlay");
        this.hcaExplore = document.getElementById("hcaExplore");
        this.hcaFilterWrapper = document.getElementById("hcaFilterWrapper");
        this.hcaTab = document.getElementById("hcaTab");
        this.hcaFileSummary = document.getElementById("hcaFileSummary");
    }

    /**
     * Returns component heights for calculating sticky header position
     */
    public getComponentHeight() {

        // Get height for each component
        // Allocate top position based on calculated height
        this.hcaStickyOverlay.style.height = this.hcaExplore.offsetHeight + this.hcaFilterWrapper.offsetHeight + this.hcaTab.offsetHeight + "px";
        this.hcaExplore.style.top = "0px";
        this.hcaFilterWrapper.style.top = this.hcaExplore.offsetHeight + "px";
        this.hcaTab.style.top = this.hcaExplore.offsetHeight + this.hcaFilterWrapper.offsetHeight + "px";
        this.hcaFileSummary.style.top = this.hcaExplore.offsetHeight + this.hcaFilterWrapper.offsetHeight + this.hcaTab.offsetHeight + "px";
    }

    /**
     * Window resize triggers a re-calculation of component heights
     * @param event
     */
    public onResize() {

        this.getComponentHeight();
    }

    /**
     * Dispatch action to request updated manifest summary (ie summary counts, file sizes etc)
     */
    public requestManifestSummary() {

        this.store.dispatch(new FetchFileManifestSummaryRequestAction());
    }

    /**
     * Dispatch action to download manifest summary.
     */
    // public onDownloadManifest() {
    //
    //     this.store.dispatch(new DownloadFileManifestAction());
    // }

    /**
     * Life cycle hooks
     */

    /**
     * Set up selectors and request initial data set.
     */
    public ngOnInit() {

        // File Summary
        this.selectFileSummary$ = this.store.select(selectFileSummary);

        // File Facets
        this.fileFacets$ = this.store.select(selectFileFacetsFileFacets);

        this.selectedFileFacets$ = this.store.select(selectSelectedFileFacets);

        // Initialize the filter state from the params in the route.
        this.initQueryParams();

        // Sets up element by id
        this.getComponentElementById();

        // Return component heights for sticky header
        this.getComponentHeight();

    }

    /**
     * PRIVATES
     */

    /**
     * Parse queryParams into file filters
     */
    private initQueryParams() {

        this.route.queryParams
            .map((params) => {

                if (params && params["filter"] && params["filter"].length) {

                    let filterParam = decodeURIComponent(params["filter"]);
                    let filter
                    try {
                        filter = JSON.parse(filterParam);
                    }
                    catch (err) {
                       console.log(err);
                    }


                    if (filter && filter.organ) {
                        return filter.organ;
                    }
                    else {
                        return "";
                    }
                }
            })
            .subscribe((organ) => {
                if (organ) {
                    this.store.dispatch(new FetchFileFacetsRequestAction(new FileFacetSelectedEvent("organ", organ, true)));
                }
                else {
                    this.store.dispatch(new FetchFileFacetsRequestAction());
                }
            });
    }
}
