import { div } from "../../src/html";

export default async function () {
  return div(div().$("class", "pageNumber"), div().$("class", "totalPages"));
}
