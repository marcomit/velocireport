import express from 'express';
import Template from "../functions/template";

const router = express.Router();

router.get("/:templateName", async (req, res) => {
  const { templateName } = req.params;

  if (templateName === "shared") {
    res.status(401).send("Cannot create shared pdf");
    return;
  }
  const template = new Template(templateName);

  const pdf = await template.pdf();
  res.set("Content-Type", "application/pdf");
  res.send(pdf);
});

export default router;
