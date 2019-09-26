/**
 * Human Cell Atlas
 * https://www.humancellatlas.org/
 *
 * Mock of project detail with various values, to be exercised by the project spec.
 */

// Example of project detail with single values
export const PROJECT_DETAIL_SINGLE_VALUES = {
    "ageUnit": "month",
    "arrayExpressAccessions": "E-AAAA-00",
    "bamCount": 2,
    "biologicalSex": "female",
    "contributors": [
        {
            "contactName": "Spyros,,Darmanis",
            "correspondingContributor": true,
            "email": "spyros.darmanis@czbiohub.org",
            "institution": "Biohub",
            "laboratory": "Quake",
            "projectRole": "principal investigator"
        },
    ],
    "disease": "H syndrome",
    "donorCount": 10,
    "entryId": "2cd14cf5-f8e0-4c97-91a2-9e8957f41ea8",
    "fileType": ["fastq.gz"],
    "genusSpecies": "Homo sapiens",
    "geoSeriesAccessions": "GSE00000",
    "insdcProjectAccessions": "SRP000000",
    "insdcStudyAccessions": "PRJNA000000",
    "libraryConstructionApproach": "10X v2 sequencing",
    "matrixCount": 1,
    "modelOrgan": "brain",
    "organ": "brain",
    "organPart": "amygdala",
    "organismAge": "20",
    "otherCount": 16,
    "pairedEnd": "false",
    "projectDescription": "Contains a small file set from the dataset: 4k PBMCs from a Healthy Donor, a Single Cell Gene Expression Dataset by Cell Ranger 2.1.0. Peripheral blood mononuclear cells (PBMCs) were taken from a healthy donor (same donor as pbmc8k). PBMCs are primary cells with relatively small amounts of RNA (~1pg RNA/cell). Data/Analysis can be found here https://support.10xgenomics.com/single-cell-gene-expression/datasets/2.1.0/pbmc4k and all data is licensed under the creative commons attribution license (https://creativecommons.org/licenses/by/4.0/). This test also contains extensive metadata for browser testing. Metadata is fabricated.",
    "projectShortname": "integration/optimus/2019-09-24T11:02:18Z",
    "projectTitle": "Tabula Muris: Transcriptomic characterization of 20 organs and tissues from Mus musculus at single cell resolution",
    "publications": [
        {
            "publicationTitle": "Transcriptomic characterization of 20 organs and tissues from mouse at single cell resolution creates a Tabula Muris",
            "publicationUrl": "https://www.biorxiv.org/content/early/2018/03/29/237446"
        }],
    "rawCount": 199640,
    "sampleEntityType": "cellLines",
    "selectedCellType": "arcuate artery endothelial cell",
    "totalCells": 53755,
    "totalCount": 199640,
    "workflow": "optimus_v1.3.1"
};

