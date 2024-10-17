import { Router } from "express";
import Template from "../lib/template";
import { DataSchema } from "../lib/types";
import { isAlphanumeric, treePath } from "../lib/utils";

const router = Router();

router.post("/:templateName", async (req, res) => {
  const { templateName } = req.params;
  const body = DataSchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).send(body.error.issues.map((i) => i.message));
    return;
  }
  const { name, type, format, content } = body.data;
  const template = new Template(templateName);
  if (!(await template.exists())) {
    res.status(404).send("Template not found");
    return;
  }
  console.log(treePath({ name, parent: `${templateName}/data` }));
  if (
    await template.exists(
      treePath({
        name: template.data({ type, name, format }),
        parent: `${templateName}/data`,
      })
    )
  ) {
    res.status(400).send("Data already exists");
    return;
  }
  if (!isAlphanumeric(name)) {
    res.status(400).send("Invalid name");
    return;
  }
  try {
    await template.connect({ type, name, content, format });
  } catch (e) {
    res.status(400).send(e);
  }
  res.send("OK");
});

router.delete("/:templateName/:data", async (req, res) => {
  const { data } = req.params;
  const { type } = req.body;

  if (!type) {
    res.status(400).send('Invalid request, missing "format" or "type" field');
  }

  const template = new Template(req.params.templateName);
  if (!(await template.exists())) {
    res.status(404).send("Template not found");
    return;
  }
  if (!(await template.exists(treePath({ name: data, parent: "data" })))) {
    res.status(404).send("Data not found");
    return;
  }
  await template.delete({
    name: template.data({ name: data, type, format: type }),
    parent: "data",
  });
  res.send("OK");
});
export default router;
