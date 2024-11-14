import fs from "fs/promises";
import path from "path";
import puppeteer, { type PDFMargin } from "puppeteer";
import { type Data } from "../lib/types";
import pdf, { renderToString, type TreeNode } from "../syntax/veloci-js";
import { capitalize, copy, exists, isDenied, treePath } from "./utils";

interface TemplateTree {
  name: string;
  type: "directory" | "file";
  parent: string;
  content: string | TemplateTree[];
  path?: number[];
}

class Template {
  name: string;
  type: "directory" | "file" = "directory";
  parent: string = "";
  content: string | TemplateTree[] = [];
  public static PATH: string = path.join(__dirname, "..", "..", "templates");
  public get path() {
    return path.join(Template.PATH, this.name);
  }
  constructor(name: string, createIfNotExists: boolean = false) {
    this.name = name;
    if (createIfNotExists) {
      this.create();
    }
  }
  public async init() {
    this.content = await this.tree();
    return this;
  }
  public async exists(filePath?: string, type: TemplateTree["type"] = "file") {
    if (filePath) {
      if (type === "directory") {
        return await exists(filePath);
      }

      return await exists(filePath);
    }
    return await exists(this.path);
  }
  public async create() {
    await copy(treePath({ name: "", parent: "default" }), this.path);
  }
  public async tree(
    directory: string = this.name,
    tree: TemplateTree[] = [],
    parent: string = "",
    location: number[] = []
  ) {
    const files = await fs.readdir(path.join(__dirname, directory));
    let counter = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const stat = await fs.stat(path.join(__dirname, directory, file));
      if (
        isDenied({ name: file, parent }, parent.split(path.sep)[0], ["read"])
      ) {
        counter++;
        continue;
      }
      if (stat.isDirectory()) {
        const children = await this.tree(
          path.join(directory, file),
          [],
          path.join(parent, file),
          [...location, i - counter]
        );
        tree.push({
          name: file,
          type: "directory",
          parent,
          content: children,
          path: [...location, i - counter],
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
          path: [...location, i - counter],
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
  public async rename(newName: string, location: number[] = []) {
    const file = this.getTreeFromPath(location);
    if (newName === file.name) {
      throw new Error("New name cannot be the same as old name");
    }
    await fs.rename(treePath(file), treePath({ ...file, name: newName }));
  }
  public getTreeFromPath(location: number[] = []) {
    let tree: TemplateTree = this.content[location[0]] as TemplateTree;
    for (let i = 1; i < location.length; i++) {
      tree = tree.content[location[i]] as TemplateTree;
    }
    return tree;
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
  public async delete(file: Omit<TemplateTree, "type" | "path" | "content">) {
    if (isDenied(file, this.name, ["delete"])) {
      throw new Error("You cannot delete this file");
    }
    await fs.rm(treePath(file), { recursive: true, force: true });
  }
  public async pdf(
    margin: PDFMargin = { top: 0, bottom: 0, left: 0, right: 0 }
  ): Promise<Uint8Array | string> {
    const browser = await puppeteer.launch();
    try {
      const page = await browser.newPage();
      const [template, after] = await this.getContent();

      await page.setContent(renderToString(template), {
        waitUntil: "networkidle0",
      });
      const header = (await this.defaultScript("header")) || "";
      const footer = (await this.defaultScript("footer")) || "";
      await page.evaluate(after);
      const generatedPdf = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: margin.top || 0,
          bottom: margin.bottom || 0,
          left: margin.left || 0,
          right: margin.right || 0,
        },
        displayHeaderFooter: true,
        headerTemplate: header ? renderToString(pdf.header(header)) : "",
        footerTemplate: footer ? renderToString(pdf.footer(footer)) : "",
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
    const fileName = fileWithoutExtension.split(path.sep).pop();

    if (await this.exists(fileWithoutExtension + ".ts")) {
      return await callback(fileName + ".ts");
    }
    if (await this.exists(fileWithoutExtension + ".js")) {
      return await callback(fileName + ".js");
    }
    return null;
  }
  public async dynamicScript(fileName: string) {
    const module = await this.script(
      treePath({ name: fileName, parent: this.name }),
      async (name) =>
        await import(treePath({ name: fileName, parent: this.name }))
    );

    if (module === null) {
      return null;
    }
    const functions: Record<string, any> = {};
    for (const [key, value] of Object.entries(module)) {
      (functions as any)[key] = value;
    }
    return functions;
  }
  public async defaultScript(
    fileName: string,
    functionName: string = "default",
    ...args: any[]
  ) {
    const content = await this.dynamicScript(fileName);

    if (!content) {
      return null;
    }
    if (!content[functionName]) {
      return null;
    }
    return await content[functionName](...args);
  }
  public async getContent(): Promise<[TreeNode, () => Promise<any>]> {
    const script = await this.get(
      treePath({ name: "script.js", parent: this.name })
    );
    const style = await this.get(
      treePath({ name: "style.css", parent: this.name })
    );

    const globalScript = await this.get(
      treePath({ name: "../shared/global.js", parent: "" })
    );
    const globalStyle = await this.get("../shared/global.css");
    const data = await this.dynamicScript("data/index");

    const content = await this.defaultScript("index", "default", data);
    let after = async () => {};
    if (!("content" in content)) {
      throw new Error("Invalid template");
    }
    if ("after" in content && typeof content.after === "function") {
      after = content.after;
    }

    return [
      pdf.html(
        pdf.head(
          pdf.meta().$("charset", "utf-8"),
          pdf.script().$("src", "https://cdn.tailwindcss.com"),
          pdf.script().$("src", "https://cdn.jsdelivr.net/npm/chart.js"),
          pdf.style(globalStyle || ""),
          pdf.style(style || "")
        ),
        pdf.body(
          content == null ? "" : content.content,
          pdf.script(globalScript || ""),
          pdf.script(script || "")
        )
      ),
      after,
    ];
  }
  public async connect({ type, name, content, format }: Data) {
    const fileName = this.data({ type, name, format });

    let formattedContent = "";

    switch (format) {
      case "json":
        formattedContent = JSON.stringify(content);
        break;
      default:
        formattedContent = content;
        break;
    }

    await this.insert({
      name: `data/${fileName}`,
      content: formattedContent,
      parent: this.name,
    });
    const bridgeFunction = await this.bridgeFunction({ type, format, name });
    await fs.appendFile(
      treePath({ name: "data/index.js", parent: this.name }),
      `${bridgeFunction}\n`
    );
  }
  public bridgeFunction({ type, format, name }: Omit<Data, "content">) {
    return `export const get${capitalize(
      name
    )} = async () => await format.${format}(join(__dirname, "${this.data({
      type,
      name,
      format,
    })}"));`;
  }
  public data({ type, name, format }: Omit<Data, "content">) {
    return `${type}-${type === "raw" ? `${name}.${format}` : name}`;
  }
}

export default Template;
export type { TemplateTree };

