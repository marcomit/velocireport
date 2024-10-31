import type { DocumentGen } from "contentlayer/core";
import * as fs from "node:fs/promises";

export const urlFromFilePath = (doc: DocumentGen): string => {
  let urlPath: string = doc._raw.flattenedPath.replace(/^pages\/?/, "/");
  if (!urlPath.startsWith("/")) urlPath = `/${urlPath}`;
  if ("global_id" in doc) urlPath += `-${doc.global_id}`;
  // Remove preceding indexes from path segments
  urlPath = urlPath
    .split("/")
    .map((segment) => segment.replace(/^\d\d\d\-/, ""))
    .join("/");
  return urlPath;
};

export const getLastEditedDate = async (doc: DocumentGen): Promise<Date> => {
  const stats = await fs.stat(doc._raw.sourceFilePath);
  return stats.mtime;
};
