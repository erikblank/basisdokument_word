import { Plus } from "phosphor-react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useCase, useSection, useUser } from "../../../contexts";
import { ISection } from "../../../types";
import { getLastCCOfMetaData } from "../../../word-utils/WordMetaDataService";
import { createSection, getLastCCOfSection } from "../../../word-utils/WordSectionService";
import WFButton from "./WFButton";

/* global Word */

interface AddSectionButtonProps {
  sectionIdBefore?: string;
}

const AddSectionButton = ({ sectionIdBefore }: AddSectionButtonProps) => {
  const { user } = useUser();
  const { entries, setEntries } = useCase();
  const { sectionList, setSectionList } = useSection();
  const { currentVersion } = useCase();
  const [isLoading, setIsLoading] = useState(false);

  const createNewSection = () => {
    const section: ISection = {
      id: uuidv4(),
      num: sectionList.length,
      version: currentVersion,
      titlePlaintiff: "",
      titleDefendant: "",
    };
    if (sectionIdBefore) {
      const indexSection = sectionList.findIndex((sect) => sect.id === sectionIdBefore) + 1;
      setSectionList((prevSectionList) => [
        ...prevSectionList.slice(0, indexSection),
        section,
        ...prevSectionList.slice(indexSection),
      ]);

      const sectionIdsAfter = sectionList.slice(indexSection).map((sect) => sect.id);

      setEntries(
        entries.map((entr) => {
          if (sectionIdsAfter.includes(entr.sectionId)) {
            const newNum = parseInt(entr.entryCode.match(/(?<=-)\d*(?=-)/)![0]) + 1;
            entr.entryCode = entr.entryCode.replace(/(?<=-)\d*(?=-)/, newNum.toString());
          }
          return entr;
        })
      );
    } else {
      setSectionList((prev) => [...prev, section]);
    }
    return section;
  };
  const handleCreateSection = async () => {
    setIsLoading(true);
    try {
      await Word.run(async (context) => {
        let selection: Word.Range;
        if (!sectionIdBefore) {
          if (sectionList.length === 0) {
            const metaDataCC = await getLastCCOfMetaData(context);

            if (metaDataCC) {
              selection = metaDataCC.getRange(Word.RangeLocation.after);
            }
          } else {
            const lastCC = await getLastCCOfSection(context, sectionList[sectionList.length - 1].id, entries);
            if (lastCC) {
              selection = lastCC.getRange(Word.RangeLocation.after);
            }
          }
        } else {
          if (sectionIdBefore) {
            const lastCC = await getLastCCOfSection(context, sectionIdBefore, entries);
            if (lastCC) {
              selection = lastCC.getRange(Word.RangeLocation.after);
            }
          }
        }

        if (selection) {
          // create section in context
          const newSection = createNewSection();

          // create section word
          createSection(selection, newSection, undefined, [], user.role, currentVersion, context, true);
          await context.sync();
        }
      });
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  return (
    <WFButton
      icon={<Plus weight="bold" />}
      onClick={handleCreateSection}
      label={"Gliederungspunkt hinzufügen"}
      disabled={isLoading}
    />
  );
};

export default AddSectionButton;
