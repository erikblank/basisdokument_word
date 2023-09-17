import { Spinner, SpinnerSize } from "@fluentui/react";
import { ArrowBendLeftUp, Plus, Trash } from "phosphor-react";
import React, { useEffect, useState } from "react";
import { useCase, useSection, useUser } from "../contexts";
import { IEntry, ISection, UserRole } from "../types";
import { TITLE_ENTRY_TEXT_DEFENDANT, TITLE_ENTRY_TEXT_PLAINTIFF } from "../word-utils/titles";
import { createEntry } from "../word-utils/WordEntryService";
import { isEntryByTitle, isMetaDataByTitle, isSelectionByTitle } from "../word-utils/wordUtils";
import { Button } from "./Button";

/* global console, Word, Office */

export const SidebarSorting = () => {
  const { user } = useUser();
  const { entries } = useCase();
  const { sectionList } = useSection();
  const { currentVersion } = useCase();

  const [section, setSection] = useState<ISection>();
  const [entry, setEntry] = useState<IEntry>();
  const [isMetaData, setIsMetaData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const entryIsOld = entry && entry?.version !== null && entry.version < currentVersion;
  const sectionIsOld = section && section?.version != null && section.version < currentVersion;

  console.log(setEntry);

  useEffect(() => {
    Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, handleSelectionChange);

    return () => {
      // Remove the event handler on component unmount.
      Office.context.document.removeHandlerAsync(Office.EventType.DocumentSelectionChanged, handleSelectionChange);
    };
  }, []);

  const titleVisible = (title: string) => {
    if (title === "") {
      return false;
    } else {
      return true;
    }
  };

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

  const createEntryOnEntry = async () => {
    // todo: create entry in word
    try {
      await Word.run(async (context) => {
        // get list of all entries of selected section
        const sectionEntries = entries.filter((entryItem) => entryItem.sectionId === entry.sectionId);
        // get last entry of section
        if (sectionEntries.length > 0) {
          // get last entry -> entries are loaded reverse, so the first one is the last one
          const lastEntry = sectionEntries[sectionEntries.length - 1];
          // load all contentControls
          const contentControls = context.document.contentControls;
          contentControls.load(["tag", "title"]);
          await context.sync();
          // get last entry and choose cc of last entry as selection
          // get entriesCCs by tag
          const selection = contentControls.items.find(
            (cc) =>
              cc.tag === lastEntry.id &&
              (cc.title === TITLE_ENTRY_TEXT_DEFENDANT || cc.title === TITLE_ENTRY_TEXT_PLAINTIFF)
          );

          createEntry(selection, lastEntry, entries, user.role, currentVersion);
          await context.sync();
        } else {
          // get last cc of section
        }
        // insert entry
      });
    } catch (error) {
      console.error(error);
    }
    // todo: create entry in context data
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
            {!entry && !section && !isMetaData && <p>Nichts ausgewählt.</p>}
            {(entry || section || isMetaData) && (
              <div>
                <p>
                  <span className="font-bold">Aktuelle Auswahl:</span>{" "}
                  {section ? "Gliederungspunkt" : entry ? "Beitrag" : isMetaData ? "Rubrum" : ""}
                </p>
                {section && (
                  <div className="bg-offWhite rounded-md p-2 my-2 items-center">
                    <div className="flex flex-col text-darkGrey font-bold w-full item-container text-sm">
                      <span className={user?.role === UserRole.Defendant ? "font-light" : ""}>
                        {section.titlePlaintiff}
                      </span>
                      <div
                        className={
                          titleVisible(section.titlePlaintiff) === false ||
                          titleVisible(section.titleDefendant) === false
                            ? ""
                            : "h-0.5 w-24 bg-lightGrey rounded-full my-1"
                        }
                      />
                      <span className={user?.role === UserRole.Plaintiff ? "font-light" : ""}>
                        {section.titleDefendant}
                      </span>
                    </div>
                  </div>
                )}
                {entry && (
                  <div className="bg-offWhite rounded-md p-2 my-2 items-center">
                    <div className="flex flex-col text-darkGrey font-bold w-full item-container text-sm">
                      <span className={user?.role === UserRole.Defendant ? "font-light" : ""}>
                        {entry.entryCode + " " + entry.author}
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
                          <Button
                            bgColor="bg-darkGrey hover:bg-darkGrey/60"
                            textColor="text-white"
                            size="sm"
                            icon={<Plus weight="bold" />}
                          >
                            Gliederungspunkt hinzufügen
                          </Button>
                        </div>
                        {!sectionIsOld && (
                          <div>
                            <Button
                              bgColor="bg-darkGrey hover:bg-darkGrey/60"
                              textColor="text-white"
                              size="sm"
                              icon={<Trash weight="bold" />}
                            >
                              Gliederungspunkt löschen
                            </Button>
                          </div>
                        )}
                        <div>
                          <Button
                            bgColor="bg-darkGrey hover:bg-darkGrey/60"
                            textColor="text-white"
                            size="sm"
                            icon={<Plus weight="bold" />}
                          >
                            Beitrag hinzufügen
                          </Button>
                        </div>
                      </>
                    )}
                    {entry && (
                      <>
                        <div>
                          <Button
                            bgColor="bg-darkGrey hover:bg-darkGrey/60"
                            textColor="text-white"
                            size="sm"
                            icon={<Plus weight="bold" />}
                          >
                            Gliederungspunkt hinzufügen
                          </Button>
                        </div>
                        <div>
                          <Button
                            bgColor="bg-darkGrey hover:bg-darkGrey/60"
                            textColor="text-white"
                            size="sm"
                            icon={<Plus weight="bold" />}
                            onClick={createEntryOnEntry}
                          >
                            Beitrag hinzufügen
                          </Button>
                        </div>
                        {entry.role === user.role && !entryIsOld && (
                          <div>
                            <Button
                              bgColor="bg-darkGrey hover:bg-darkGrey/60"
                              textColor="text-white"
                              size="sm"
                              icon={<Trash weight="bold" />}
                            >
                              Beitrag löschen
                            </Button>
                          </div>
                        )}
                        {entry.role !== user.role && (
                          <div>
                            <Button
                              bgColor="bg-darkGrey hover:bg-darkGrey/60"
                              textColor="text-white"
                              size="sm"
                              icon={<ArrowBendLeftUp weight="bold" />}
                            >
                              Auf Beitrag Bezug nehmen
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                    {isMetaData && (
                      <>
                        <div>
                          <Button
                            bgColor="bg-darkGrey hover:bg-darkGrey/60"
                            textColor="text-white"
                            size="sm"
                            icon={<Plus weight="bold" />}
                          >
                            Gliederungspunkt hinzufügen
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
