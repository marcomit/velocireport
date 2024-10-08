"use client";

import useTabs from "@/stores/tabs";
import Editor, { OnChange } from "@monaco-editor/react";
import { useTheme } from "next-themes";

const languages = new Map<string, string>([
  ["ts", "typescript"],
  ["js", "javascript"],
  ["css", "css"],
  ["json", "json"],
]);

const TextEditor = () => {
  const { selected, updateContent } = useTabs();
  const { theme } = useTheme();

  const handleChange: OnChange = (value) => {
    if (selected) {
      updateContent(selected.name, value || "");
    }
  };

  const getLanguage = () => {
    if (selected) {
      return languages.get(selected.name.split(".").pop() || "");
    }
    return "";
  };

  return (
    <Editor
      defaultLanguage="javascript"
      language={getLanguage()}
      theme={theme === "light" ? "vs-light" : "vs-dark"}
      onChange={handleChange}
      value={selected ? (selected.content as string) : ""}
    />
  );
};

export default TextEditor;
