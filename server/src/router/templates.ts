import express from "express";

import fs from "fs/promises";
import path from "path";
import type { Template } from "../functions/utils";

const router = express.Router();

// Get all templates
router.get("/", async (req, res) => {
  const items = await getTree(`../../templates`);

  res.send(items);
});

// Get a template
router.get("/:template", async (req, res) => {
  const { template } = req.params;

  const items = await getTree(`../../templates/${template}`);

  res.send(items);
});

// Get a file from a template
router.post("/:template/:fileName", async (req, res) => {
  const { template, fileName } = req.params;

  const filePath = path.join(
    __dirname,
    `../../templates/scontrini/${template}/${fileName}`
  );

  const exists = await fs.exists(filePath);

  if (!exists) {
    res.status(404).send("File not found");
    return;
  }
  const file = await getFile(template, fileName);
  res.send(file);
});

async function getFile(template: string, fileName: string) {
  const filePath = path.join(
    __dirname,
    `../../templates/${template}/${fileName}`
  );

  const exists = await fs.exists(filePath);

  if (!exists) {
    throw new Error("File not found", { cause: 404 });
  }

  const content = await fs.readFile(filePath, "utf8");
  return content;
}

async function getTree(
  directory: string,
  tree: Template[] = []
): Promise<Template[]> {
  const files = await fs.readdir(path.join(__dirname, directory));
  for (const file of files) {
    const stat = await fs.stat(path.join(__dirname, directory, file));
    if (stat.isDirectory()) {
      const children = await getTree(path.join(directory, file), []);
      tree.push({
        name: file,
        type: "directory",
        content: children,
      });
    } else if (stat.isFile()) {
      const content = await fs.readFile(
        path.join(__dirname, directory, file),
        "utf8"
      );
      tree.push({
        name: file,
        type: "file",
        content,
      });
    }
  }
  return tree;
}

export default router;
