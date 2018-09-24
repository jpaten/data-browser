/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Data access object, connecting to project-related end points.
 */

// Core dependencies
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

// App depenencies
import { ConfigService } from "../../config/config.service";
import { Project } from "./project.model";
import { Contributor } from "./contributor.model";

// App dependencies

@Injectable()
export class ProjectDAO {

    /**
     * @param {ConfigService} configService
     * @param {HttpClient} httpClient
     */
    constructor(private configService: ConfigService, private httpClient: HttpClient) {
    }

    /**
     * Fet FileSummary
     *
     * http://docs.icgc.org/portal/api-endpoints/#!/repository/getSummary
     *
     * @param {string} projectId
     * @returns {Observable<Project>}
     */
    fetchProjectById(projectId: string): Observable<Project> {

        const url = this.buildApiUrl(`/repository/projects/${projectId}`);
        return this.httpClient.get<Project>(url).map(this.bindProject.bind(this));
    }

    /**
     * Privates
     */

    /**
     * Bind the raw response to Project object.
     *
     * @param {any} response
     * @returns {Project}
     */
    private bindProject(response: any): Project {

        // Grab the project from the response
        const responseProject = response.projects[0];
        if ( !responseProject ) {
            return {} as Project;
        }

        // Grab the summary from the response
        const responseProjectSummary = response.projectSummary;

        // Build up FE-friendly version of the project
        const mappedProject = {
            contributors: responseProject.contributors as Contributor[],
            entryId: response.entryId,
            cellCount: responseProjectSummary.totalCellCount,
            disease: responseProjectSummary.disease,
            donorCount: responseProjectSummary.donorCount,
            fileType: response.fileTypeSummaries.map(fileType => fileType.fileType),
            libraryConstructionApproach: responseProjectSummary.libraryConstructionApproach,
            organ: responseProjectSummary.organSummaries.map(organ => organ.organType),
            projectDescription: responseProject.projectDescription,
            projectTitle: responseProject.projectTitle,
            publications: responseProject.publications,
            species: responseProjectSummary.genusSpecies
        } as any;

        return mappedProject;
    }

    /**
     * Build full API URL
     *
     * @param url
     * @returns {string}
     */
    private buildApiUrl(url: string) {

        const domain = this.configService.getAPIURL();
        return `${domain}${url}`;
    }
}