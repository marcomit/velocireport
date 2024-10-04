import express from 'express';
import puppeteer from 'puppeteer';

const router = express.Router();

router.post('/templates', async (req, res) => {
  const { url } = req.body;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const buffer = await page.screenshot();
  await browser.close();
  res.send(buffer);
});

export default router;
