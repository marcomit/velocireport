import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import pdf, { renderToString } from "../html";
import { exists, treePath } from "./utils";

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
  public static PATH: string = path.join(__dirname, "../../templates");
  public get path() {
    return path.join(Template.PATH, this.name);
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
        return await exists(filePath);
      }

      return await exists(filePath);
    }
    return await exists(this.path);
  }
  public async create(classic: boolean = false) {
    if (!(await this.exists())) {
      await fs.mkdir(this.path);
    }

    if (classic) {
      await this.insert({
        name: "index.js",
        content: 'import { div } from "../../src/html"',
        parent: this.name,
      });
      await this.insert({
        name: "header.js",
        content: "",
        parent: this.name,
      });
      await this.insert({
        name: "footer.js",
        content: "",
        parent: this.name,
      });
      await this.insert({
        name: "style.css",
        content: "",
        parent: this.name,
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

    return await fs.readFile(fileName, "utf8");
  }
  public async rename(newName: string) {
    await fs.rename(
      path.join(Template.PATH, this.name),
      path.join(Template.PATH, newName)
    );
  }
  public async insert(file: Omit<TemplateTree, "type">) {
    const hasParentDir = await exists(path.join("..", file.parent));
    if (!hasParentDir) {
      await fs.mkdir(path.join(Template.PATH, file.parent), {
        recursive: true,
      });
    }
    await fs.writeFile(
      path.join(Template.PATH, file.parent, file.name!),
      file.content as string
    );
  }
  public async delete(file: TemplateTree) {
    await fs.rm(treePath(file), { recursive: true });
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
    try {
      const page = await browser.newPage();
      const template = await this.getContent();

      await page.setContent(renderToString(template), {
        waitUntil: "networkidle0",
      });
      const header = (await this.defaultScript("header")) || "";
      const footer = (await this.defaultScript("footer")) || "";

      const generatedPdf = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 100, bottom: 100, left: 100, right: 100 },
        displayHeaderFooter: true,
        headerTemplate: header ? renderToString(header) : "",
        footerTemplate: footer ? renderToString(footer) : "",
      });

      await fs.writeFile(`./templates/${this.name}/report.pdf`, generatedPdf);

      await browser.close();
      return generatedPdf;
    } catch (e) {
      browser.close();
      return `${e}`;
    }
  }
  public async script<T>(
    fileWithoutExtension: string,
    callback: (fileWithExtension: string) => Promise<T>
  ): Promise<T | null> {
    const fileName = fileWithoutExtension.split("\\").pop();
    console.log(fileName);
    
    if (await this.exists(fileWithoutExtension + ".ts")) {
      return await callback(fileName + ".ts");
    }
    if (await this.exists(fileWithoutExtension + ".js")) {
      return await callback(fileName + ".js");
    }
    return null;
  }
  public async defaultScript(fileName: string) {
    const content = (
      await this.script(
        treePath({ name: fileName, parent: this.name }),
        async (file) => await import(`../../templates/${this.name}/${file}`)
      )
    ).default;
    return await content();
  }
  // public async link(fileName: string) {}
  public async getContent() {
    const script = await this.get("script.js");
    const style = await this.get("style.css");
    const globalScript = await this.get("../shared/global.js");
    const globalStyle = await this.get("../shared/global.css");

    const content = await this.defaultScript("index");

    return pdf.html(
      pdf.head(
        pdf.style(globalStyle || ""),
        pdf.style(style || ""),
        pdf.script(globalScript || ""),
        pdf.script(script || "")
      ),
      pdf.body(content == null ? "" : content)
    );
  }
}

export default Template;
export type { TemplateTree };

