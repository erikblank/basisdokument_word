import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import TreeItem, { TreeItemProps } from "@mui/lab/TreeItem";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import * as React from "react";
import { ISection } from "../../types";
import SectionTreeItemTitle from "./SectionTreeItemTitle";

/* global console, Word, Office */

type SectionTreeItemProps = TreeItemProps & {
  section: ISection;
};

export default function SectionTreeItem(props: SectionTreeItemProps) {
  const { section, nodeId, ...other } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const insertNewSection = (e: React.MouseEvent<HTMLElement>) => {
    Word.run(async (context) => {
      const serviceNameRange = context.document.getSelection();
      const serviceNameContentControl = serviceNameRange.insertContentControl();
      serviceNameContentControl.title = "Service Name";
      serviceNameContentControl.tag = "serviceName";
      serviceNameContentControl.appearance = "Tags";
      serviceNameContentControl.color = "green";
      serviceNameContentControl.insertText("hallo text", Word.InsertLocation.start);

      await context.sync();
    });
    handleClose(e);
  };

  const openDialog = () => {
    Office.context.ui.displayDialogAsync("https://localhost:3000/taskpane.html");
  };

  console.log(section);
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
          <SectionTreeItemTitle position={nodeId} section={section} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={handleClick}>
              <MoreHorizIcon color="inherit" />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={openDialog}>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText>Bearbeiten</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText>Löschen</ListItemText>
              </MenuItem>
              <MenuItem onClick={insertNewSection}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText>Gliederungspunkt hinzufügen</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText>Beitrag hinzufügen</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      }
      {...other}
    />
  );
}
