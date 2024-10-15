import express from "express";
import Template from "../lib/template";

const router = express.Router();

router.get("/:templateName", async (req, res) => {
  const { templateName } = req.params;
  if (templateName === "shared") {
    res.status(401).send("Cannot create shared pdf");
    return;
  }
  const template = new Template(templateName);

  if (!(await template.exists())) {
    res.status(404).send("Template not found");
    return;
  }

  try {
    const pdf = await template.pdf();
    res.set("Content-Type", "application/pdf");
    res.send(pdf);
  } catch (e) {
    res.status(400).send(`${e}`);
  }
});

export default router;
