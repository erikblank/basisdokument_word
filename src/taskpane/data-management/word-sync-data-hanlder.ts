import { useCase, useSection, useUser } from "../contexts";
import {
  extractRelevantHtmlFromWordHtml,
  isEntryByTitle,
  isMetaDataByTitle,
  isOldDefendant,
  isOldEntry,
  isOldPlaintiff,
  isSectionByTitle,
} from "../word-utils/wordUtils";
import {
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
} from "../word-utils/titles";
import { UserRole } from "../types";
import { useState } from "react";

/* global console, Word */

const useSyncWordData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { entries, setEntries, metaData, setMetaData, currentVersion } = useCase();
  const { user } = useUser();
  const { sectionList, setSectionList } = useSection();

  /* workaround: returns metaData for download usage, because metadata is not updated correctly in context */
  const syncWordData = async () => {
    setIsLoading(true);
    try {
      let metaDataModified = metaData;
      await Word.run(async (context) => {
        const contentControls = context.document.getContentControls();

        contentControls.load(["title", "tag", "text", "html"]);

        await context.sync();

        const newSectionList = [...sectionList];
        const newMetaData = { ...metaData };
        const newEntries = [...entries];

        let sectionsChanged = false;

        for (const cc of contentControls.items) {
          const title = cc.title;
          const tag = cc.tag;
          const text = cc.text;
          if (isSectionByTitle(title)) {
            if (title === TITLE_SECTION) {
              continue;
            }
            const sectionIndex = newSectionList.findIndex((section) => section.id === tag);
            if (
              title === TITLE_SECTION_DEFENDANT &&
              user.role === UserRole.Defendant &&
              !isOldDefendant(newSectionList[sectionIndex], currentVersion) &&
              newSectionList[sectionIndex].titleDefendant !== text
            ) {
              sectionsChanged = true;
              newSectionList[sectionIndex].titleDefendant = text;
            }
            if (
              title === TITLE_SECTION_PLAINTIFF &&
              user.role === UserRole.Plaintiff &&
              !isOldPlaintiff(newSectionList[sectionIndex], currentVersion) &&
              newSectionList[sectionIndex].titlePlaintiff !== text
            ) {
              sectionsChanged = true;
              newSectionList[sectionIndex].titlePlaintiff = text;
            }
          } else if (isEntryByTitle(title)) {
            if (title === TITLE_ENTRY_TITLE_DEFENDANT || title === TITLE_ENTRY_TITLE_PLAINTIFF) {
              continue;
            }
            const htmlContent = cc.getHtml();
            await context.sync();
            // eslint-disable-next-line office-addins/load-object-before-read
            const extractedHtml = extractRelevantHtmlFromWordHtml(htmlContent.value);

            const entryIndex = newEntries.findIndex((entry) => entry.id === tag);
            const isOld = isOldEntry(newEntries[entryIndex], currentVersion);
            if (title === TITLE_ENTRY_TEXT_PLAINTIFF && user.role === UserRole.Plaintiff && !isOld) {
              newEntries[entryIndex].text = extractedHtml;
            }
            if (title === TITLE_ENTRY_TEXT_DEFENDANT && user.role === UserRole.Defendant && !isOld) {
              newEntries[entryIndex].text = extractedHtml;
            }
          } else if (isMetaDataByTitle(title)) {
            isMetaDataByTitle(title);
            if (title === TITLE_META_DATA) {
              continue;
            }

            const htmlContent = cc.getHtml();

            await context.sync();

            // eslint-disable-next-line office-addins/load-object-before-read
            const extractedHtml = extractRelevantHtmlFromWordHtml(htmlContent.value);
            if (
              title === TITLE_META_DATA_DEFENDANT &&
              user.role === UserRole.Defendant &&
              newMetaData.defendant !== text
            ) {
              newMetaData.defendant = extractedHtml;
            }
            if (
              title === TITLE_META_DATA_PLAINTIFF &&
              user.role === UserRole.Plaintiff &&
              newMetaData.plaintiff !== text
            ) {
              newMetaData.plaintiff = extractedHtml;
            }
          }
        }
        sectionsChanged && setSectionList(newSectionList);
        setEntries(newEntries);
        setMetaData(newMetaData);
        metaDataModified = newMetaData;
      });
      return metaDataModified;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    return metaData;
  };

  return { isLoading, syncWordData, metaData };
};

export default useSyncWordData;
