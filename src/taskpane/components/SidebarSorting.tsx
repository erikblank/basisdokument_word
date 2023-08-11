import React from "react";
import { useCase, useUser } from "../contexts";
import TreeView from "./treeView/Treeview";

/* global console */

export const SidebarSorting = () => {
  const { user } = useUser();
  const { entries } = useCase();
  console.log(user);
  console.log(entries);
  return (
    //h-[calc(100vh-56px)] -> overflow scroll needs a fixed height of parent: 56px (height of sidebar header)
    <div className="flex flex-col gap-3 h-[calc(100vh-56px)]">
      <div className="flex flex-row justify-between pt-4 px-4">
        <div className="font-bold text-darkGrey text-lg">Gliederung</div>
      </div>
      <div className="px-4 mb-4 flex-1 overflow-y-scroll scroll-smooth">
        <TreeView />
      </div>
    </div>
  );
};
