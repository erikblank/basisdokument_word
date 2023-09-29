import { Trash } from "phosphor-react";
import React, { useState } from "react";
import { useCase, useSection } from "../../../contexts";
import WFButton from "./WFButton";

/* global Word */

interface DeleteSectionButtonProps {
  sectionId: string;
}

const DeleteSectionButton = ({ sectionId }: DeleteSectionButtonProps) => {
  const { setSectionList } = useSection();
  const { setEntries, entries } = useCase();

  const [isLoading, setIsLoading] = useState(false);

  const deleteSection = () => {
    setSectionList((prevSections) => prevSections.filter((section) => section.id !== sectionId));
    setEntries((entries) => entries.filter((entry) => entry.sectionId !== sectionId));
  };

  const handleDeleteSection = async () => {
    setIsLoading(true);
    try {
      await Word.run(async (context) => {
        // load all contentControls
        const contentControls = context.document.contentControls;
        contentControls.load(["tag"]);
        await context.sync();

        // get sectionCCs by tag
        const sectionCCs = contentControls.items.filter((cc) => cc.tag === sectionId);
        sectionCCs.forEach((item) => {
          item.cannotDelete = false;
          item.delete(false);
        });

        const sectionEntries = entries.filter((entry) => entry.sectionId === sectionId);

        sectionEntries.forEach((entry) => {
          const entryCCs = contentControls.items.filter((cc) => cc.tag === entry.id);
          entryCCs.forEach((item) => {
            item.cannotDelete = false;
            item.delete(false);
          });
        });

        deleteSection();

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
      onClick={handleDeleteSection}
      label={"Gliederungspunkt löschen"}
      disabled={isLoading}
    />
  );
};

export default DeleteSectionButton;
