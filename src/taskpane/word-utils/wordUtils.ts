/* global Word, console */

import { IEntry, IMetaData, ISection, UserRole } from "../types";

export const clearBody = async () => {
  await Word.run(async (context) => {
    // Clear the entire content of the document's body
    context.document.body.clear();
    await context.sync();
  });
};

export const createTitle = async () => {
  await Word.run((context) => {
    const body = context.document.body;
    const title = body.insertParagraph("Basisdokument", Word.InsertLocation.start);
    const titleCC = title.insertContentControl();
    titleCC.styleBuiltIn = Word.BuiltInStyleName.title;
    titleCC.appearance = "Hidden";
    titleCC.cannotEdit = true;
    titleCC.cannotDelete = true;
    // set selection to end
    body.select(Word.SelectionMode.end);
    return context.sync();
  });
};

export const createMetaData = async (metaData: IMetaData) => {
  await Word.run((context) => {
    const selection = context.document.body.getRange(Word.RangeLocation.end);
    const title = createMetaDataTitle(selection);

    const plainTiffTitle = createMetaDataSubTitle(title, UserRole.Plaintiff);
    const platinTiffText = createMetaDataText(plainTiffTitle, metaData, UserRole.Plaintiff);

    const defendantTitle = createMetaDataSubTitle(platinTiffText, UserRole.Defendant);
    createMetaDataText(defendantTitle, metaData, UserRole.Defendant);

    return context.sync();
  });
};

export const createMetaDataTitle = (selection: Word.Range) => {
  const titleP = selection.insertParagraph("Rubrum", Word.InsertLocation.after);
  const titleCC = titleP.insertContentControl();
  titleCC.styleBuiltIn = "Heading1";
  titleCC.appearance = "Hidden";
  titleCC.cannotEdit = true;
  titleCC.cannotDelete = true;
  return titleCC;
};

const createMetaDataSubTitle = (selection: Word.ContentControl, role: UserRole.Defendant | UserRole.Plaintiff) => {
  const title = role.toString();
  const sectionTitleP = selection.insertParagraph(title, Word.InsertLocation.after);
  sectionTitleP.styleBuiltIn = "Heading2";

  // wrap title with ContentControl
  const sectionTitleCC = sectionTitleP.insertContentControl();
  sectionTitleCC.tag = title;
  sectionTitleCC.appearance = "Hidden";
  sectionTitleCC.cannotEdit = true;
  sectionTitleCC.cannotDelete = true;
  return sectionTitleCC;
};

const createMetaDataText = (
  selection: Word.ContentControl,
  metaData: IMetaData,
  role: UserRole.Defendant | UserRole.Plaintiff
) => {
  const emptyP = selection.insertParagraph("", Word.InsertLocation.after);
  const metaDataText = role === UserRole.Plaintiff ? metaData.plaintiff : metaData.defendant;
  const entryP = emptyP.insertHtml(metaDataText, Word.InsertLocation.replace);
  entryP.styleBuiltIn = "Normal";

  // todo change props
  const entryCC = entryP.insertContentControl();
  entryCC.appearance = "BoundingBox";
  entryCC.placeholderText = "Noch kein Rubrum erstellt";
  entryCC.tag = `Rubrum ${role}`;
  entryCC.title = `Rubrum ${role}`;
  entryCC.cannotEdit = true;
  entryCC.cannotDelete = true;
  return entryCC;
};

export const createSections = async (
  sections: ISection[],
  entries: IEntry[],
  userRole: UserRole,
  currVersion: number
) => {
  sections.forEach(async (section, index) => {
    await Word.run(async (context) => {
      const selection = context.document.body.getRange(Word.RangeLocation.end);

      // insert Gliederungspunkt titel
      const title = createSectionTitle(selection, section, index);
      createSectionSubTitlesAndEntries(title, section, entries, userRole, currVersion);
      await context.sync();
      const pBreak = title.getRange("Before").insertParagraph("", "After");
      pBreak.styleBuiltIn = "Normal";

      return context.sync();
    });
  });
};

