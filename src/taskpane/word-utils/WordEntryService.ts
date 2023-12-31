/* global Word */

import { IEntry, ISection, UserRole } from "../types";
import {
  TITLE_ASSOCIATED_ENTRY,
  TITLE_ENTRY_TEXT_DEFENDANT,
  TITLE_ENTRY_TEXT_PLAINTIFF,
  TITLE_ENTRY_TITLE_DEFENDANT,
  TITLE_ENTRY_TITLE_PLAINTIFF,
} from "./titles";
import { isOldEntry } from "./wordUtils";

export const createEntries = (
  selection: Word.ContentControl,
  section: ISection,
  entries: IEntry[],
  authenticatedUser: UserRole,
  currentVersion: number,
  select?: boolean
) => {
  const sectionEntries = entries.filter((entry) => entry.sectionId === section.id);
  sectionEntries.forEach((entry) => {
    selection = createEntry(selection, entry, entries, authenticatedUser, currentVersion, select);
  });
};

export const createEntry = (
  selection: Word.ContentControl,
  entry: IEntry,
  entries: IEntry[],
  authenticatedUser: UserRole,
  currentVersion: number,
  select?: boolean
) => {
  const canEdit = entry.role === authenticatedUser && !isOldEntry(entry, currentVersion);
  const entryTitleCC = createEntryTitle(selection, entry, entries);
  return createEntryText(entryTitleCC, entry, canEdit, select);
};

const createEntryTitle = (selection: Word.ContentControl, entry: IEntry, entries: IEntry[]) => {
  const entryP = selection.insertParagraph(`${entry.entryCode}: ${entry.author}`, Word.InsertLocation.after);
  entryP.styleBuiltIn = "Heading3";

  const entryCC = entryP.insertContentControl();
  entryCC.placeholderText = `Titel ${
    entry.role === UserRole.Plaintiff ? "Klagepartei" : "Beklagtenpartei"
  } für Beitrag noch nicht vergeben`;
  entryCC.tag = entry.id;
  entryCC.title = entry.role === UserRole.Plaintiff ? TITLE_ENTRY_TITLE_PLAINTIFF : TITLE_ENTRY_TITLE_DEFENDANT;
  entryCC.appearance = "Hidden";
  entryCC.cannotEdit = true;
  entryCC.cannotDelete = true;

  if (entry.associatedEntry) {
    const associatedEntry = entries.find((entryItem) => entryItem.id === entry.associatedEntry);
    const associatedEntryP = entryCC.insertParagraph(
      `Bezieht sich auf ${associatedEntry.entryCode}`,
      Word.InsertLocation.after
    );
    associatedEntryP.styleBuiltIn = Word.BuiltInStyleName.emphasis;

    const associatedEntryCC = associatedEntryP.insertContentControl();
    associatedEntryCC.appearance = "Hidden";
    associatedEntryCC.cannotDelete = true;
    associatedEntryCC.cannotEdit = true;
    associatedEntryCC.title = TITLE_ASSOCIATED_ENTRY;
    associatedEntryCC.tag = entry.id;
    return associatedEntryCC;
  }

  return entryCC;
};

const createEntryText = (selection: Word.ContentControl, entry: IEntry, canEdit: boolean, select?: boolean) => {
  const emptyP = selection.insertParagraph("", Word.InsertLocation.after);

  let entryCC: Word.ContentControl;
  if (entry.text) {
    const entryTextP = emptyP.insertHtml(entry.text, Word.InsertLocation.replace);
    entryCC = entryTextP.insertContentControl();
    entryTextP.styleBuiltIn = "Normal";
  } else {
    entryCC = emptyP.insertContentControl();
    emptyP.styleBuiltIn = "Normal";
  }

  entryCC.placeholderText = "Noch kein Text erstellt.";
  entryCC.styleBuiltIn = "Normal";
  entryCC.tag = entry.id;
  entryCC.title = entry.role === UserRole.Plaintiff ? TITLE_ENTRY_TEXT_PLAINTIFF : TITLE_ENTRY_TEXT_DEFENDANT;
  entryCC.appearance = canEdit ? "BoundingBox" : "Hidden";
  entryCC.cannotEdit = !canEdit;
  entryCC.cannotDelete = true;
  if (canEdit && select) {
    entryCC.select(Word.SelectionMode.select);
  }
  return entryCC;
};
