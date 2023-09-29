import { IEntry, ISection, UserRole } from "../types";
import {
  TITLE_ENTRY_TEXT_DEFENDANT,
  TITLE_ENTRY_TEXT_PLAINTIFF,
  TITLE_SECTION,
  TITLE_SECTION_DEFENDANT,
  TITLE_SECTION_PLAINTIFF,
} from "./titles";
import { createEntries } from "./WordEntryService";

/* global Word */

export const createSections = async (
  sections: ISection[],
  entries: IEntry[],
  userRole: UserRole,
  currVersion: number
) => {
  sections.forEach(async (section, index) => {
    await createSectionOnEnd(section, index, entries, userRole, currVersion);
  });
};

export const createSectionOnEnd = async (
  section: ISection,
  index: number,
  entries: IEntry[],
  userRole: UserRole,
  currVersion: number
) => {
  await Word.run(async (context) => {
    const selection = context.document.body.getRange(Word.RangeLocation.end);

    await createSection(selection, section, index, entries, userRole, currVersion, context);

    return context.sync();
  });
};

export const createSection = async (
  selection: Word.Range,
  section: ISection,
  index: number,
  entries: IEntry[],
  userRole: UserRole,
  currVersion: number,
  context: Word.RequestContext,
  select?: boolean
) => {
  const title = createSectionTitle(selection, section, index);
  select && title.select(Word.SelectionMode.select);
  createSectionSubTitlesAndEntries(title, section, entries, userRole, currVersion);
  await context.sync();
  const pBreak = title.getRange("Before").insertParagraph("", "After");
  pBreak.styleBuiltIn = "Normal";
};
const createSectionTitle = (selection: Word.Range, section: ISection, index: number) => {
  const titleP = selection.insertParagraph(
    `${index !== undefined ? `${index + 1}. ` : ""}Gliederungspunkt`,
    Word.InsertLocation.after
  );
  const titleCC = titleP.insertContentControl();
  titleCC.styleBuiltIn = "Heading1";
  titleCC.tag = section.id;
  titleCC.title = TITLE_SECTION;
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
  createEntries(defendantCC, section, entries, userRole, currVersion);
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
  sectionTitleCC.placeholderText = `Titel ${
    role === UserRole.Plaintiff ? "Klagepartei" : "Beklagtenpartei"
  } für Gliederungspunkt noch nicht vergeben`;
  sectionTitleCC.tag = section.id;
  sectionTitleCC.title = role === UserRole.Plaintiff ? TITLE_SECTION_PLAINTIFF : TITLE_SECTION_DEFENDANT;
  const cannotEdit = isOld || (role !== authenticatedUser && authenticatedUser !== UserRole.Judge);
  sectionTitleCC.appearance = cannotEdit ? "Hidden" : "BoundingBox";
  sectionTitleCC.cannotEdit = cannotEdit;
  sectionTitleCC.cannotDelete = true;
  return sectionTitleCC;
};

export const getLastCCOfSection = async (context: Word.RequestContext, sectionId: string, entries: IEntry[]) => {
  const sectionEntries = entries.filter((entryItem) => entryItem.sectionId === sectionId);
  const contentControls = context.document.contentControls;
  contentControls.load(["tag", "title"]);
  await context.sync();

  if (sectionEntries.length > 0) {
    // get last entry
    const lastEntry = sectionEntries[sectionEntries.length - 1];

    // get last entry and choose cc of last entry as selection
    return contentControls.items.find(
      (cc) =>
        cc.tag === lastEntry.id && (cc.title === TITLE_ENTRY_TEXT_DEFENDANT || cc.title === TITLE_ENTRY_TEXT_PLAINTIFF)
    );
  } else {
    // get last cc of section
    return contentControls.items.find((cc) => cc.tag === sectionId && cc.title === TITLE_SECTION_DEFENDANT);
  }
};

export const updateIndexOfSectionTitles = async () => {
  await Word.run(async (context) => {
    const contentControls = context.document.contentControls;
    contentControls.load(["title"]);
    await context.sync();

    if (contentControls.items.length > 0) {
      const sectionTitleCCs = contentControls.items.filter((cc) => cc.title === TITLE_SECTION);
      sectionTitleCCs.forEach((cc, index) => {
        cc.cannotEdit = false;
        cc.insertText(`${index + 1}. Gliederungspunkt`, Word.InsertLocation.replace);
        cc.cannotEdit = true;
      });
    }

    return context.sync();
  });
};
