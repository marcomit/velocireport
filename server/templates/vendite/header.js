import { div, h1 } from "../../src/html";

export default async function () {
  return div(
    h1("prova"),
    div().$("class", "pageNumber"),
    div().$("class", "totalPages")
  );
}
