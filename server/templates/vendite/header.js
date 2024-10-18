import pdf from "@/engines/veloci-js";

export default async function () {
  return pdf.div(
    pdf.h1("prova"),
    pdf.div().$("class", "pageNumber"),
    pdf.div().$("class", "totalPages")
  );
}
