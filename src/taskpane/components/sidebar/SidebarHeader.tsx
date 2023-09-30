import cx from "classnames";
import React from "react";

export const SidebarHeader = () => {
  return (
    <div className={cx("flex flex-row items-center border-y-[0.5px] border-lightGrey px-4 ")}>
      {/* {user?.role !== UserRole.Client && (
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
      )} */}
    </div>
  );
};
