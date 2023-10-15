import { FileArrowDown } from "phosphor-react";
import React from "react";
import { useExport } from "../../contexts/ExportContext";
import { useSidebar } from "../../contexts/SidebarContext";
import { useUser } from "../../contexts/UserContext";
import { Button } from "../Button";
import { SidebarHeader } from "./SidebarHeader";
import useSyncWordData from "../../data-management/word-sync-data-hanlder";

/* global */

export const Sidebar = () => {
  const { sidebars, activeSidebar } = useSidebar();
  const { user } = useUser();
  const { setIsExportPopupOpen } = useExport();
  const { syncWordData } = useSyncWordData();

  const onClickDownloadButton = () => {
    setIsExportPopupOpen((currentState) => !currentState);
  };

  const onClickSyncButton = async () => {
    await syncWordData();
  };

  return (
    <div>
      <div className="flex items-center align-middle justify-between py-2 px-2 gap-2">
        <div className="flex align-middle gap-2">
          <p className="my-auto">{user?.name || "asdf"}</p>
          <div className="flex flex-row justify-between items-center gap-3 text-offWhite bg-darkGrey rounded-full h-7 pl-2 pr-2">
            <span className="text-xs">{user?.role || "asdf"}</span>
          </div>
        </div>
        <div>
          <Button size="sm" onClick={onClickDownloadButton}>
            <FileArrowDown size={16} className="text-white mr-2" weight="bold" />
            Export
          </Button>
          <Button size="sm" onClick={onClickSyncButton}>
            <FileArrowDown size={16} className="text-white mr-2" weight="bold" />
            Sync
          </Button>
        </div>
        {/* put here change version input field */}
      </div>
      <div className={"h-full overflow-y-clip  w-full"}>
        <SidebarHeader />
        <div>{sidebars.map((sidebar) => sidebar.name === activeSidebar && sidebar.jsxElem)}</div>
      </div>
    </div>
  );
};
