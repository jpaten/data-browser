/*
 * Human Cell Atlas
 * https://www.humancellatlas.org/
 *
 * Model of a project row in data table.
 */

// App dependencies
import { EntityRow } from "../table/entity-row.model";
import { FileTypeSummariesRow } from "../table/file-type-summaries-row.model";

export interface ProjectRow extends EntityRow, FileTypeSummariesRow {
    donorCount: number;
    entryId: string;
    projectShortname: string;
}