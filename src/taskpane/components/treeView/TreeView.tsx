import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TreeItem from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import React from "react";

const TreeView123 = () => {
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ flexGrow: 1, overflowY: "auto" }}
    >
      <TreeItem nodeId="1" label="a">
        <TreeItem nodeId="2" label="asdf" />
        <TreeItem nodeId="2" label="asd" />
      </TreeItem>
      <TreeItem nodeId="5" label="aaa">
        <TreeItem nodeId="10" label="OSS" />
        <TreeItem nodeId="10" label="OSS" />
        <TreeItem nodeId="6" label="MUI">
          <TreeItem nodeId="8" label="index.js" />
        </TreeItem>
      </TreeItem>
    </TreeView>
  );
};

export default TreeView123;
