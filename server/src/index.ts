import express from 'express';
import fs from 'fs/promises';
import path from "path";
import {
  body,
  script as code,
  head,
  html,
  renderToString,
  style,
} from "./html";
import { default as pdf } from "./router/pdf";
import { default as templates } from "./router/templates";

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../../templates/scontrini")));
app.use("/pdf", pdf);
app.use("/templates", templates);

app.get("/", async (req, res) => {
  const content = await (await import("../templates/scontrini")).default();

  const hasCss = await fs.exists("templates/scontrini/style.css");
  const css =
    hasCss && (await fs.readFile("templates/scontrini/style.css", "utf8"));

  const hasScript = await fs.exists("templates/scontrini/script.js");
  const script =
    hasScript && (await fs.readFile("templates/scontrini/script.js", "utf8"));

  const hasHeader = await fs.exists("templates/scontrini/header.ts");
  const header =
    hasHeader &&
    (await import("fs")).readFileSync("templates/scontrini/header.ts", "utf8");

  const hasFooter = await fs.exists("templates/scontrini/footer.ts");
  const footer =
    hasFooter &&
    (await import("fs")).readFileSync("templates/scontrini/footer.ts", "utf8");

  // console.log(css, script);
  const result = renderToString(
    html(head(style(css || ""), code(script || "")), body(content))
  );

  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
