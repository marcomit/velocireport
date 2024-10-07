"use client";

import useTabs from "@/stores/tabs";
import Editor, { OnChange } from "@monaco-editor/react";

const languages = new Map<string, string>([
  ['ts', 'typescript'],
  ['js', 'javascript'],
  ['css', 'css'],
  ['json', 'json'],
])

const TextEditor = () => {
  const { selected, updateContent } = useTabs();

  const handleChange: OnChange = (value) => {
    if (selected) {
      updateContent(selected.name, value || '');
    }
  };

  const getLanguage = () => {
    if (selected) {
      return languages.get(selected.name.split('.').pop() || '');
    }
    return '';
  }

  return (
    <Editor
      defaultLanguage="javascript"
      language={getLanguage()}
      theme="vs-dark"
      onChange={handleChange}
      value={selected ? selected.content as string : ''}
    />
  );
};

export default TextEditor;
