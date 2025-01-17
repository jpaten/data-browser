import { HCA_DCP_CATEGORY_LABEL } from "../../../../../../site-config/hca-dcp/category";

/**
 * Possible set of data summaries.
 */
export const enum DATA_SUMMARY {
  DEVELOPMENT_STAGE = "DEVELOPMENT_STAGE",
  DISEASE = "DISEASE",
  DONOR_COUNT = "DONOR_COUNT",
  DONOR_DISEASE = "DONOR_DISEASE",
  FILE_FORMAT = "FILE_FORMAT",
  GENUS_SPECIES = "GENUS_SPECIES",
  LIBRARY_CONSTRUCTION_APPROACH = "LIBRARY_CONSTRUCTION_APPROACH",
  MODEL_ORGAN = "MODEL_ORGAN",
  NUCLEIC_ACID_SOURCE = "NUCLEIC_ACID_SOURCE",
  ORGAN = "ORGAN", // anatomical entity
  ORGAN_PART = "ORGAN_PART",
  PAIRED_END = "PAIRED_END",
  PROJECT_SHORTNAME = "PROJECT_SHORTNAME",
  SAMPLE_ENTITY_TYPE = "SAMPLE_ENTITY_TYPE",
  SELECTED_CELL_TYPE = "SELECTED_CELL_TYPE",
  TOTAL_CELLS = "TOTAL_CELLS", // cell count estimate
  WORKFLOW = "WORKFLOW", // analysis protocol
}

/**
 * Display text for project data summaries.
 */
export const DATA_SUMMARY_DISPLAY_TEXT = {
  [DATA_SUMMARY.DEVELOPMENT_STAGE]: HCA_DCP_CATEGORY_LABEL.DEVELOPMENT_STAGE,
  [DATA_SUMMARY.DISEASE]: "Disease Status (Specimen)",
  [DATA_SUMMARY.DONOR_COUNT]: "Donor Count",
  [DATA_SUMMARY.DONOR_DISEASE]: "Disease Status (Donor)",
  [DATA_SUMMARY.FILE_FORMAT]: HCA_DCP_CATEGORY_LABEL.FILE_FORMAT,
  [DATA_SUMMARY.GENUS_SPECIES]: "Species",
  [DATA_SUMMARY.LIBRARY_CONSTRUCTION_APPROACH]:
    HCA_DCP_CATEGORY_LABEL.LIBRARY_CONSTRUCTION_METHOD,
  [DATA_SUMMARY.MODEL_ORGAN]: HCA_DCP_CATEGORY_LABEL.MODEL_ORGAN,
  [DATA_SUMMARY.NUCLEIC_ACID_SOURCE]:
    HCA_DCP_CATEGORY_LABEL.NUCLEIC_ACID_SOURCE,
  [DATA_SUMMARY.ORGAN]: HCA_DCP_CATEGORY_LABEL.ANATOMICAL_ENTITY, // anatomical entity
  [DATA_SUMMARY.ORGAN_PART]: HCA_DCP_CATEGORY_LABEL.ORGAN_PART,
  [DATA_SUMMARY.PAIRED_END]: HCA_DCP_CATEGORY_LABEL.PAIRED_END,
  [DATA_SUMMARY.PROJECT_SHORTNAME]: "Project Label",
  [DATA_SUMMARY.SAMPLE_ENTITY_TYPE]: HCA_DCP_CATEGORY_LABEL.SAMPLE_ENTITY_TYPE,
  [DATA_SUMMARY.SELECTED_CELL_TYPE]: "Selected Cell Types",
  [DATA_SUMMARY.TOTAL_CELLS]: HCA_DCP_CATEGORY_LABEL.EFFECTIVE_CELL_COUNT, // cell count estimate
  [DATA_SUMMARY.WORKFLOW]: HCA_DCP_CATEGORY_LABEL.ANALYSIS_PROTOCOL, // analysis protocol
};

/**
 * Data Portal pipeline path keyed by analysis protocol key.
 */
export const pipelineLinksByAnalysisProtocolKey: Record<string, string> = {
  optimus: "/pipelines/optimus-workflow",
  smartseq2: "/pipelines/smart-seq2-workflow",
};

/**
 * Possible set of sample entity types.
 */
export enum SAMPLE_ENTITY_TYPE {
  SPECIMENS = "specimens",
}

export const SMART_SEQ2 = "Smart-seq2";

export const SMART_SEQ2_WORKFLOW_PATH = "/pipelines/smart-seq2-workflow";
