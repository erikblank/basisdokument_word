import TreeItem, { TreeItemProps } from "@mui/lab/TreeItem";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import * as React from "react";
import { IEntry, UserRole } from "../../types";
import EntryTreeItemTitle from "./EntryTreeItemTitle";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

type EntryTreeItemProps = TreeItemProps & {
  entry: IEntry;
};

export default function EntryTreeItem(props: EntryTreeItemProps) {
  const { entry, nodeId, ...other } = props;
  const user = { role: UserRole.Defendant };

  return (
    <TreeItem
      nodeId={nodeId}
      sx={{ my: "0 !important" }}
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 0.5,
            pr: 0,
          }}
        >
          <EntryTreeItemTitle position={nodeId} entry={entry} />
          {user.role !== entry.role && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button variant="text" size="small" color="inherit" startIcon={<SubdirectoryArrowRightIcon />}>
                Bezug nehmen
              </Button>
            </Box>
          )}
        </Box>
      }
      {...other}
    />
  );
}
