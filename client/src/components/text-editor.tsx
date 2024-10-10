"use client";

import useTabs from "@/stores/tabs";
import Editor, { OnChange } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const languages = new Map<string, string>([
  ["ts", "typescript"],
  ["js", "javascript"],
  ["css", "css"],
  ["json", "json"],
]);

const TextEditor = () => {
  const { selected, updateContent } = useTabs();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false); // To check if the theme is mounted

  const defineCustomThemes = (monaco: any) => {
    // Define the dark theme
    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark", // Can be 'vs', 'vs-dark', or 'hc-black'
      inherit: true, // Inherit from the base theme
      rules: [],
      colors: {
        "editor.background": "#0A0A0A", // Editor background color
        "editor.lineHighlightBackground": "#474747", // Line highlight color
        // Add more custom colors here
      },
    });

    // Define the light theme
    monaco.editor.defineTheme("custom-light", {
      base: "vs", // 'vs' is the default light theme
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#eeeeee", // Editor background color
        "editor.lineHighlightBackground": "#bebebe", // Line highlight color
        // Add more custom colors here
      },
    });
  };

  const handleEditorWillMount = (monaco: any) => {
    defineCustomThemes(monaco);
  };

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

  useEffect(() => {
    setMounted(true); // Ensure the component is fully mounted to apply the theme
  }, []);

  if (!mounted) return null; // Prevent the editor from rendering until fully mounted

  const isSelectedValid = selected && selected.type === "file";

  return (
    <Editor
      defaultLanguage="javascript"
      language={getLanguage()}
      theme={theme === "light" ? "custom-light" : "custom-dark"}
      onChange={handleChange}
      value={isSelectedValid ? (selected.content as string) : ""}
      beforeMount={handleEditorWillMount} // Define custom themes before the editor mounts
    />
  );
};

export default TextEditor;
