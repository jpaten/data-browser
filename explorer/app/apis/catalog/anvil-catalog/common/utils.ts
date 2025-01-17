import {
  sanitizeString,
  sanitizeStringArray,
} from "@clevercanary/data-explorer-ui/lib/viewModelBuilders/common/utils";
import {
  AnVILCatalogConsortium,
  AnVILCatalogEntity,
  AnVILCatalogStudy,
  AnVILCatalogStudyAny,
  AnVILCatalogWorkspace,
} from "./entities";

/**
 * Returns the id of the study (the dbGaP id).
 * @param anvilCatalogStudy - AnVIL study.
 * @returns String value of dbGapId.
 */
export const getStudyId = (anvilCatalogStudy: AnVILCatalogStudy): string =>
  anvilCatalogStudy.dbGapId || "";

/**
 * Returns the terra workspace name.
 * @param anvilCatalogWorkspace - AnVIL catalog workspace.
 * @returns String value of terra workspace name.
 */
export const getWorkspaceId = (
  anvilCatalogWorkspace: AnVILCatalogWorkspace
): string => anvilCatalogWorkspace.workspaceName ?? "";

/**
 * Returns the consortium.
 * @param anvilCatalogEntity - AnVIL consortium
 * @returns String value of consortium.
 */
export const getConsortiumId = (
  anvilCatalogEntity: AnVILCatalogEntity
): string => anvilCatalogEntity.consortium ?? "";

export const anvilCatalogStudyInputMapper = <
  StudyType extends AnVILCatalogStudyAny
>(
  input: StudyType
): StudyType => {
  return {
    ...input,
    studyName: sanitizeString(input.studyName),
  };
};

export const anvilCatalogWorkspaceInputMapper = (
  input: AnVILCatalogWorkspace
  // eslint-disable-next-line sonarjs/no-identical-functions -- //TODO remove this duplication
): AnVILCatalogWorkspace => {
  return {
    ...input,
    studyName: sanitizeString(input.studyName),
  };
};

export const anvilCatalogConsortiumInputMapper = (
  input: AnVILCatalogConsortium
): AnVILCatalogConsortium => {
  return {
    ...input,
    studies: input.studies.map(anvilCatalogStudyInputMapper),
    studyName: sanitizeStringArray(input.studyName),
    workspaces: input.workspaces.map(anvilCatalogWorkspaceInputMapper),
  };
};
