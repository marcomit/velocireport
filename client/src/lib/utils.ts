import { clsx, type ClassValue } from "clsx";
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
