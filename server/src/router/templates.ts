import express from "express";
import fs from "fs/promises";
import path from "path";
import Template, { type TemplateTree } from "../lib/template";
import { exists, isTemplate, treePath } from "../lib/utils";

const router = express.Router();
// Get all templates
router.get("/", async (req, res) => {
  const template = new Template("../../templates");
  const templates = await template.tree();

  res.send(templates);
});

// Get a template
router.get("/:templateName", async (req, res) => {
  const { templateName } = req.params;

  const template = new Template(templateName);

  if (!(await template.exists())) {
    res.status(404).send("Template not found");
    return;
  }

  const items = await template.tree(`../../templates/${templateName}`);

  res.send(items);
});

// Get a file from a template
router.get("/:templateName/:fileName", async (req, res) => {
  const { templateName, fileName } = req.params;

  const template = new Template(templateName);

  if (!(await template.exists(fileName))) {
    res.status(404).send("File not found");
    return;
  }
  const file = await template.get(fileName);
  res.send(file);
});

router.post("/:templateName", async (req, res) => {
  const { templateName } = req.params;
  console.log(templateName);

  const template = new Template(templateName, true);

  if (await template.exists()) {
    res.status(409).send("Template already exists");
    return;
  }
  console.log(req.query);

  await template.create(req.query.default != null);

  res.send('Created template "' + templateName + '"');
});

router.post("/", async (req, res) => {
  const content: TemplateTree = req.body;
  if (content.type === "directory") {
    if (await exists(path.join("..", content.parent, content.name))) {
      res.status(409).send("Directory already exists");
      return;
    }

    await fs.mkdir(path.join("..", content.parent, content.name), {
      recursive: true,
    });
    res.send("Directory created");
    return;
  }

  const template = new Template(content.parent.split("/")[0] || "");

  if (!(await template.exists())) {
    res.status(404).send("Template not found");
    return;
  }
  if (await template.exists(path.join("..", content.parent, content.name))) {
    res.status(404).send("File already exists");
    return;
  }

  await template.insert(content);
  res.send("File created");
});

router.put("/", async (req, res) => {
  const content: TemplateTree = req.body;
  const template = new Template(content.parent.split("/")[0] || "");
  if (!(await template.exists())) {
    res.status(404).send("Template not found");
    return;
  }

  if (!(await template.exists(path.join("..", content.parent, content.name)))) {
    res.status(404).send("File not found");
    return;
  }

  await template.insert(content);

  res.send("File updated");
});

router.put("/rename/:templateName", async (req, res) => {
  const content = req.body;
  if (!("old" in content && "new" in content)) {
    res.status(400).send('Invalid request, missing "old" or "new" fields');
    return;
  }
  const { old, new: newName }: { old: TemplateTree; new: TemplateTree } =
    content;
  if (!isTemplate(old)) {
    res.status(400).send('Invalid request, "old" is not a template');
    return;
  }
  if (!isTemplate(newName)) {
    res.status(400).send('Invalid request, "new" is not a template');
    return;
  }
  const template = new Template(req.params.templateName);
  if (!(await template.exists())) {
    res.status(404).send("Template not found");
    return;
  }
  if (!(await template.exists(path.join("..", old.parent, old.name)))) {
    res.status(404).send(`File ${old.name} not found`);
    return;
  }
  try {
    await fs.rename(treePath(old), treePath(newName));
    res.send("File renamed");
  } catch (e) {
    res.status(400).send(e);
  }
});

export default router;
