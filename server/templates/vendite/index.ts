import * as m from "../../src/html";
import data from "../scontrini/data.json";
import { plus20 } from "./script";
export default async function () {
  return m.div(
    "ciao",
    ...(data as any[]).map((item, index) => m.p(plus20(item, index + 14)))
  );
}
