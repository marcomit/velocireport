// ███╗   ███╗ █████╗ ██████╗  ██████╗ ██████╗ ███╗   ███╗██╗████████╗
// ████╗ ████║██╔══██╗██╔══██╗██╔════╝██╔═══██╗████╗ ████║██║╚══██╔══╝
// ██╔████╔██║███████║██████╔╝██║     ██║   ██║██╔████╔██║██║   ██║
// ██║╚██╔╝██║██╔══██║██╔══██╗██║     ██║   ██║██║╚██╔╝██║██║   ██║
// ██║ ╚═╝ ██║██║  ██║██║  ██║╚██████╗╚██████╔╝██║ ╚═╝ ██║██║   ██║
// ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝   ╚═╝

import cors from "cors";
import express from "express";
import fs from "fs/promises";
import path from "path";
import pdf, { renderToString } from "./engines/veloci-js";
import { default as data } from "./router/data";
import { default as pdfRouter } from "./router/pdf";
import { default as templates } from "./router/templates";

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../../templates")));
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use("/pdf", pdfRouter);
app.use("/templates", templates);
app.use("/data", data);

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

  const result = renderToString(
    pdf.html(
      pdf.head(pdf.style(css || ""), pdf.code(script || "")),
      pdf.body(content)
    )
  );

  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
