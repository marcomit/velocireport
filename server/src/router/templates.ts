import express from "express";
import Template from "../functions/template";

const router = express.Router();
// Get all templates
router.get("/", async (req, res) => {
  const template = new Template("../../templates");
  const templates = await template.tree();
  console.log(templates);

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
  const { templateName } = req.body;

  const template = new Template(templateName, true);

  if (await template.exists()) {
    res.status(409).send("Template already exists");
    return;
  }

  await template.create(req.query.classic != null);

  res.send('Created template "' + templateName + '"');
});

router.post("/:templateName/:fileName", async (req, res) => {
  const { templateName, fileName: name } = req.params;
  const content = req.body;

  const template = new Template(templateName);

  if (!(await template.exists())) {
    res.status(404).send("Template not found");
    return;
  }
  if (await template.exists(name)) {
    res.status(404).send("File already exists");
    return;
  }
  await template.upsert({ name, content });
  res.send("File created");
});

router.put("/:templateName/:fileName", async (req, res) => {
  const { templateName, fileName: name } = req.params;
  const content = req.body;
  const template = new Template(templateName);
  if (!(await template.exists())) {
    res.status(404).send("Template not found");
    return;
  }
  if (!(await template.exists(name))) {
    res.status(404).send("File not found");
    return;
  }
  await template.upsert({ name, content });
  res.send("File updated");
});

export default router;
