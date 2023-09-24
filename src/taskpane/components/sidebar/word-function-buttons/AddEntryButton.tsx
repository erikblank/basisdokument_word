import { ArrowBendLeftUp, Plus } from "phosphor-react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useCase, useSection, useUser } from "../../../contexts";
import { IEntry, UserRole } from "../../../types";
import { createEntry } from "../../../word-utils/WordEntryService";
import { getLastCCOfSection } from "../../../word-utils/WordSectionService";
import WFButton from "./WFButton";

/* global Word */

interface AddEntryButtonProps {
  sectionId: string;
  associatedEntry?: string;
}

const AddEntryButton = ({ sectionId, associatedEntry }: AddEntryButtonProps) => {
  const { user } = useUser();
  const { entries, setEntries } = useCase();
  const { sectionList } = useSection();
  const { currentVersion } = useCase();
  const [isLoading, setIsLoading] = useState(false);

  const createNewEntry = () => {
    if (user.role === UserRole.Plaintiff || user.role === UserRole.Defendant) {
      const newEntryCount = entries.filter((entry) => entry.sectionId === sectionId).length + 1;
      const entryCodePrefix = user.role === UserRole.Plaintiff ? "K" : "B";
      const sectionNumber = sectionList.findIndex((section) => section.id === sectionId) + 1;
      const newEntry: IEntry = {
        id: uuidv4(),
        entryCode: `${entryCodePrefix}-${sectionNumber}-${newEntryCount}`,
        author: user.name,
        role: user.role,
        sectionId,
        text: "",
        version: currentVersion,
        evidences: [],
      };
      if (associatedEntry) {
        newEntry.associatedEntry = associatedEntry;
      }

      setEntries((prevEntries) => [...prevEntries, newEntry]);
      return newEntry;
    }
    return null;
  };

  const handleCreateEntry = async () => {
    setIsLoading(true);

    try {
      await Word.run(async (context) => {
        const selection = await getLastCCOfSection(context, sectionId, entries);

        // insert entry
        if (selection) {
          const newEntry = createNewEntry();

          createEntry(selection, newEntry, entries, user.role, currentVersion, true);
          await context.sync();
        }
      });
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  return (
    <WFButton
      icon={associatedEntry ? <ArrowBendLeftUp weight="bold" /> : <Plus weight="bold" />}
      onClick={handleCreateEntry}
      label={associatedEntry ? "Auf Beitrag Bezug nehmen" : "Beitrag hinzufügen"}
      disabled={isLoading}
    />
  );
};

export default AddEntryButton;