// Example of project detail with multiple values
export const PROJECT_DETAIL_MULTIPLE_VALUES = {
    "ageUnit": "month, year",
    "arrayExpressAccessions": "E-MTAB-7427, E-MTAB-7417",
    "bamCount": 2,
    "biologicalSex": "female, male",
    "contributors": [
        {
            "contactName": "Spyros,,Darmanis",
            "correspondingContributor": true,
            "email": "spyros.darmanis@czbiohub.org",
            "institution": "Biohub",
            "laboratory": "Quake",
            "projectRole": "principal investigator"
        },
        {
            "contactName": "Jane,,Smith",
            "correspondingContributor": false,
            "email": "j.smith@smithemail.org",
            "institution": "University of Washington",
            "laboratory": "Department of Biology",
            "projectRole": "computational scientist"
        },
    ],
    "disease": "colitis (disease), ulcerative colitis (disease)",
    "donorCount": 10,
    "entryId": "2cd14cf5-f8e0-4c97-91a2-9e8957f41ea8",
    "fileType": ["fastq.gz", "bam"],
    "genusSpecies": "Homo sapiens, Mus musculus",
    "geoSeriesAccessions": "GSE95446, GSE95435",
    "insdcProjectAccessions": "SRP145547, SRP100786",
    "insdcStudyAccessions": "PRJNA471188, PRJNA377118",
    "libraryConstructionApproach": "Smart-Seq, 10X 3' v2 sequencing",
    "matrixCount": 1,
    "modelOrgan": "brain, tissue",
    "organ": "brain, liver",
    "organPart": "amygdala, lamina propria of mucosa of colon",
    "organismAge": "20, 30",
    "otherCount": 16,
    "pairedEnd": "false, true",
    "projectDescription": "Contains a small file set from the dataset: 4k PBMCs from a Healthy Donor, a Single Cell Gene Expression Dataset by Cell Ranger 2.1.0. Peripheral blood mononuclear cells (PBMCs) were taken from a healthy donor (same donor as pbmc8k). PBMCs are primary cells with relatively small amounts of RNA (~1pg RNA/cell). Data/Analysis can be found here https://support.10xgenomics.com/single-cell-gene-expression/datasets/2.1.0/pbmc4k and all data is licensed under the creative commons attribution license (https://creativecommons.org/licenses/by/4.0/). This test also contains extensive metadata for browser testing. Metadata is fabricated.",
    "projectShortname": "integration/optimus/2019-09-24T11:02:18Z",
    "projectTitle": "Tabula Muris: Transcriptomic characterization of 20 organs and tissues from Mus musculus at single cell resolution",
    "publications": [
        {
            "publicationTitle": "Transcriptomic characterization of 20 organs and tissues from mouse at single cell resolution creates a Tabula Muris",
            "publicationUrl": "https://www.biorxiv.org/content/early/2018/03/29/237446"
        },
        {
            "publicationTitle": "A single‐cell transcriptome atlas of the adult human retina",
            "publicationUrl": "https://www.ncbi.nlm.nih.gov/pubmed/31436334"
        }],
    "rawCount": 199640,
    "sampleEntityType": "cellLines, specimens",
    "selectedCellType": "arcuate artery endothelial cell, stromal cell",
    "totalCells": 53755,
    "totalCount": 199640,
    "workflow": "optimus_v1.3.1, optimus_v1.3.2"
};

// Example of project detail with empty values
export const PROJECT_DETAIL_EMPTY_VALUES = {
    "ageUnit": "",
    "arrayExpressAccessions": "",
    "bamCount": "",
    "biologicalSex": "",
    "contributors": [],
    "disease": "",
    "donorCount": "",
    "entryId": "2cd14cf5-f8e0-4c97-91a2-9e8957f41ea8",
    "fileType": [],
    "genusSpecies": "",
    "geoSeriesAccessions": "",
    "insdcProjectAccessions": "",
    "insdcStudyAccessions": "",
    "libraryConstructionApproach": "",
    "matrixCount": "",
    "modelOrgan": "",
    "organ": "",
    "organPart": "",
    "organismAge": "",
    "otherCount": "",
    "pairedEnd": "",
    "projectDescription": "",
    "projectShortname": "",
    "projectTitle": "",
    "publications": [],
    "rawCount": "",
    "sampleEntityType": "",
    "selectedCellType": "",
    "totalCells": "",
    "totalCount": "",
    "workflow": ""
};

// Example of project detail with unspecified values
export const PROJECT_DETAIL_UNSPECIFIED_VALUES = {
    "ageUnit": "Unspecified",
    "arrayExpressAccessions": "Unspecified",
    "bamCount": "Unspecified",
    "biologicalSex": "Unspecified",
    "contributors": [
        {
            "contactName": "Unspecified",
            "correspondingContributor": false,
            "email": "Unspecified",
            "institution": "Unspecified",
            "laboratory": "Unspecified",
            "projectRole": "Unspecified"
        }
    ],
    "disease": "Unspecified",
    "donorCount": "Unspecified",
    "entryId": "2cd14cf5-f8e0-4c97-91a2-9e8957f41ea8",
    "fileType": ["Unspecified"],
    "genusSpecies": "Unspecified",
    "geoSeriesAccessions": "Unspecified",
    "insdcProjectAccessions": "Unspecified",
    "insdcStudyAccessions": "Unspecified",
    "libraryConstructionApproach": "Unspecified",
    "matrixCount": "Unspecified",
    "modelOrgan": "Unspecified",
    "organ": "Unspecified",
    "organPart": "Unspecified",
    "organismAge": "Unspecified",
    "otherCount": "Unspecified",
    "pairedEnd": "Unspecified",
    "projectDescription": "Unspecified",
    "projectShortname": "Unspecified",
    "projectTitle": "Unspecified",
    "publications": [
        {
            "publicationTitle": "Unspecified",
            "publicationUrl": "Unspecified"
        },
    ],
    "rawCount": "Unspecified",
    "sampleEntityType": "Unspecified",
    "selectedCellType": "Unspecified",
    "totalCells": "Unspecified",
    "totalCount": "Unspecified",
    "workflow": "Unspecified"
};

