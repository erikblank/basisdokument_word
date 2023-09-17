import { IEntry, ISection, UserRole } from "../types";
import { TITLE_SECTION_DEFENDANT, TITLE_SECTION_PLAINTIFF } from "./titles";
import { createEntries } from "./WordEntryService";

/* global Word */

export const createSections = async (
  sections: ISection[],
  entries: IEntry[],
  userRole: UserRole,
  currVersion: number
) => {
  sections.forEach(async (section, index) => {
    await createSection(section, index, entries, userRole, currVersion);
  });
};

export const createSection = async (
  section: ISection,
  index: number,
  entries: IEntry[],
  userRole: UserRole,
  currVersion: number
) => {
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
  sectionTitleCC.appearance = "BoundingBox";
  sectionTitleCC.placeholderText = `Titel ${
    role === UserRole.Plaintiff ? "Klagepartei" : "Beklagtenpartei"
  } für Gliederungspunkt noch nicht vergeben`;
  sectionTitleCC.tag = section.id;
  sectionTitleCC.title = role === UserRole.Plaintiff ? TITLE_SECTION_PLAINTIFF : TITLE_SECTION_DEFENDANT;
  sectionTitleCC.cannotEdit = isOld || (role !== authenticatedUser && authenticatedUser !== UserRole.Judge);
  sectionTitleCC.cannotDelete = true;
  return sectionTitleCC;
};
