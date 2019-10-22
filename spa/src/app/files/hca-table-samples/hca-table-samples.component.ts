/*
 * Human Cell Atlas
 * https://www.humancellatlas.org/
 *
 * Table component for displaying sample related data.
 */

// Core dependencies
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild
} from "@angular/core";
import { MatSort, MatSortHeader, Sort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { select, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";

// App dependencies
import { AppState } from "../../_ngrx/app.state";
import {
    selectFileSummary,
    selectPagination,
    selectTableData,
    selectTableLoading,
    selectTermCountsByFacetName
} from "../_ngrx/file.selectors";
import { FetchPagedOrSortedTableDataRequestAction } from "../_ngrx/table/table.actions";
import { FileSummary } from "../file-summary/file-summary";
import { SampleRowMapper } from "./sample-row-mapper";
import { PaginationModel } from "../table/pagination.model";
import {
    getAge,
    getColumnClass,
    getColumnDisplayName,
    getColumnStyle,
    getRowClass,
    isElementUnspecified
} from "../table/table-methods";
import { TableParamsModel } from "../table/table-params.model";
import { EntitiesDataSource } from "../table/entities.data-source";

@Component({
    selector: "hca-table-samples",
    templateUrl: "./hca-table-samples.component.html",
    styleUrls: ["./hca-table-samples.component.scss"]
})
export class HCATableSamplesComponent implements OnDestroy, OnInit {

    // Template variables
    data$: Observable<any[]>;
    defaultSortOrder = {
        sort: "sampleId",
        order: "asc"
    };
    displayedColumns = [
        "sampleId", "projectTitle", "genusSpecies", "sampleEntityType", "organ", "organPart", "selectedCellType", "libraryConstructionApproach", "pairedEnd", "workflow",
        "organismAge", "biologicalSex", "disease", "totalCells"
    ];
    domainCountsByColumnName$: Observable<Map<string, number>>;
    getAge = getAge;
    getColumnClass = getColumnClass;
    getColumnDisplayName = getColumnDisplayName;
    getColumnStyle = getColumnStyle;
    getRowClass = getRowClass;
    isElementUnspecified = isElementUnspecified;
    loading$: Observable<boolean>;
    selectFileSummary$: Observable<FileSummary>;
    dataSource: EntitiesDataSource<SampleRowMapper>;
    pagination$: Observable<PaginationModel>;

    // Locals
    private ngDestroy$ = new Subject();
    private dataLoaded$: Observable<boolean>;

    // View child/ren
    @ViewChild(MatSort, { static: false }) matSort: MatSort;
    @ViewChild(MatTable, { read: ElementRef, static: false }) matTableElementRef: ElementRef;

    /**
     * @param {Store<AppState>} store
     * @param {ChangeDetectorRef} cdref
     * @param {ElementRef} elementRef
     */
    constructor(private store: Store<AppState>,
                private cdref: ChangeDetectorRef,
                private elementRef: ElementRef) {
    }


    /**
     * Sort the table given the sort param and the order.
     *
     * @param {PaginationModel} pm
     * @param {Sort} sort
     */
    public sortTable(pm: PaginationModel, sort: Sort) {

        // Force table to be sorted by project title if sort is cleared. Sort is cleared when user clicks on column header
        // to sort asc, then clicks again on the same columm header to sort desc, then once more. The third click on the
        // same header clears the sort. We want to force the sort to go back to the default sort - project title. We must
        // use this workaround here (_handleClick) due to a defect in programmatically setting the sort order in
        // Material (https://github.com/angular/components/issues/10242).
        if ( !sort.direction ) {
            const defaultSortHeader = this.matSort.sortables.get(this.defaultSortOrder.sort) as MatSortHeader;
            defaultSortHeader._handleClick();
            return;
        }

        let tableParamsModel: TableParamsModel = {
            size: pm.size,
            sort: sort.active,
            order: sort.direction
        };

        this.store.dispatch(new FetchPagedOrSortedTableDataRequestAction(tableParamsModel));
    }

    /**
     * Lifecycle hooks
     */

    ngAfterContentChecked() {

        this.cdref.detectChanges();
    }

    /**
     * Kill subscriptions on destroy of component.
     */
    public ngOnDestroy() {

        this.ngDestroy$.next(true);
        this.ngDestroy$.complete();
    }

    /**
     *  Set up table data source and pagination
     */
    ngOnInit() {

        // Initialize the new data source with an observable of the table data.
        this.dataSource =
            new EntitiesDataSource<SampleRowMapper>(this.store.pipe(select(selectTableData)), SampleRowMapper);

        // Get an observable of the table data.
        this.data$ = this.store.pipe(select(selectTableData));

        // Get an observable of the loading status of table.
        this.loading$ = this.store.pipe(select(selectTableLoading));

        // Get an observable of the pagination model
        this.pagination$ = this.store.pipe(select(selectPagination));

        // Get the term counts for each facet - we'll use this as a basis for displaying a count of the current set of
        // values for each column
        this.domainCountsByColumnName$ = this.store.pipe(select(selectTermCountsByFacetName));

        // Get the summary counts - used by columns with SUMMARY_COUNT countType
        this.selectFileSummary$ = this.store.pipe(select(selectFileSummary));

        this.dataLoaded$ = this.data$.pipe(
            filter(data => !!data.length),
            map(() => true)
        );
    }
}
