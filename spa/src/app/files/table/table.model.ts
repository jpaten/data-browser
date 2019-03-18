/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Model of table that displays file facet data, specific to an entity (eg projects, specimens, files).
 */

// App dependencies
import { PaginationModel } from "./pagination.model";

export interface TableModel {

    pagination: PaginationModel;
    data: any[];
    loading?: boolean;
    tableName: string;
    termCountsByFacetName: Map<string, number>;
}
