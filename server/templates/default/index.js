import pdf from "../../src/html";

export default async () => {
  return pdf
    .div(
      pdf
        .span()
        .$("class", "pageNumber")
        .$("style", "font-size:10px !important; padding-left:10px"),
      "/",
      pdf
        .span()
        .$("class", "totalPages")
        .$("style", "font-size:10px !important; padding-left:10px")
    )
    .$("id", "footer-page");
};
