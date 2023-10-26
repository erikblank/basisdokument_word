import React, { useEffect } from "react";
import { ExportPopup } from "../components/ExportPopup";
import { Sidebar } from "../components/sidebar/Sidebar";
import { useCase, useSection } from "../contexts";
import { useExport } from "../contexts/ExportContext";
import { useHeaderContext } from "../contexts/HeaderContext";
import { updateIndexOfSectionTitles } from "../word-utils/WordSectionService";

const Main = () => {
  const { sectionList } = useSection();
  useEffect(() => {
    updateIndexOfSectionTitles();
  }, [sectionList]);

  const { isExportPopupOpen } = useExport();
  const { caseId, currentVersion, introduction, fileId, entries, highlightedEntries } = useCase();
  const { versionHistory } = useHeaderContext();

  return (
    <>
      <Sidebar />
      {isExportPopupOpen && (
        <ExportPopup
          fileId={fileId}
          caseId={caseId}
          currentVersion={currentVersion}
          versionHistory={versionHistory}
          introduction={introduction}
          entries={entries}
          sectionList={sectionList}
          highlightedEntries={highlightedEntries}
        ></ExportPopup>
      )}
    </>
  );
};

export default Main;
