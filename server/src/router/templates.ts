import express from "express";
import path from "path";
import Template, { type TemplateTree } from "../functions/template";

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
  console.log(req.body);
  const content: TemplateTree = req.body;
  const template = new Template(content.parent.split("/")[0] || "");

  if (!(await template.exists())) {
    res.status(404).send("Template not found");
    return;
  }
  if (await template.exists(path.join(content.parent, content.name))) {
    res.status(404).send("File already exists");
    return;
  }
  await template.upsert(content);
  res.send("File created");
});

router.put("/", async (req, res) => {
  const content: TemplateTree = req.body;
  console.log(content);
  const template = new Template(content.parent.split("/")[0] || "");
  if (!(await template.exists())) {
    res.status(404).send("Template not found");
    return;
  }
  if (!(await template.exists(path.join(content.parent, content.name)))) {
    res.status(404).send("File not found");
    return;
  }
  await template.upsert(content);

  res.send("File updated");
});

export default router;
