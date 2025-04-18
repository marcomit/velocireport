/*
 * Copyright (c) 2025, (Marco Menegazzi, Francesco Venanti)
 * All rights reserved.
 *
 * This source code is licensed under the BSD 3-Clause License found in the
 * LICENSE file in the root directory of this source tree.
 */

import type Template from "@/lib/template";
import pdf, { renderToString, type Content } from "@/syntax/veloci-js";
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
  async getContent(): Promise<{ template: Content, after: () => Promise<void> }> {
    const script = await this.template.get(
      this.template.join('script.js')
    );
    const style = await this.template.get(
      this.template.join('style.css')
    );

    const globalScript = await this.template.get(
      this.template.join('..', 'shared', 'global.js')
    );
    const globalStyle = await this.template.get("../shared/global.css");
    const data = await this.template.dynamicScript("data/index");

    const content = await this.template.defaultScript("index", "default", data);
    let after = await this.template.defaultScript("index", "after");
    if (!after) {
      after = async () => { };
    }
    if (!content) {
      throw new Error("Invalid template");
    }

    return {
      template: pdf.html(
        pdf.head(
          pdf.meta().$("charset", "utf-8"),
          pdf.script().$("src", "https://cdn.tailwindcss.com"),
          pdf.script().$("src", "https://cdn.jsdelivr.net/npm/chart.js"),
          pdf.style(globalStyle || ""),
          pdf.style(style || "")
        ),
        pdf.body(
          content == null ? "" : content,
          pdf.script(globalScript || ""),
          pdf.script(script || "")
        )
      ),
      after,
    };
  }
  // async generate(): Promise<Uint8Array | string> {
  //   const browser = await puppeteer.launch();
  //   try {
  //     const page = await browser.newPage();
  //     const { template, after } = await this.template.getContent();
  //     await page.setContent(renderToString(template as any), {
  //       waitUntil: "networkidle0",
  //     });
  //     await page.evaluate(async () => await after());
  //     const header = (await this.template.defaultScript("header")) || "";
  //     const footer = (await this.template.defaultScript("footer")) || "";
  //     const generatedPdf = await page.pdf({
  //       format: "A4",
  //       printBackground: true,
  //       preferCSSPageSize: true,
  //       margin: this.options.margin,
  //       displayHeaderFooter: true,
  //       headerTemplate: header ? renderToString(header) : "",
  //       footerTemplate: footer ? renderToString(footer) : "",
  //     });
  //
  //     await fs.writeFile(
  //       `./templates/${this.template.name}/report.pdf`,
  //       generatedPdf
  //     );
  //
  //     await browser.close();
  //     return generatedPdf;
  //   } catch (e) {
  //     browser.close();
  //     return `${e}`;
  //   }
  // }
  public async generate(): Promise<Uint8Array | Error> {
    const browser = await puppeteer.launch();
    try {
      const root = this.template;
      const page = await browser.newPage();
      const { template, after } = await root.getContent();

      await page.setContent(renderToString(template), {
        waitUntil: "networkidle0",
      });
      const header = (await root.defaultScript("header")) || "";
      const footer = (await root.defaultScript("footer")) || "";
      await page.evaluate(after);
      const generatedPdf = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: this.options?.margin?.top || 0,
          bottom: this.options?.margin?.bottom || 0,
          left: this.options?.margin?.left || 0,
          right: this.options?.margin?.right || 0,
        },
        displayHeaderFooter: true,
        headerTemplate: header ? renderToString(pdf.header(header)) : "",
        footerTemplate: footer ? renderToString(pdf.footer(footer)) : "",
      });

      // await fs.writeFile(`./templates/${root.name}/report.pdf`, generatedPdf);

      await browser.close();
      return generatedPdf;
    } catch (e) {
      browser.close();
      return e as Error;
    }

  }
}

export default PdfEngine;
