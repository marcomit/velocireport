import pdf from "../../src/html";

export default async function () {
  return pdf.div(
    pdf.div().$("class", "pageNumber"),
    pdf.div().$("class", "totalPages")
  );
}
