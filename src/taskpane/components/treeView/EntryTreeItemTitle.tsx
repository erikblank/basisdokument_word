import { Chip } from "@mui/material";
import React from "react";
import { IEntry, UserRole } from "../../types";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

interface EntryTreeItemTitleProps {
  entry: IEntry;
  position: string;
}

const EntryTreeItemTitle = ({ entry }: EntryTreeItemTitleProps) => {
  const user = { role: UserRole.Defendant };
  return (
    <div key={entry.id} className="text-sm">
      <span className={user.role === entry.role ? "font-bold" : ""}>{entry.entryCode}</span>
      {entry.associatedEntry && (
        <Chip sx={{ ml: 1 }} size="small" label={entry.associatedEntry} icon={<SubdirectoryArrowRightIcon />} />
      )}
    </div>
  );
};

export default EntryTreeItemTitle;
