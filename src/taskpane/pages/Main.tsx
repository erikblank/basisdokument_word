import React, { useEffect } from "react";
import { Sidebar } from "../components/sidebar/Sidebar";
import { useSection } from "../contexts";
import { updateIndexOfSectionTitles } from "../word-utils/WordSectionService";

/* const section: ISection = {
  id: "80456c3c-ab0d-453a-b92f-57020acd6d5b",
  num: 1,
  titleDefendant: "Gliederungspunkt defendant",
  titlePlaintiff: "Gliederung punkt 2 klage",
  titlePlaintiffVersion: 1,
  version: 0,
}; */

/* const entries: IEntry[] = [
  {
    id: "111",
    entryCode: "1-1-1",
    version: 1,
    text: "asdf",
    author: "a a",
    role: UserRole.Defendant,
    sectionId: "1",
    evidences: [],
  },
  {
    id: "222",
    entryCode: "1-1-2",
    version: 1,
    text: "asdf",
    author: "a a",
    role: UserRole.Plaintiff,
    sectionId: "1",
    evidences: [],
  },
  {
    id: "333",
    entryCode: "1-1-3",
    version: 1,
    text: "asdf",
    author: "a a",
    role: UserRole.Defendant,
    sectionId: "1",
    evidences: [],
    associatedEntry: "1-1-2",
  },
]; */

const Main = () => {
  /* const { entries } = useCase(); */
  const { sectionList } = useSection();

  useEffect(() => {
    updateIndexOfSectionTitles();
  }, [sectionList]);

  return (
    <>
      <Sidebar />
      {/* <ThemeProvider theme={theme}>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ flexGrow: 1, overflowY: "auto" }}
        >
          {sectionList.map((section, index) => {
            const filteredEntries = entries.filter((entry) => entry.sectionId === section.id);
            return (
              <SectionTreeItem key={section.id} nodeId={section.id} section={section} position={index + 1}>
                {filteredEntries.map((entry) => (
                  <EntryTreeItem key={entry.id} nodeId={entry.id} entry={entry} />
                ))}
              </SectionTreeItem>
            );
          })}
        </TreeView>
      </ThemeProvider> */}
    </>
  );
};

export default Main;
