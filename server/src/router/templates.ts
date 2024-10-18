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
  const filePath = treePath({ parent: templateName, name: fileName });
  if (!(await template.exists(filePath))) {
    res.status(404).send("File not found");
    return;
  }
  const file = await template.get(filePath);
  res.send(file);
});

router.post("/:templateName", async (req, res) => {
  const { templateName } = req.params;

  const template = new Template(templateName, true);

  if (await template.exists()) {
    res.status(409).send("Template already exists");
    return;
  }

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
  if (await template.exists(treePath(content))) {
    res.status(404).send("File already exists");
    return;
  }

  await template.insert(content);
  res.send("File created");
});

router.put("/", async (req, res) => {
  const contents = req.body;
  if (!Array.isArray(contents)) {
    res.status(400).send("Invalid request, body is not an array");
    return;
  }
  for (const content of contents) {
    if (!isTemplate(content)) {
      res.status(400).send("Invalid request, content is not a template");
    }
    const template = new Template(content.parent.split("/")[0] || "");
    if (!(await template.exists())) {
      res.status(404).send(`Template ${template.name} not found`);
      return;
    }

    if (!(await template.exists(treePath(content)))) {
      res
        .status(404)
        .send(`File ${content.name} not found ${treePath(content)}`);
      return;
    }

    await template.insert(content);
  }

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
  if (!(await template.exists(treePath(old)))) {
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

router.delete("/", async (req, res) => {
  const content: TemplateTree = req.body;
  if (!isTemplate(content)) {
    res.status(400).send('Invalid request, "body" is not a template');
    return;
  }
  const template = new Template(content.parent.split("/")[0] || "");
  if (!(await template.exists())) {
    res.status(404).send("Template not found");
    return;
  }
  if (!(await template.exists(treePath(content)))) {
    res
      .status(404)
      .send(`File ${path.join(content.parent, content.name)} not found`);
    return;
  }
  await template.delete(content);
  res.send("File deleted");
});

export default router;
