import express from 'express';
import puppeteer from 'puppeteer';

const router = express.Router();

router.get("/:template", async (req, res) => {
  const { template } = req.params;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:80/templates/scontrini/${template}`);
  const content = await page.content();
  await browser.close();
  res.send(content);
});

export default router;
