import { div, span } from "../../src/html";

export default () => {
  return div(
    span().$("class", "pageNumber"),
    "/",
    span().$("class", "totalPages")
  )
    .$("id", "header-page")
    .$("style", "font-size:10px; color:#808080; padding-left:10px");
};
