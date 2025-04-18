/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

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
      const [template, after] = await this.template.getContent();
      await page.setContent(renderToString(template as any), {
        waitUntil: "networkidle0",
      });
      await page.evaluate(async () => await after());
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
