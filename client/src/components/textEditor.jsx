"use client";

import React from "react";
import Editor from "@monaco-editor/react";

const TextEditor = ({ value, onChange }) => {
  // Handle editor content change
  const handleEditorChange = (content) => {
    if (onChange) {
      onChange(content); // Trigger the onChange prop with new content
    }
  };

  return <Editor defaultLanguage="javascript" theme="vs-dark" />;
};

export default TextEditor;
