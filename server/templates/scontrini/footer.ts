import { div, span } from "../../src/html";

export default () => {
  // '<div id="header-template" style="font-size:10px; color:#808080; padding-left:10px"><span class="pageNumber"></span><span class="totalPages"></span></div>'
  div(span().$("class", "pageNumber"), "/", span().$("class", "totalPages"))
    .$("id", "footer-page")
    .$("style", "font-size:10px !important; padding-left:10px");
};
