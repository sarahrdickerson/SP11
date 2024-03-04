"use client";
import React from "react";
export const FileIdContext = React.createContext({
  currentFileId: null,
  setCurrentFileId: () => {},
});
