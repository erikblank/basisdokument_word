import React, { useEffect } from "react";
import { Sidebar } from "../components/sidebar/Sidebar";
import { useSection } from "../contexts";
import { updateIndexOfSectionTitles } from "../word-utils/WordSectionService";

const Main = () => {
  const { sectionList } = useSection();

  useEffect(() => {
    updateIndexOfSectionTitles();
  }, [sectionList]);

  return <Sidebar />;
};

export default Main;
