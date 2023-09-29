import { Spinner, SpinnerSize } from "@fluentui/react";
import React, { useEffect, useState } from "react";
import { useCase, useSection, useUser } from "../../contexts";
import { IEntry, ISection, UserRole } from "../../types";
import { isEntryByTitle, isMetaDataByTitle, isSelectionByTitle } from "../../word-utils/wordUtils";
import AddEntryButton from "./word-function-buttons/AddEntryButton";
import AddSectionButton from "./word-function-buttons/AddSectionButton";
import DeleteEntryButton from "./word-function-buttons/DeleteEntryButton";
import DeleteSectionButton from "./word-function-buttons/DeleteSectionButton";

/* global console, Word, Office */

export const SidebarWordFunctions = () => {
  const { user } = useUser();
  const { entries } = useCase();
  const { sectionList } = useSection();
  const { currentVersion } = useCase();

  const [section, setSection] = useState<ISection>();
  const [entry, setEntry] = useState<IEntry>();
  const [isMetaData, setIsMetaData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const nothingSelected = !entry && !section && !isMetaData;

  const entryIsOld = entry && entry?.version !== null && entry.version < currentVersion;
  const sectionIsOld = section && section?.version != null && section.version < currentVersion;

  useEffect(() => {
    Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, handleSelectionChange);

    return () => {
      // Remove the event handler on component unmount.
      Office.context.document.removeHandlerAsync(Office.EventType.DocumentSelectionChanged, handleSelectionChange);
    };
  }, [entries, sectionList]);

  const handleSelectionChange = async () => {
    setIsLoading(true);
    try {
      await Word.run(async (context) => {
        setEntry(undefined);
        setSection(undefined);
        setIsMetaData(false);
        // Get the current selection
        const docSelection = context.document.getSelection();

        // Load the parentContentControl property for the selection
        // eslint-disable-next-line office-addins/no-navigational-load
        const parentCC = docSelection.parentContentControlOrNullObject.load(["tag", "title"]);

        await context.sync();

        // Check if the selection has a parent content control
        if (!parentCC.isNullObject) {
          // Set the parent content control's text to state
          const title = parentCC.title;
          const tag = parentCC.tag;

          if (isSelectionByTitle(title)) {
            const section = sectionList.find((sectionItem) => sectionItem.id === tag);
            setSection(section);
          } else if (isEntryByTitle(title)) {
            const entry = entries.find((entryItem) => entryItem.id === tag);

            setEntry(entry);
          } else if (isMetaDataByTitle(title)) {
            setIsMetaData(true);
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    //h-[calc(100vh-100px)] -> overflow scroll needs a fixed height of parent: 100px (height of sidebar header)
    <div className="flex flex-col gap-3 h-[calc(100vh-100px)] pt-4 px-4">
      <div className="w-full h-full">
        {isLoading && (
          <div className="flex align-middle justify-center w-full h-full">
            <Spinner size={SpinnerSize.large} />
          </div>
        )}
        {!isLoading && (
          <div className="">
            <div>
              <p>
                <span className="font-bold">Aktuelle Auswahl:</span>{" "}
                {section ? "Gliederungspunkt" : entry ? "Beitrag" : isMetaData ? "Rubrum" : ""}
                {nothingSelected && "Wähle bestimmte Bereiche im Text aus, um weitere Aktionen zu erhalten."}
              </p>
              {section && (
                <div className="bg-offWhite rounded-md p-2 my-2 items-center">
                  <div className="flex flex-col text-darkGrey font-bold w-full item-container text-sm">
                    <span className={user?.role === UserRole.Defendant ? "font-light" : ""}>
                      {`${sectionList.findIndex((sectionItem) => section.id === sectionItem.id) + 1}. Gliederungspunkt`}
                    </span>
                  </div>
                </div>
              )}

              {section && !section.titlePlaintiff && !section.titleDefendant && <div>Noch keine Titel vergeben.</div>}
              {entry && (
                <div className="bg-offWhite rounded-md p-2 my-2 items-center">
                  <div className="flex flex-col text-darkGrey font-bold w-full item-container text-sm">
                    <span className={user?.role === UserRole.Defendant ? "font-light" : ""}>
                      {entry.entryCode + " von  " + entry.author}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-1">
                <p className="font-bold">Aktionen:</p>
                <div className="flex gap-2 flex-col justify-start pt-1">
                  {section && (
                    <>
                      <div>
                        <AddSectionButton sectionIdBefore={section.id} />
                      </div>
                      {!sectionIsOld && (
                        <div>
                          <DeleteSectionButton sectionId={section.id} />
                        </div>
                      )}
                      <div>
                        <AddEntryButton sectionId={section.id} />
                      </div>
                    </>
                  )}
                  {entry && (
                    <>
                      <div>
                        <AddSectionButton sectionIdBefore={entry.sectionId} />
                      </div>
                      <div>
                        <AddEntryButton sectionId={entry.sectionId} />
                      </div>
                      {entry.role === user.role && !entryIsOld && (
                        <div>
                          <DeleteEntryButton entryId={entry.id} />
                        </div>
                      )}
                      {entry.role !== user.role && (
                        <div>
                          <AddEntryButton sectionId={entry.sectionId} associatedEntry={entry.id} />
                        </div>
                      )}
                    </>
                  )}
                  {(isMetaData || nothingSelected) && (
                    <div>
                      <AddSectionButton />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
