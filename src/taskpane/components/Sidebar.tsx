import React from "react";
import { useSidebar } from "../contexts/SidebarContext";
import { useUser } from "../contexts/UserContext";
import { SidebarHeader } from "./SidebarHeader";

export const Sidebar = () => {
  const { sidebars, activeSidebar } = useSidebar();
  const { user } = useUser();

  return (
    <div>
      <div className="flex align-middle py-2 px-2 gap-2">
        <div className="flex align-middle gap-2">
          <p className="my-auto">{user?.name}</p>
          <div className="flex flex-row justify-between items-center gap-3 text-offWhite bg-darkGrey rounded-full h-7 pl-2 pr-2">
            <span className="text-xs">{user?.role}</span>
          </div>
        </div>
        {/* put here change version input field */}
      </div>
      <div className={"h-full overflow-y-clip shadow-lg w-full"}>
        <SidebarHeader />
        {sidebars.map((sidebar) => sidebar.name === activeSidebar && sidebar.jsxElem)}
      </div>
    </div>
  );
};
