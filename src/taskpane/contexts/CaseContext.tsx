import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { IEntry, IHighlightedEntry, IIntroduction, IMetaData } from "../types";
import { useSection } from "./SectionContext";

interface ICaseContext {
  fileId: string;
  setFileId: Dispatch<SetStateAction<string>>;
  caseId: string;
  setCaseId: Dispatch<SetStateAction<string>>;
  metaData: IMetaData;
  setMetaData: Dispatch<SetStateAction<IMetaData>>;
  introduction: IIntroduction;
  setIntroduction: Dispatch<SetStateAction<IMetaData>>;
  entries: IEntry[];
  setEntries: Dispatch<SetStateAction<IEntry[]>>;
  groupedEntries: { [key: string]: { [key: string]: IEntry[] } };
  updateEntry: (entry: IEntry) => void;
  highlightedEntries: IHighlightedEntry[];
  setHighlightedEntries: Dispatch<SetStateAction<IHighlightedEntry[]>>;
  currentVersion: number;
  setCurrentVersion: Dispatch<SetStateAction<number>>;
}

export const CaseContext = createContext<ICaseContext | null>(null);

interface CaseProviderProps {
  children: React.ReactNode;
}

/**
 * Groups entries by their respectve entry and parent id.
 * @param entries The entries to group.
 * @returns Object containing the grouped entries.
 */
export const groupEntriesBySectionAndParent = (entries: IEntry[]) => {
  const groupedEntries = entries.reduce((acc, entry) => {
    acc[entry.sectionId] ||= {};
    if (entry.associatedEntry) {
      acc[entry.sectionId][entry.associatedEntry] ||= [];
      acc[entry.sectionId][entry.associatedEntry].push(entry);
    } else {
      acc[entry.sectionId]["parent"] ||= [];
      acc[entry.sectionId]["parent"].push(entry);
    }
    return acc;
  }, {} as { [key: string]: { [key: string]: IEntry[] } });
  return groupedEntries;
};

export const getEntryById = (entries: IEntry[], id: string) => {
  return entries.find((entry) => entry.id === id);
};

export const CaseProvider: React.FC<CaseProviderProps> = ({ children }) => {
  const [entries, setEntries] = useState<IEntry[]>([]);
  const [fileId, setFileId] = useState<string>("");
  const [caseId, setCaseId] = useState<string>("");
  const [metaData, setMetaData] = useState<IMetaData>({
    plaintiff: "",
    defendant: "",
  });
  const [introduction, setIntroduction] = useState<IIntroduction>({
    plaintiff: "",
    defendant: "",
  });
  const [highlightedEntries, setHighlightedEntries] = useState<IHighlightedEntry[]>([]);
  const [groupedEntries, setGroupedEntries] = useState<{
    [key: string]: {
      [key: string]: IEntry[];
    };
  }>({});
  const [currentVersion, setCurrentVersion] = useState<number>(0);

  const { sectionList } = useSection();

  useEffect(() => {
    setGroupedEntries(groupEntriesBySectionAndParent(entries));
  }, [entries, sectionList]);

  const updateEntry = (entry: IEntry) => {
    setEntries(entries.map((e) => (e.id === entry.id ? entry : e)));
  };

  return (
    <CaseContext.Provider
      value={{
        fileId,
        setFileId,
        caseId,
        setCaseId,
        currentVersion,
        setCurrentVersion,
        metaData,
        setMetaData,
        introduction,
        setIntroduction,
        entries,
        setEntries,
        groupedEntries,
        updateEntry,
        highlightedEntries,
        setHighlightedEntries,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => {
  const context = useContext(CaseContext);
  if (context === null) {
    throw new Error("useCase must be used within an CaseProvider");
  }
  return context;
};
