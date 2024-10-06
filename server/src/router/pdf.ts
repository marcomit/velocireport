import express from 'express';
import fs from "fs/promises";
import puppeteer from "puppeteer";
import { body, div, h1, h2, h3, h4, head, html, renderToString } from "../html";

const router = express.Router();

router.get("/:templateName", async (req, res) => {
  const { templateName } = req.params;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(
    renderToString(
      html(
        head(),
        body(div("ciao"), h1("ciao"), h2("ciao"), h3("ciao"), h4("ciao"))
      )
    )
  );
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    // path: `./report.pdf`,
  });

  await fs.writeFile(`./templates/${templateName}/report.pdf`, pdf);

  await browser.close();
  res.send(pdf);
});

export default router;
