import cx from "classnames";
import React from "react";
import { useUser } from "../../contexts";
import { useSidebar } from "../../contexts/SidebarContext";
import { UserRole } from "../../types";
import { Button } from "./../Button";

export const SidebarHeader = () => {
  const { sidebars, activeSidebar, setActiveSidebar } = useSidebar();

  const { user } = useUser();

  return (
    <div className={cx("flex flex-row items-center h-14 border-y-[0.5px] border-lightGrey px-4 ")}>
      {user?.role !== UserRole.Client && (
        <div className={cx("flex flex-row gap-3")}>
          {sidebars.map((sidebar) => (
            <Button
              key={sidebar.name}
              bgColor={
                sidebar.name === activeSidebar ? "bg-offWhite hover:bg-lightGrey" : "transparent hover:bg-lightGrey"
              }
              size="sm"
              textColor="font-bold text-darkGrey"
              icon={sidebar.icon}
              hasText={false}
              alternativePadding="py-1.5 px-2"
              onClick={() => {
                setActiveSidebar(sidebar.name);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
