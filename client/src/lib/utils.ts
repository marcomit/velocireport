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

export async function runTemplate(templateName: string) {
  try {
    const response = await axios.get(
      `http://localhost:8000/pdf/${templateName}`
    );
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError) {
      toast.error(e.toString());
    }
  }
  return null;
}

export async function saveFiles(files: DirectoryTree[]) {
  const response = await axios.put("http://localhost:8000/templates/", files);
  return response.data;
}
