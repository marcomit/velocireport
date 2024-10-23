import { access, mkdir, readdir, readFile, stat, writeFile } from "fs/promises";
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

// At runtime all {} are replaced with the templateName
const hiddenFiles: Omit<TemplateTree, "type" | "content">[] = [
  {
    name: "hidden",
    parent: "",
  },
  {
    name: "index.js",
    parent: path.join("{}", "data"),
  },

  {
    name: "data",
    parent: "{}",
  },
  {
    name: "report.pdf",
    parent: "{}",
  },
  {
    name: "default",
    parent: "",
  },
];

function isHidden(
  file: Omit<TemplateTree, "type" | "content">,
  templateName: string
) {
  const parent =
    templateName === "" ? "" : file.parent.replace(templateName, "{}");
  for (const hidden of hiddenFiles) {
    if (file.name === hidden.name && parent === hidden.parent) {
      return true;
    }
  }
  return false;
}

async function copy(src: string, dest: string) {
  const files = await readdir(src);
  if (!(await exists(dest))) await mkdir(dest, { recursive: true });
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const statFile = await stat(srcPath);
    if (statFile.isDirectory()) {
      await copy(srcPath, destPath);
    } else {
      await writeFile(destPath, await readFile(srcPath));
    }
  }
}

export {
  capitalize,
  copy,
  exists,
  isAlphanumeric,
  isHidden,
  isTemplate,
  treePath,
};
