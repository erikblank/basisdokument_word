import { Trash } from "phosphor-react";
import React, { useState } from "react";
import { useSection } from "../../../contexts";
import WFButton from "./WFButton";

/* global Word */

interface DeleteSectionButtonProps {
  sectionId: string;
}

const DeleteSectionButton = ({ sectionId }: DeleteSectionButtonProps) => {
  const { setSectionList } = useSection();

  const [isLoading, setIsLoading] = useState(false);

  const deleteEntry = () => {
    setSectionList((prevSections) => prevSections.filter((section) => section.id !== sectionId));
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
        const entryCCs = contentControls.items.filter((cc) => cc.tag === sectionId);
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
      label={"Gliederungspunkt löschen"}
      disabled={isLoading}
    />
  );
};

export default DeleteSectionButton;
