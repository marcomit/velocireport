import express from "express";
import Template from "../functions/utils";

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

export default router;
