import { Router } from "express";
import { readFile } from "fs/promises";
import path from "path";
import { htmlToNode, renderToString } from "../engines/veloci-js";

const router = Router();

router.get("/", async (req, res) => {
  const html = await readFile(path.join(__dirname, "index.html"), "utf8");
  res.send(renderToString(htmlToNode(html)));
});

export default router;
