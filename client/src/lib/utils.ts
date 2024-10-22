import { DirectoryTree } from "@/types/directory";
import axios, { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

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

export async function runTemplate(templateName: string) {
  try {
    const response = await axios.get(
      `http://localhost:8000/pdf/${templateName}`
    );
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      toast.error(`${e.response?.data}`);
    }
    return null;
  }
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

export async function deleteFile(directory: DirectoryTree) {
  return await axios.delete(`http://localhost:8000/templates/`, {
    data: directory,
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
