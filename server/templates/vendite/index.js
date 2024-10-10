import pdf from "../../src/html";
import data from "../scontrini/data.json";
import { plus } from "./script";
export default async function () {
  return pdf.div(
    ...data["scontrini"].map((item, index) => pdf.p(plus(item, index + 1)))
  );
}
