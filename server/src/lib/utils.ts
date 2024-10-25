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
function validate(obj: object, keys: string[] = []) {
  for (const key of keys) {
    if (!(key in obj)) {
      return false;
    }
  }
  return true;
}

function treePath(tree: Omit<TemplateTree, "type" | "content" | "path">) {
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

type Permission = "read" | "rename" | "write" | "delete";

// At runtime all {} are replaced with the templateName
const hiddenFiles: (Omit<TemplateTree, "type" | "content"> & {
  denied: Set<Permission>;
})[] = [
  {
    name: "hidden",
    parent: "",
    denied: new Set<Permission>(["delete", "read", "rename", "write"]),
  },
  {
    name: "data",
    parent: "{}",
    denied: new Set<Permission>(["delete", "read", "rename"]),
  },
  {
    name: "style.css",
    parent: "{}",
    denied: new Set<Permission>(["delete", "read", "rename"]),
  },
  {
    name: "index.js",
    parent: "{}",
    denied: new Set<Permission>(["delete", "read", "rename"]),
  },
  {
    name: "report.pdf",
    parent: "{}",
    denied: new Set<Permission>(["delete", "read", "rename"]),
  },
  {
    name: "default",
    parent: "",
    denied: new Set<Permission>(["delete", "read", "rename", "write"]),
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

function isDenied(
  file: Omit<TemplateTree, "type" | "content">,
  templateName: string,
  permissions: Permission[]
) {
  const parent =
    templateName === "" ? "" : file.parent.replace(templateName, "{}");
  for (const hidden of hiddenFiles) {
    if (file.name === hidden.name && parent === hidden.parent) {
      for (const permission of permissions) {
        if (hidden.denied.has(permission)) {
          return true;
        }
      }
    }
  }
  return false;
}

async function copy(src: string, dest: string) {
  const files = await readdir(src);
  if (!(await exists(dest))) {
    await mkdir(dest);
  }
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
  isDenied,
  isHidden,
  treePath,
  validate,
};

