/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Table component for displaying file-related data.
 */
// Core dependencies
import { DataSource } from "@angular/cdk/collections";
import { Component, OnInit } from "@angular/core";
import { Sort } from "@angular/material";
import { Store } from "@ngrx/store";
import "rxjs/add/observable/of";
import { Observable } from "rxjs/Observable";
// App dependencies
import { AppState } from "../../_ngrx/app.state";
import { selectPagination, selectTableData } from "../_ngrx/file.selectors";
import {
    FetchPagedOrSortedTableDataRequestAction, TableNextPageAction,
    TablePreviousPageAction
} from "../_ngrx/table/table.actions";
import { PaginationModel } from "../table/pagination.model";
import { TableParamsModel } from "../table/table-params.model";

@Component({
    selector: "hca-table-files",
    templateUrl: "./hca-table-files.component.html",
    styleUrls: ["./hca-table-files.component.scss"]
})
export class HCATableFilesComponent implements OnInit {

    display10 = 13;
    display5 = 6;
    display7 = 10;
    displayedColumns = [
        "fileName",  "specimenId", "organ", "organPart", "libraryConstructionApproach", "genusSpecies", "organismAge", "biologicalSex", "disease", "fileType", "totalCells"
    ];
    tableElementDataSource: TableElementDataSource;
    tooltipShowDelay = 150;
    pagination$: Observable<PaginationModel>;
    // pageSizeOptions = [10, 15, 25, 50, 100, 200];
    // selectedPage = 15;
    // pageValue: number;
    pageError: boolean;

    // Locals
    private store: Store<AppState>;

    /**
     * @param store {Store<AppState>}
     */
    constructor(store: Store<AppState>) {
        this.store = store;
    }

    /**
     * Public API
     */

    /**
     * Returns true if term name is truncated with ellipsis. Note, this is not calculated exactly (as ellipsis is
     * controlled by CSS) and is just an approximation.
     *
     * @param termName {string}
     * @param length {number}
     * @returns {boolean}
     */
    public isTermNameTruncated(termName: string, length: number): boolean {

        if ( termName ) {
            return termName.length > length;
        }
        else {
            return false;
        }
    }

    /**
     * Called when table next page selected.
     *
     * @param {PaginationModel} pm
     */
    public nextPageSelected(pm: PaginationModel) {

        if ( !this.hasNext(pm) ) {
            return;
        }

        let tableParamsModel = {

            search_after: pm.search_after,
            search_after_uid: pm.search_after_uid,
            size: pm.size,
            sort: pm.sort,
            order: pm.order
        };

        this.store.dispatch(new TableNextPageAction(tableParamsModel));
    }

    /**
     * Called when table previous page selected.
     */
    public previousPageSelected(pm: PaginationModel) {


        if ( !this.hasPrevious(pm) ) {
            return;
        }

        let tableParamsModel = {

            search_before: pm.search_before,
            search_before_uid: pm.search_after_uid,
            size: pm.size,
            sort: pm.sort,
            order: pm.order
        };

        this.store.dispatch(new TablePreviousPageAction(tableParamsModel));
    }

    public getAgeUnit(ageUnit) {

        if ( ageUnit ) {
            return ageUnit.charAt(0);
        }
    }

    /**
     * Call to go directly to a page by page number.
     *
     * @param {PaginationModel} pm
     * @param {number} pageNumber
     */
    // public goToPage(pm: PaginationModel, pageNumber: number) {
    //
    //     let pageCount = this.getPageCount(pm);
    //     this.pageError = false;
    //
    //     /* Prevent error on page number */
    //     if ( pageNumber > pageCount || !pageNumber || pageNumber <= 0 ) {
    //         this.pageError = true;
    //         pageNumber = 1;
    //     }
    //
    //     pageNumber = (pageNumber - 1);
    //     let from = (pm.size * pageNumber) + 1;
    //
    //     let tableParamsModel = {
    //         from: from,
    //         size: pm.size,
    //         sort: pm.sort,
    //         order: pm.order
    //     };
    //
    //     this.store.dispatch(new FetchPagedOrSortedTableDataRequestAction(tableParamsModel));
    // }

    /**
     * Sort the table given the sort param and the order.
     *
     * @param {PaginationModel} pm
     * @param {Sort} sort
     */
    public sortTable(pm: PaginationModel, sort: Sort) {

        let tableParamsModel: TableParamsModel = {
            size: pm.size,
            sort: sort.active,
            order: sort.direction
        };

        this.store.dispatch(new FetchPagedOrSortedTableDataRequestAction(tableParamsModel));
    }

    /**
     * Check if there is a next page.
     *
     * @param {PaginationModel} pm
     * @returns {boolean}
     */
    public hasNext(pm: PaginationModel): boolean {
        // return (pm.from + pm.count) < pm.total;
        return pm.search_after !== null;
    }

    /**
     * Check if there is a previous page.
     *
     * @param {PaginationModel} pm
     * @returns {boolean}
     */
    public hasPrevious(pm: PaginationModel): boolean {
       // return (pm.from > 1);
        return pm.search_before !== null;
    }

    // /**
    //  * Return the index of the last row in the table (starting from 1).
    //  *
    //  * @param {PaginationModel} pm
    //  * @returns {number}
    //  */
    // getToIndex(pm: PaginationModel): number {
    //     let to: number = pm.from + (pm.size - 1);
    //     if (to <= pm.total) {
    //         return to;
    //     }
    //     else {
    //         return pm.total;
    //     }
    // }
    //
    // /**
    //  * Return the current page number.
    //  *
    //  * @param {PaginationModel} pm
    //  * @returns {number}
    //  */
    // getCurrentPage(pm: PaginationModel): number {
    //     return Math.floor(pm.from / pm.size) + 1;
    // }


