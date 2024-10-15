import { access } from "fs/promises";
import path from "path";
import type { TemplateTree } from "./template";
import Template from "./template";
async function exists(path: string) {
  try {
    await access(path);
    return true;
  } catch (e) {
    return false;
  }
}
function isTemplate(obj: object) {
  return "type" in obj && "name" in obj && "parent" in obj && "content" in obj;
}

function treePath(tree: Omit<TemplateTree, "type" | "content">) {
  return path.join(Template.PATH, tree.parent, tree.name);
}

function isAlphanumeric(str: string): boolean {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(str);
}
function capitalize(str: string): string {
  if (str.length === 0) return str;

  return str.charAt(0).toUpperCase() + str.slice(1);
}
export { exists, isTemplate, treePath, isAlphanumeric, capitalize };
