/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Model of raw HTTP matrix response, before it is parsed into FE-friendly format (ie MatrixReponse).
 */

export interface MatrixHttpResponse {

    eta: string;
    key: string;
    links: any[];
    message: string;
    request_id: string;
    status: string;
}