const createSectionTitle = (selection: Word.Range, section: ISection, index: number) => {
  const titleP = selection.insertParagraph(`${index + 1}. Gliederungspunkt`, Word.InsertLocation.after);
  const titleCC = titleP.insertContentControl();
  titleCC.styleBuiltIn = "Heading1";
  titleCC.tag = section.id;
  titleCC.title = "Titel";
  titleCC.appearance = "Hidden";
  titleCC.cannotEdit = true;
  titleCC.cannotDelete = true;

  return titleCC;
};

// titles for section of defendant and plaintiff
const createSectionSubTitlesAndEntries = (
  selection: Word.ContentControl,
  section: ISection,
  entries: IEntry[],
  userRole: UserRole,
  currVersion: number
) => {
  const isOldPlainTiff =
    section.titlePlaintiffVersion != null &&
    section.titlePlaintiffVersion < currVersion &&
    !(typeof section.titlePlaintiff === "string" && section.titlePlaintiff.trim().length === 0);

  const isOldDefendant =
    section.titleDefendantVersion != null &&
    section.titleDefendantVersion < currVersion &&
    !(typeof section.titleDefendant === "string" && section.titlePlaintiff.trim().length === 0);

  const plainTiffCC = createSectionSubTitle(selection, section, UserRole.Plaintiff, userRole, isOldPlainTiff);
  const defendantCC = createSectionSubTitle(plainTiffCC, section, UserRole.Defendant, userRole, isOldDefendant);
  createEntries(defendantCC, section, entries, userRole);
};

const createSectionSubTitle = (
  selection: Word.ContentControl,
  section: ISection,
  role: UserRole.Defendant | UserRole.Plaintiff,
  authenticatedUser: UserRole,
  isOld: boolean
) => {
  const title = role === UserRole.Defendant ? section.titleDefendant : section.titlePlaintiff;
  const sectionTitleP = selection.insertParagraph(title, Word.InsertLocation.after);
  sectionTitleP.styleBuiltIn = "Heading2";

  // wrap title with ContentControl
  const sectionTitleCC = sectionTitleP.insertContentControl();
  sectionTitleCC.appearance = "BoundingBox";
  sectionTitleCC.placeholderText = "Titel Klagepartei noch nicht vergeben";
  sectionTitleCC.tag = section.id;
  sectionTitleCC.title = "Titel Klagepartei";
  sectionTitleCC.cannotEdit = isOld || (role !== authenticatedUser && authenticatedUser !== UserRole.Judge);
  sectionTitleCC.cannotDelete = true;
  return sectionTitleCC;
};

const createEntries = (
  selection: Word.ContentControl,
  section: ISection,
  entries: IEntry[],
  authenticatedUser: UserRole
) => {
  const sectionEntries = entries.filter((entry) => entry.sectionId === section.id);
  sectionEntries.forEach((entry) => {
    console.log(authenticatedUser);
    const entryTitleCC = createEntryTitle(selection, entry);
    createEntryText(entryTitleCC, entry);
  });
};

const createEntryTitle = (selection: Word.ContentControl, entry: IEntry) => {
  const entryP = selection.insertParagraph(`${entry.entryCode}: ${entry.author}`, Word.InsertLocation.after);
  entryP.styleBuiltIn = "Heading3";

  const entryCC = entryP.insertContentControl();
  entryCC.appearance = "BoundingBox";
  entryCC.placeholderText = "Titel Klagepartei noch nicht vergeben";
  entryCC.tag = entry.entryCode;
  entryCC.title = entry.role;
  entryCC.cannotEdit = true;
  entryCC.cannotDelete = true;
  return entryCC;
};

const createEntryText = (selection: Word.ContentControl, entry: IEntry) => {
  const emptyP = selection.insertParagraph("", Word.InsertLocation.after);
  const entryP = emptyP.insertHtml(entry.text, Word.InsertLocation.replace);
  entryP.styleBuiltIn = "Normal";

  // todo change props
  const entryCC = entryP.insertContentControl();
  entryCC.appearance = "BoundingBox";
  entryCC.placeholderText = "Titel Klagepartei noch nicht vergeben";
  entryCC.tag = entry.entryCode;
  entryCC.title = "Beitragstext";
  entryCC.cannotEdit = true;
  entryCC.cannotDelete = true;
  return entryCC;
};
