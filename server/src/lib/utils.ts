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
function rawValidate(obj: object, keys: string[] = []) {
  for (const key of keys) {
    if (!(key in obj)) {
      return false;
    }
  }
  return true;
}

type ValidateOptions = {
  checkTypes: boolean;
  omitKeys: string[];
};
function validate(
  model: object,
  obj: object,
  options: ValidateOptions = {
    checkTypes: true,
    omitKeys: [],
  }
): boolean {
  const omitKeys = new Set(options.omitKeys);
  const keys = Object.keys(model);
  for (const key of keys) {
    if (omitKeys.has(key)) {
      continue;
    }
    const value = model[key as keyof typeof model];
    const objValue = obj[key as keyof typeof obj];
    if (!(key in obj)) {
      return false;
    }
    if (options.checkTypes && typeof value !== typeof objValue) {
      return false;
    }
    if (typeof value === "object") {
      if (!validate(value as object, objValue as object, options)) {
        return false;
      }
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
    name: "prova",
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
    denied: new Set<Permission>(["delete", "rename"]),
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

function isDenied(
  file: Omit<TemplateTree, "type" | "content">,
  templateName: string,
  permissions: Permission[]
) {
  const parent =
    templateName === "" ? "" : file.parent.replace("{}", templateName);
  for (const hidden of hiddenFiles) {
    if (treePath(file) === treePath({ name: hidden.name, parent })) {
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
  rawValidate,
  treePath,
  validate,
};
