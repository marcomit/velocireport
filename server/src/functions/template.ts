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
  public get path() {
    return path.join(__dirname, `../../templates/${this.name}`);
  }
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
  public async create(classic: boolean = false) {
    if (await this.exists()) {
      return;
    }
    await fs.mkdir(this.path);
    if (classic) {
      await this.upsert({
        name: "index.js",
        content: 'import { div } from "../../src/html"',
      });
      await this.upsert({
        name: "header.js",
        content: "",
      });
      await this.upsert({
        name: "footer.js",
        content: "",
      });
      await this.upsert({
        name: "style.css",
        content: "",
      });
    }
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
  public async upsert(file: Omit<Omit<TemplateTree, "parent">, "type">) {
    const exists = await this.exists(file.name);
    await fs.writeFile(
      path.join(this.path, file.name!),
      file.content as string
    );
    return exists;
  }
  public async delete(file: TemplateTree) {
    if (
      file.name == "index.ts" ||
      file.name == "index.js" ||
      file.name == "style.css"
    ) {
      return;
    }
  }
  public async pdf() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const template = await this.getContent();
    await page.setContent(m.renderToString(template));
    const header = (await this.defaultScript("header")) || "";
    const footer = (await this.defaultScript("footer")) || "";
    
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 100, bottom: 100, left: 100, right: 100 },
      displayHeaderFooter: true,
      headerTemplate: header ? m.renderToString(header) : "",
      footerTemplate: footer ? m.renderToString(footer) : "",
    });

    await fs.writeFile(`./templates/${this.name}/report.pdf`, pdf);

    await browser.close();
    return pdf;
  }
  public async script<T>(
    fileWithoutExtension: string,
    callback: (fileWithExtension: string) => Promise<T>
  ): Promise<T | null> {
    if (await this.exists(fileWithoutExtension + ".ts")) {
      return await callback(fileWithoutExtension + ".ts");
    }
    if (await this.exists(fileWithoutExtension + ".js")) {
      return await callback(fileWithoutExtension + ".js");
    }
    return null;
  }
  public async defaultScript(fileName: string) {
    const content = (
      await this.script(
        fileName,
        async (file) => await import(`../../templates/${this.name}/${file}`)
      )
    ).default;
    return await content();
  }
  public async link(fileName: string) {}
  public async getContent() {
    const script = await this.get("script.js");
    const style = await this.get("style.css");
    const globalScript = await this.get("../shared/global.js");
    const globalStyle = await this.get("../shared/global.css");
    const content = await this.defaultScript("index");
    return m.html(
      m.head(
        m.style(globalStyle || ""),
        m.style(style || ""),
        m.script(globalScript || ""),
        m.script(script || "")
      ),
      m.body(content == null ? "" : content)
    );
  }
}

export default Template;
export type { TemplateTree };

