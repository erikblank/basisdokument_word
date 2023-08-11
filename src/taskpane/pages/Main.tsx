import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TreeItem, TreeView } from "@mui/lab";
import React from "react";
import { useCase, useSection } from "../contexts";

/* global console */

const Main = () => {
  /* const { user } = useUser(); */
  const { entries } = useCase();
  const { sectionList } = useSection();

  console.log(entries);
  console.log(sectionList);

  return (
    <>
      {/* <Sidebar /> */}
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ flexGrow: 1, overflowY: "auto" }}
      >
        {sectionList.map((section) => (
          <TreeItem key={section.id} nodeId={section.id} label={section.titlePlaintiff}>
            {entries
              .filter((entry) => entry.sectionId === section.id)
              .map((filteredEntry) => (
                <TreeItem key={filteredEntry.id} nodeId={filteredEntry.id} label={filteredEntry.entryCode} />
              ))}
          </TreeItem>
        ))}
      </TreeView>
    </>
  );
};

export default Main;
