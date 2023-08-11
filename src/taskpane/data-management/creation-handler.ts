import { IStateUserInput } from "../types";

/* global console */

export function createBasisdokument(
  prename: IStateUserInput["prename"],
  surname: IStateUserInput["surname"],
  role: IStateUserInput["role"],
  caseId: IStateUserInput["caseId"],
  fileId: string
) {
  const basisdokumentObject: any = {};
  basisdokumentObject["fileId"] = fileId;
  basisdokumentObject["caseId"] = caseId;
  basisdokumentObject["currentVersion"] = 1;
  basisdokumentObject["versions"] = [];
  basisdokumentObject["versions"].push({
    author: prename + " " + surname,
    role: role,
    timestamp: "",
  });
  basisdokumentObject["metadata"] = { plaintiff: "", defendant: "" };
  basisdokumentObject["introduction"] = { plaintiff: "", defendant: "" };
  basisdokumentObject["entries"] = [];
  basisdokumentObject["sections"] = [];
  basisdokumentObject["judgeHints"] = [];
  basisdokumentObject["litigiousChecks"] = [];
  return basisdokumentObject;
}

export function createEditFile(
  prename: IStateUserInput["prename"],
  surname: IStateUserInput["surname"],
  role: IStateUserInput["role"],
  caseId: IStateUserInput["caseId"],
  fileId: string,
  version: number
) {
  console.log(prename, surname, role);
  const editFileObject: any = {};
  editFileObject["fileId"] = fileId;
  editFileObject["caseId"] = caseId;
  editFileObject["currentVersion"] = version;
  editFileObject["highlightedEntries"] = [];
  editFileObject["highlighter"] = [
    { color: "yellow", label: "Markierung 1" },
    { color: "orange", label: "Markierung 2" },
    { color: "red", label: "Markierung 3" },
    { color: "purple", label: "Markierung 4" },
    { color: "blue", label: "Markierung 5" },
    { color: "green", label: "Markierung 6" },
  ];
  editFileObject["notes"] = [];
  editFileObject["bookmarks"] = [];
  editFileObject["individualSorting"] = [];
  editFileObject["individualEntrySorting"] = [];
  return editFileObject;
}
