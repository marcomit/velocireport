import type Template from "@/lib/template";
import { renderToString } from "@/syntax/veloci-js";
import fs from "fs/promises";
import type { PDFOptions } from "puppeteer";
import puppeteer from "puppeteer";
import Engine from "./engine";

class PdfEngine extends Engine {
  public options: PDFOptions;
  constructor(template: Template, options: PDFOptions = {}) {
    super(template);
    this.options = options;
  }

  async generate(): Promise<Uint8Array | string> {
    const browser = await puppeteer.launch();
    try {
      const page = await browser.newPage();
      const template = await this.template.getContent();
      await page.setContent(renderToString(template), {
        waitUntil: "networkidle0",
      });
      const header = (await this.template.defaultScript("header")) || "";
      const footer = (await this.template.defaultScript("footer")) || "";
      const generatedPdf = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: this.options.margin,
        displayHeaderFooter: true,
        headerTemplate: header ? renderToString(header) : "",
        footerTemplate: footer ? renderToString(footer) : "",
      });

      await fs.writeFile(
        `./templates/${this.template.name}/report.pdf`,
        generatedPdf
      );

      await browser.close();
      return generatedPdf;
    } catch (e) {
      browser.close();
      return `${e}`;
    }
  }
}

export default PdfEngine;
