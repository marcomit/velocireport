import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import * as m from "../html";

type TemplateTree = {
  name: string;
  type: "directory" | "file";
  parent: string;
  content: string | TemplateTree[];
};

class Template {
  name: string;
  type: "directory" | "file" = "directory";
  parent: string = "";
  content: string | TemplateTree[] = [];
  constructor(name: string, createIfNotExists: boolean = false) {
    this.name = name;
    if (createIfNotExists) {
      this.create();
    }
  }
  public async exists(filePath?: string, isDirectory: boolean = false) {
    if (filePath) {
      if (isDirectory) {
        try {
          await fs.access(path.join(__dirname, `../../templates/${this.name}`));
          return true;
        } catch (e) {
          return false;
        }
      }
      return await fs.exists(
        path.join(__dirname, `../../templates/${this.name}/${filePath}`)
      );
    }
    try {
      await fs.access(path.join(__dirname, `../../templates/${this.name}`));
      return true;
    } catch (e) {
      return false;
    }
  }
  public async create() {
    if (await this.exists()) {
      return;
    }
    await fs.mkdir(path.join(__dirname, `../../templates/${this.name}`));
  }
  public async tree(
    directory: string = this.name,
    tree: TemplateTree[] = [],
    parent: string = ""
  ) {
    const files = await fs.readdir(path.join(__dirname, directory));
    for (const file of files) {
      const stat = await fs.stat(path.join(__dirname, directory, file));
      if (stat.isDirectory()) {
        const children = await this.tree(
          path.join(directory, file),
          [],
          path.join(parent, file)
        );
        tree.push({
          name: file,
          type: "directory",
          parent,
          content: children,
        });
      } else if (stat.isFile()) {
        const content = await fs.readFile(
          path.join(__dirname, directory, file),
          "utf8"
        );
        tree.push({
          name: file,
          type: "file",
          parent,
          content,
        });
      }
    }
    return tree;
  }
  public async get(fileName: string) {
    if (!(await this.exists(fileName))) {
      return null;
    }

    return await fs.readFile(
      path.join(__dirname, `../../templates/${this.name}/${fileName}`),
      "utf8"
    );
  }
  public async upsert(file: TemplateTree) {}
  public async delete(file: TemplateTree) {
    if (
      file.name == "index.ts" ||
      file.name == "index.js" ||
      file.name == "style.css"
    )
      return;
  }
  public async pdf() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const template = await this.getContent();
    await page.setContent(m.renderToString(template));
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    await fs.writeFile(`./templates/${this.name}/report.pdf`, pdf);

    await browser.close();
    return pdf;
  }
  public async link(fileName: string) {}
  public async getContent() {
    const script = await this.get("script.js");
    const style = await this.get("style.css");
    const globalScript = await this.get("../shared/global.js");
    const globalStyle = await this.get("../shared/global.css");
    const content = (await import(`../../templates/${this.name}/index.ts`))
      .default;
    return m.html(
      m.head(
        m.style(globalStyle || ""),
        m.style(style || ""),
        m.script(globalScript || ""),
        m.script(script || "")
      ),
      m.body(await content())
    );
  }
}

export default Template;
export type { TemplateTree };
