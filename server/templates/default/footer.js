import pdf from "../../src/html";

export default async () => {
  return pdf
    .div(
      pdf.span().$("class", "pageNumber"),
      "/",
      pdf.span().$("class", "totalPages")
    )
    .$("id", "footer-page")
    .$("style", "font-size:10px !important; padding-left:10px");
};