// Example of project detail with null values
export const PROJECT_DETAIL_NULL_VALUES = {
    "ageUnit": null,
    "arrayExpressAccessions": null,
    "bamCount": null,
    "biologicalSex": null,
    "contributors": null,
    "disease": null,
    "donorCount": null,
    "entryId": "2cd14cf5-f8e0-4c97-91a2-9e8957f41ea8",
    "fileType": null,
    "genusSpecies": null,
    "geoSeriesAccessions": null,
    "insdcProjectAccessions": null,
    "insdcStudyAccessions": null,
    "libraryConstructionApproach": null,
    "matrixCount": null,
    "modelOrgan": null,
    "organ": null,
    "organPart": null,
    "organismAge": null,
    "otherCount": null,
    "pairedEnd": null,
    "projectDescription": null,
    "projectShortname": null,
    "projectTitle": null,
    "publications": null,
    "rawCount": null,
    "sampleEntityType": null,
    "selectedCellType": null,
    "totalCells": null,
    "totalCount": null,
    "workflow": null
};

// Example of project detail with specific values,
// sample entity type as "specimens",
// workflow as "Unspecified"
export const PROJECT_DETAIL_SPECIFIC_VALUES = {
    "ageUnit": "month",
    "arrayExpressAccessions": "E-AAAA-00",
    "bamCount": 2,
    "biologicalSex": "female",
    "contributors": [
        {
            "contactName": "Spyros,,Darmanis",
            "correspondingContributor": true,
            "email": "spyros.darmanis@czbiohub.org",
            "institution": "Biohub",
            "laboratory": "Quake",
            "projectRole": "principal investigator"
        },
    ],
    "disease": "H syndrome",
    "donorCount": 10,
    "entryId": "2cd14cf5-f8e0-4c97-91a2-9e8957f41ea8",
    "fileType": ["fastq.gz"],
    "genusSpecies": "Homo sapiens",
    "geoSeriesAccessions": "GSE00000",
    "insdcProjectAccessions": "SRP000000",
    "insdcStudyAccessions": "PRJNA000000",
    "libraryConstructionApproach": "10X v2 sequencing",
    "matrixCount": 1,
    "modelOrgan": "Unspecified",
    "organ": "brain",
    "organPart": "amygdala",
    "organismAge": "20",
    "otherCount": 16,
    "pairedEnd": "false",
    "projectDescription": "Contains a small file set from the dataset: 4k PBMCs from a Healthy Donor, a Single Cell Gene Expression Dataset by Cell Ranger 2.1.0. Peripheral blood mononuclear cells (PBMCs) were taken from a healthy donor (same donor as pbmc8k). PBMCs are primary cells with relatively small amounts of RNA (~1pg RNA/cell). Data/Analysis can be found here https://support.10xgenomics.com/single-cell-gene-expression/datasets/2.1.0/pbmc4k and all data is licensed under the creative commons attribution license (https://creativecommons.org/licenses/by/4.0/). This test also contains extensive metadata for browser testing. Metadata is fabricated.",
    "projectShortname": "integration/optimus/2019-09-24T11:02:18Z",
    "projectTitle": "Tabula Muris: Transcriptomic characterization of 20 organs and tissues from Mus musculus at single cell resolution",
    "publications": [
        {
            "publicationTitle": "Transcriptomic characterization of 20 organs and tissues from mouse at single cell resolution creates a Tabula Muris",
            "publicationUrl": "https://www.biorxiv.org/content/early/2018/03/29/237446"
        }],
    "rawCount": 199640,
    "sampleEntityType": "specimens",
    "selectedCellType": "arcuate artery endothelial cell",
    "totalCells": 53755,
    "totalCount": 199640,
    "workflow": "optimus_v1.3.1"
};