"use client";
import React from "react";
export const FileIdContext = React.createContext({
  currentFileId: null,
  setCurrentFileId: () => {},
  currentMp3FileId: null,
  setCurrentMp3FileId: () => {},
  currentChordId: null,
  setCurrentChordId: () => {},
});