    /**
     * Return the total number of pages.
     *
     * @param {PaginationModel} pm
     * @returns {number}
     */
    getPageCount(pm: PaginationModel) {
        return Math.ceil(pm.total / pm.size);
    }

    getPages(pm: PaginationModel): number[] {

        let pages = [];
        let pageCount = this.getPageCount(pm);

        for ( let i = 1; i <= pageCount; i++ ) {
            pages.push(i);
        }

        return pages;
    }

    /**
     * Sets the number of rows per page.
     *
     * @param {PaginationModel} pm
     * @returns {number} pageSize
     */
    public setPageSize(pm: PaginationModel, pageSize: number) {

        let tableParamsModel: TableParamsModel = {
            size: pageSize,
            sort: pm.sort,
            order: pm.order
        };

        this.store.dispatch(new FetchPagedOrSortedTableDataRequestAction(tableParamsModel));
    }

    /**
     * Lifecycle hooks
     */

    /**
     *  Set up table data source and pagination
     */
    ngOnInit() {

        // Initialize the new data source with an observable of the table data.
        this.tableElementDataSource = new TableElementDataSource(this.store.select(selectTableData));

        // Get an observable of the pagination model
        this.pagination$ = this.store.select(selectPagination);
    }
}

/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Elements in Material Design table that displays HCA-specific file related data.
 */
export interface Element {
    fileName: string;
    // biomaterial: string; // TODO check not array
    organ: string;
    organPart: string;
    libraryConstructionApproach: string;
    genusSpecies: string;
    organismAge: string;
    ageUnit: string;
    biologicalSex: string;
    disease: string; // TODO check not array
    totalCells: number;
}

/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Data source backing Material Design table that displays file related data.
 */
class TableElementDataSource extends DataSource<any> {

    element$: Observable<Element[]>;

    constructor(tableData$: Observable<any[]>) {

        super();

        this.element$ = tableData$.map((rows: any[]) => {

            return rows.map((row: any) => {

                // let biomaterials = row.biomaterials[0] || {}; // TODO revisit - samples is an array for single hit?

                // const biomaterials = row.biomaterials.reduce((acc, biomaterial) => {
                //
                //     Object.keys(biomaterial).forEach((key) => {
                //
                //         let value = biomaterial[key];
                //         if (value) {
                //
                //             if (value instanceof Array) {
                //
                //                 value = value.join(",");
                //             }
                //
                //
                //             acc[key] = value;
                //         }
                //
                //     });
                //
                //     return acc;
                //
                //
                // }, {});


                let specimens = this.rollUpMetadata(row.specimens);
                let processes = this.rollUpMetadata(row.processes);

                let file = row.files[0] || {};

                /* File counts for primary file format (fastq.qz) and other */
                let fileCounts = row.files.reduce((acc, file) => {

                    if ( file.format === "fastq.gz" ) {
                        acc.primaryCount++;
                    }
                    else {
                        acc.secondaryCount++;
                    }
                    return acc;

                }, {primaryCount: 0, secondaryCount: 0});

                return {
                    fileName: file.name,
                    specimenId: this.getSelfOrFirst(specimens.id),
                    organ: specimens.organ,
                    organPart: specimens.organPart,
                    libraryConstructionApproach: processes.libraryConstructionApproach,
                    genusSpecies: specimens.genusSpecies,
                    organismAge: specimens.organismAge,
                    ageUnit: specimens.organismAgeUnit,
                    biologicalSex: specimens.biologicalSex,
                    disease: specimens.disease,
                    fileTypePrimary: fileCounts.primaryCount,
                    fileTypeSecondary: fileCounts.secondaryCount,
                    totalCells: specimens.totalCells
                };
            });
        });
    }

    // Each bundle contains multiple biomaterials which are in a hierarchy
    // leading back to the root biomaterial. Biomarerials are in an array.
    // This rolls up the metadata values to a single object.

    rollUpMetadata(array): any {

        // if the array is empty we have no values.
        if ( !array ) {
            return {};
        }

        // for each element in the array
        const rollup = array.reduce((acc, element) => {

            // get its own keys and their values.
            Object.keys(element).forEach((key) => {
                let value = element[key];

                // skip null values
                if ( value ) {

                    // flatten arrays
                    if ( value instanceof Array ) {
                        value = value.join(",");
                    }


                    if ( key === "totalCells" ) {

                        if ( acc[key] ) {
                            acc[key] = acc[key] + value;
                        }
                        else {
                            acc[key] = value;
                        }

                    }
                    else {

                        // if the value is different from an existing key...
                        let cellValues;

                        try {
                            cellValues = acc[key] ? acc[key].split(",") : [];
                        }
                        catch (error) {
                            console.log(key);
                            console.log(value);
                            console.log(acc[key]);
                        }


                        if ( cellValues.length ) {
                            if ( !cellValues.some(cellValue => cellValue === value) ) {
                                // apend the value to the existing key
                                acc[key] = acc[key] + ", " + value;
                            }
                        }
                        else {
                            // if no existing key or the vaues are the same just set the value.
                            acc[key] = value;
                        }
                    }
                }
            });

            return acc;

        }, {});

        return rollup;

    }

    public getSelfOrFirst(value) {
        const vals = value.split(",");
        return vals[0];
    }


    connect(): Observable<Element[]> {
        return this.element$;
    }

    disconnect() {
    }
}