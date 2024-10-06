"use client";

import React from "react";
import Editor, { OnChange } from "@monaco-editor/react";

const TextEditor = ({ value }: { value: string }) => {
  // Handle editor content change
  const handleEditorChange: OnChange = (content) => {};

  return (
    <Editor
      defaultLanguage="javascript"
      theme="vs-dark"
      onChange={handleEditorChange}
      value={value}
    />
  );
};

export default TextEditor;
