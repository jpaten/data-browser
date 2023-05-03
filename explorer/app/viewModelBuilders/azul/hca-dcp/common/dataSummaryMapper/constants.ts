import { HCA_DCP_CATEGORY_LABEL } from "../../../../../../site-config/hca-dcp/category";

/**
 * Possible set of data summaries.
 */
export const enum DATA_SUMMARY {
  GENUS_SPECIES = "GENUS_SPECIES",
  ORGAN = "ORGAN", // anatomical entity
  ORGAN_PART = "ORGAN_PART",
  PROJECT_SHORTNAME = "PROJECT_SHORTNAME",
  SAMPLE_ENTITY_TYPE = "SAMPLE_ENTITY_TYPE",
}

/**
 * Display text for project data summaries.
 */
export const DATA_SUMMARY_DISPLAY_TEXT = {
  [DATA_SUMMARY.GENUS_SPECIES]: "Species",
  [DATA_SUMMARY.ORGAN]: HCA_DCP_CATEGORY_LABEL.ANATOMICAL_ENTITY, // anatomical entity
  [DATA_SUMMARY.ORGAN_PART]: HCA_DCP_CATEGORY_LABEL.ORGAN_PART,
  [DATA_SUMMARY.PROJECT_SHORTNAME]: "Project Label",
  [DATA_SUMMARY.SAMPLE_ENTITY_TYPE]: HCA_DCP_CATEGORY_LABEL.SAMPLE_ENTITY_TYPE,
};