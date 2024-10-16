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
  await template.connect({ type, name, content, format });
  res.send("OK");
});

// Midifica la richiesta
router.put("/:templateName", async (req, res) => {
  const { templateName } = req.params;
});
export default router;
