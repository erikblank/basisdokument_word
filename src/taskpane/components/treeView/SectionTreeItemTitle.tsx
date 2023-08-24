import React from "react";
import { ISection, UserRole } from "../../types";

interface SectionTreeItemTitleProps {
  section: ISection;
  position: string;
}

const titleVisible = (title: string) => {
  if (title === "") {
    return false;
  } else {
    return true;
  }
};

const SectionTreeItemTitle = ({ section, position }: SectionTreeItemTitleProps) => {
  const user = { role: UserRole.Defendant };
  return (
    <div key={section.id}>
      <div className="flex p-2 my-2 items-center">
        <a
          href={`#${section.id}`}
          draggable={false}
          key={section.id}
          className="flex flex-row gap-2 text-darkGrey font-bold w-full item-container text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="self-center">{position}.</span>
          <div>
            <span className={user?.role === UserRole.Defendant ? "font-light" : ""}>{section!.titlePlaintiff}</span>
            <div
              className={
                titleVisible(section.titlePlaintiff) === false || titleVisible(section.titleDefendant) === false
                  ? ""
                  : "h-0.5 w-24 bg-lightGrey rounded-full my-1"
              }
            />
            <span className={user?.role === UserRole.Plaintiff ? "font-light" : ""}>{section.titleDefendant}</span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default SectionTreeItemTitle;
