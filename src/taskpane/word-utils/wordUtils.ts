/* global Word, console, document */

import { IEntry, ISection } from "../types";
import {
  TITLE_ASSOCIATED_ENTRY,
  TITLE_ENTRY_TEXT_DEFENDANT,
  TITLE_ENTRY_TEXT_PLAINTIFF,
  TITLE_ENTRY_TITLE_DEFENDANT,
  TITLE_ENTRY_TITLE_PLAINTIFF,
  TITLE_META_DATA,
  TITLE_META_DATA_DEFENDANT,
  TITLE_META_DATA_PLAINTIFF,
  TITLE_SECTION,
  TITLE_SECTION_DEFENDANT,
  TITLE_SECTION_PLAINTIFF,
} from "./titles";

export const clearBody = async () => {
  await Word.run(async (context) => {
    // Clear the entire content of the document's body
    const contentControls = context.document.contentControls;

    // Queue a command to load the id property for all of the content controls.
    contentControls.load("tag");

    // Synchronize the document state by executing the queued commands,
    // and return a promise to indicate task completion.
    await context.sync();
    if (contentControls.items.length === 0) {
      console.log("No content control found.");
    } else {
      // Queue a command to load the properties on the first content control.
      contentControls.items.forEach((item) => {
        item.cannotDelete = false;
      });

      contentControls.items.forEach((item) => {
        item.delete(false);
      });
    }
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

export const isSectionByTitle = (title: string) => {
  return title === TITLE_SECTION_PLAINTIFF || title === TITLE_SECTION_DEFENDANT || title === TITLE_SECTION;
};

export const isEntryByTitle = (title: string) => {
  return (
    title === TITLE_ENTRY_TEXT_DEFENDANT ||
    title === TITLE_ENTRY_TEXT_PLAINTIFF ||
    title === TITLE_ENTRY_TITLE_DEFENDANT ||
    title === TITLE_ENTRY_TITLE_PLAINTIFF ||
    title === TITLE_ASSOCIATED_ENTRY
  );
};

export const isMetaDataByTitle = (title: string) => {
  return title === TITLE_META_DATA || title === TITLE_META_DATA_PLAINTIFF || title === TITLE_META_DATA_DEFENDANT;
};

export const extractRelevantHtmlFromWordHtml = (wordHtml: string) => {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = wordHtml;

  // Find first div, where the other elements are inside
  const targetDiv = tempElement.querySelector("div");

  if (targetDiv) {
    // remove all word classes for raw html
    const innerElements = targetDiv.querySelectorAll("*");
    innerElements.forEach((element) => {
      element.removeAttribute("class");
    });

    // Extract the content within the target div
    const contentWithinDiv = targetDiv.innerHTML;

    //contains the HTML content within the specified div
    return contentWithinDiv.trim();
  } else {
    throw new Error("Could not convert received html from word");
  }
};

export const isOldPlaintiff = (section: ISection, currVersion: number) =>
  section.titlePlaintiffVersion != null &&
  section.titlePlaintiffVersion < currVersion &&
  !(typeof section.titlePlaintiff === "string" && section.titlePlaintiff.trim().length === 0);

export const isOldDefendant = (section: ISection, currVersion: number) =>
  section.titleDefendantVersion != null &&
  section.titleDefendantVersion < currVersion &&
  !(typeof section.titleDefendant === "string" && section.titlePlaintiff.trim().length === 0);

export const isOldEntry = (entry: IEntry, currentVersion: number) =>
  entry.version != null && entry.version < currentVersion;
