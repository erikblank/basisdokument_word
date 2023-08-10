import * as React from "react";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TreeItem from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import "../index.css";
import Progress from "./components/Progress";
import { UserProvider } from "./contexts";
import { SidebarProvider } from "./contexts/SidebarContext";
import StyledTreeItem from "./components/treeView/StyledTreeItem";
/* global Word, require */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

const App = ({ isOfficeInitialized, title }: AppProps) => {
  const click = async () => {
    return Word.run(async (context) => {
      const paragraph = context.document.body.insertParagraph("Hello World", Word.InsertLocation.end);

      paragraph.font.color = "blue";

      await context.sync();
    });
  };

  return (
    <>
      <UserProvider>
        <SidebarProvider>
          {!isOfficeInitialized ? (
            <Progress
              title={title}
              logo={require("./../../assets/logo-filled.png")}
              message="Please sideload your addin to see app body."
              click={click}
            />
          ) : (
            <>
              {/* <Sidebar /> */}
              <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ flexGrow: 1, overflowY: "auto" }}
              >
                <TreeItem nodeId="1" label="asdf" endIcon={<ExpandMoreIcon />}>
                  <TreeItem nodeId="2" label="asdf" />
                  <StyledTreeItem />
                </TreeItem>
                <TreeItem nodeId="5" label="aaa">
                  <TreeItem nodeId="10" label="OSS" />
                  <TreeItem nodeId="10" label="OSS" />
                  <TreeItem nodeId="6" label="MUI">
                    <TreeItem nodeId="8" label="index.js" />
                  </TreeItem>
                </TreeItem>
              </TreeView>
            </>
          )}
        </SidebarProvider>
      </UserProvider>
    </>
  );
};

export default App;
