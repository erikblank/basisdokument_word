/* global Word */

import { IMetaData, UserRole } from "../types";
import { TITLE_META_DATA, TITLE_META_DATA_DEFENDANT, TITLE_META_DATA_PLAINTIFF } from "./titles";

export const createMetaData = async (metaData: IMetaData, userRole: UserRole) => {
  await Word.run((context) => {
    const selection = context.document.body.getRange(Word.RangeLocation.end);
    const title = createMetaDataTitle(selection);

    const plainTiffTitle = createMetaDataSubTitle(title, UserRole.Plaintiff);
    const platinTiffText = createMetaDataText(plainTiffTitle, metaData, UserRole.Plaintiff, userRole);

    const defendantTitle = createMetaDataSubTitle(platinTiffText, UserRole.Defendant);
    createMetaDataText(defendantTitle, metaData, UserRole.Defendant, userRole);

    return context.sync();
  });
};

export const createMetaDataTitle = (selection: Word.Range) => {
  const titleP = selection.insertParagraph("Rubrum", Word.InsertLocation.after);
  const titleCC = titleP.insertContentControl();
  titleCC.styleBuiltIn = "Heading1";
  titleCC.appearance = "Hidden";
  titleCC.title = TITLE_META_DATA;
  titleCC.cannotEdit = true;
  titleCC.cannotDelete = true;
  return titleCC;
};

const createMetaDataSubTitle = (selection: Word.ContentControl, role: UserRole.Defendant | UserRole.Plaintiff) => {
  const title = role.toString();
  const titleParagraph = selection.insertParagraph(title, Word.InsertLocation.after);
  titleParagraph.styleBuiltIn = "Heading2";

  // wrap title with ContentControl
  const sectionTitleCC = titleParagraph.insertContentControl();
  sectionTitleCC.tag = title;
  sectionTitleCC.appearance = "Hidden";
  sectionTitleCC.title = TITLE_META_DATA;
  sectionTitleCC.cannotEdit = true;
  sectionTitleCC.cannotDelete = true;
  return sectionTitleCC;
};

const createMetaDataText = (
  selection: Word.ContentControl,
  metaData: IMetaData,
  role: UserRole.Defendant | UserRole.Plaintiff,
  authUser: UserRole
) => {
  const emptyP = selection.insertParagraph("", Word.InsertLocation.after);
  const metaDataText = role === UserRole.Plaintiff ? metaData.plaintiff : metaData.defendant;
  const metaDataP = emptyP.insertHtml(
    metaDataText || "Bisher wurde noch kein Rubrum hinterlegt.",
    Word.InsertLocation.replace
  );
  metaDataP.styleBuiltIn = "Normal";

  const metaDataCC = metaDataP.insertContentControl();
  metaDataCC.appearance = "BoundingBox";
  metaDataCC.placeholderText = "Noch kein Rubrum erstellt";
  metaDataCC.tag = `Rubrum ${role}`;
  metaDataCC.title = role === UserRole.Plaintiff ? TITLE_META_DATA_PLAINTIFF : TITLE_META_DATA_DEFENDANT;
  const canEdit = authUser === role;
  metaDataCC.cannotEdit = !canEdit;
  metaDataCC.cannotDelete = true;

  return metaDataCC;
};
