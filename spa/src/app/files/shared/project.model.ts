/**
 * Human Cell Atlas
 * https://www.humancellatlas.org/
 *
 * Model of JSON response returned from project API.
 */

// App dependencies
import { ProjectRow } from "../hca-table-projects/project-row.model";
import { Contributor } from "./contributor.model";
import { Publication } from "./publication.model";

export interface Project extends ProjectRow {
    arrayExpressAccessions: string[];
    contributors: Contributor[];
    geoSeriesAccessions: string[];
    insdcProjectAccessions: string[];
    insdcStudyAccessions: string[];
    projectDescription: string;
    publications: Publication[];
    redirectUrl: string; // Redirect URL is only specified if project has been withdrawn
    supplementaryLinks: string[];
    withdrawn: boolean;
}
