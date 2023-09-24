import { Bookmarks, File, Notepad, Paperclip, Scales } from "phosphor-react";
import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from "react";
import { SidebarWordFunctions } from "../components/sidebar/SidebarWordFunctions";
import { ISidebar, SidebarState } from "../types";

const sidebars: ISidebar[] = [
  {
    name: SidebarState.WordFunctions,
    jsxElem: <SidebarWordFunctions key={SidebarState.WordFunctions.toString()}></SidebarWordFunctions>,
    icon: <File size={20} />,
  },
  {
    name: SidebarState.Notes,
    jsxElem: <div key={SidebarState.Notes.toString()}></div>,
    icon: <Notepad size={20} />,
  },
  {
    name: SidebarState.Hints,
    jsxElem: <div key={SidebarState.Hints.toString()}></div>,
    icon: <Scales size={20} />,
  },
  {
    name: SidebarState.Bookmarks,
    jsxElem: <div key={SidebarState.Bookmarks.toString()}></div>,
    icon: <Bookmarks size={20} />,
  },
  {
    name: SidebarState.Evidences,
    jsxElem: <div key={SidebarState.Evidences.toString()}></div>,
    icon: <Paperclip size={20} />,
  },
];

interface ISidebarContext {
  sidebars: ISidebar[];
  activeSidebar: SidebarState;
  setActiveSidebar: Dispatch<SetStateAction<SidebarState>>;
}

export const SidebarContext = createContext<ISidebarContext | null>(null);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: FC<SidebarProviderProps> = ({ children }) => {
  const [activeSidebar, setActiveSidebar] = useState<SidebarState>(sidebars[0].name);
  return (
    <SidebarContext.Provider
      value={{
        sidebars,
        activeSidebar,
        setActiveSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === null) {
    throw new Error("useContext must be used within an SidebarProvider");
  }
  return context;
};
