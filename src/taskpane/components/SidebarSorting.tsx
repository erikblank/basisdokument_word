import React, { useEffect } from "react";
import { useCase, useUser } from "../contexts";

/* global console, Office, Word */

export const SidebarSorting = () => {
  const { user } = useUser();
  const { entries } = useCase();

  const [selectionText, setSelectionText] = React.useState("");
  console.log(user);
  console.log(entries);
  useEffect(() => {
    Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, handleSelectionChange);

    return () => {
      // Remove the event handler on component unmount.
      Office.context.document.removeHandlerAsync(Office.EventType.DocumentSelectionChanged, handleSelectionChange);
    };
  }, []);

  const handleSelectionChange = async () => {
    try {
      await Word.run(async (context) => {
        // Get the current selection.
        const selection = context.document.getSelection();

        // Load the parentContentControl property for the selection
        selection.load("parentContentControl");

        await context.sync();

        // Check if the selection has a parent content control
        if (selection.parentContentControl) {
          // Load the text property of the parent content control
          const parentCC = selection.parentContentControl.load("tag");
          await context.sync();

          // Set the parent content control's text to state
          setSelectionText(parentCC.tag);
        } else {
          setSelectionText("No parent content control found.");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    //h-[calc(100vh-56px)] -> overflow scroll needs a fixed height of parent: 56px (height of sidebar header)
    <div className="flex flex-col gap-3 h-[calc(100vh-56px)]">
      <div className="flex flex-row justify-between pt-4 px-4">
        <div className="font-bold text-darkGrey text-lg">
          TBD: funktionen wie section oder entry hinzufügen, bearbeiten, löschen...
          <div>Selected tag: {selectionText}</div>
        </div>
      </div>
    </div>
  );
};
