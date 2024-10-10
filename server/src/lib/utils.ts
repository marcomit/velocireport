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

export { exists, isTemplate, treePath };

