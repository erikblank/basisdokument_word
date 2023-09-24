import { Trash } from "phosphor-react";
import React, { useState } from "react";
import { useCase } from "../../../contexts";
import WFButton from "./WFButton";

/* global Word */

interface DeleteEntryButtonProps {
  entryId: string;
}

const DeleteEntryButton = ({ entryId }: DeleteEntryButtonProps) => {
  const { setEntries } = useCase();

  const [isLoading, setIsLoading] = useState(false);

  const deleteEntry = () => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== entryId));
  };

  const handleDeleteEntry = async () => {
    setIsLoading(true);
    try {
      await Word.run(async (context) => {
        // load all contentControls
        const contentControls = context.document.contentControls;
        contentControls.load(["tag"]);
        await context.sync();

        // get entryCCs by tag
        const entryCCs = contentControls.items.filter((cc) => cc.tag === entryId);
        entryCCs.forEach((item) => {
          item.cannotDelete = false;
        });

        entryCCs.forEach((item) => {
          item.delete(false);
        });

        deleteEntry();

        await context.sync();
      });
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  return (
    <WFButton
      icon={<Trash weight="bold" />}
      onClick={handleDeleteEntry}
      label={"Beitrag löschen"}
      disabled={isLoading}
    />
  );
};

export default DeleteEntryButton;
