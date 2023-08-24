import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TreeView } from "@mui/lab";
import { ThemeProvider } from "@mui/material";
import React from "react";
import EntryTreeItem from "../components/treeView/EntryTreeItem";
import SectionTreeItem from "../components/treeView/SectionTreeItem";
import { useCase, useSection } from "../contexts";
import { theme } from "../theme/muiTheme";

/* global console */

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
  const { entries } = useCase();
  const { sectionList } = useSection();

  console.log(entries);
  console.log(sectionList);

  return (
    <>
      {/* <Sidebar /> */}
      <ThemeProvider theme={theme}>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ flexGrow: 1, overflowY: "auto" }}
        >
          {sectionList.map((section) => {
            const filteredEntries = entries.filter((entry) => entry.sectionId === section.id);
            return (
              <SectionTreeItem key={section.id} nodeId={section.id} section={section}>
                {filteredEntries.map((entry) => (
                  <EntryTreeItem key={entry.id} nodeId={entry.id} entry={entry} />
                ))}
              </SectionTreeItem>
            );
          })}
        </TreeView>
      </ThemeProvider>
    </>
  );
};

export default Main;
