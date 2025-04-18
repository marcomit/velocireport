/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DirectoryTree } from "@/types/directory";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
/* import { Doc } from "contentlayer/generated"; */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const imagesForLanguage = new Map<string, string>([
  ["ts", "ts.png"],
  ["js", "js.png"],
  ["css", "css.png"],
  ["json", "json.png"],
  ["pdf", "pdf.svg"],
]);

export function areTreesEqual(a: DirectoryTree, b: DirectoryTree) {
  if (!a || !b) return false;
  if (
    a.name !== b.name ||
    a.path !== b.path ||
    a.content.length !== b.content.length ||
    a.type !== b.type
  )
    return false;
  if (a.type == "file") return true;
  for (let i = 0; i < a.content.length; i++) {
    if (
      !areTreesEqual(
        a.content[i] as DirectoryTree,
        b.content[i] as DirectoryTree
      )
    )
      return false;
  }
  return true;
}

export function getDirectoryRoot(
  directory: DirectoryTree,
  templateList: DirectoryTree[]
) {
  if (directory.parent === "") return directory;

  return templateList.find((t) => t.name == directory.parent.split("\\")[0]);
}

export async function runTemplate(templateName: string) {
  /*   try { */
  const response = await axios.get(`http://localhost:8000/pdf/${templateName}`);
  return response.data;
  /* } catch (e) {
    if (e instanceof AxiosError) {
      toast.error(`${e.response?.data}`);
    }
    return null;
  } */
}

export async function saveFiles(files: DirectoryTree[]) {
  const response = await axios.put("http://localhost:8000/templates/", files);
  return response.data;
}

export const renameFile = async (name: string, path: DirectoryTree["path"]) => {
  return await axios.put(`http://localhost:8000/templates/rename`, {
    name: name,
    path: path,
  });
};

export async function deleteFile(file: DirectoryTree) {
  return await axios.delete(`http://localhost:8000/templates/`, {
    data: file,
  });
}

export const fetchDirectories = async () => {
  const url = "http://localhost:8000/templates";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching directories:", error);
  }
};
