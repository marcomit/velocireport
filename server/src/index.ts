import express from 'express';
import fs from 'fs/promises';
import puppeteer from 'puppeteer';
import { body, script as code, head, html, renderToString, style } from './html';
import { default as pdf } from './router/pdf';

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.json());
app.use('/pdf', pdf);

app.get('/', async (req, res) => {
  const content = await (await import('../templates/scontrini')).default()

  const hasCss = await fs.exists('templates/scontrini/style.css')
  const css = hasCss &&await fs.readFile('templates/scontrini/style.css', 'utf8');
  
  const hasScript = await fs.exists('templates/scontrini/script.js')
  const script = hasScript && await fs.readFile('templates/scontrini/script.js', 'utf8');

  const hasHeader = await fs.exists('templates/scontrini/header.ts')
  const header = hasHeader && (await import('fs')).readFileSync('templates/scontrini/header.ts', 'utf8')

  const hasFooter = await fs.exists('templates/scontrini/footer.ts')
  const footer = hasFooter && (await import('fs')).readFileSync('templates/scontrini/footer.ts', 'utf8')

  const result = renderToString(html(
    head(
      style(css || ''),
      code(script || '')
    ),
    body(content)
  ));
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(result);
  const buffer = await page.pdf({
    format: 'a4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: header || '',
    footerTemplate: footer || ''
  })
  await browser.close();
  res.send(buffer);
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
