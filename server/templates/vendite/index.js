import * as m from "../../src/html";
import data from "../scontrini/data.json";
import { plus } from "./script";
export default async function () {
  return m.div(
    ...data["scontrini"].map((item, index) => m.p(plus(item, index + 1)))
  );
}
