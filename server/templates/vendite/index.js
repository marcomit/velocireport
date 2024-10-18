import pdf from "../../src/html";
import data from "../scontrini/data.json";
import * as content from './data'
export default async function () {
    const test = await content.getScontriniData();
  return pdf
    .table(
        pdf.p(JSON.stringify(test)),
      pdf.tbody(
        ...data["scontrini"].map((item, index) =>
          pdf.tr(
            pdf.td(item["_id"]),
            pdf.td(item["prodotto"]),
            riga(item["righe"])
          )
        )
      )
    )
    .$("border", 1);
}

function riga(righe) {
  return pdf
    .table(
      pdf.tbody(
        ...righe.map((el, i) =>
          pdf.tr(pdf.td(el["prezzo"]), pdf.td(el["tipo"]))
        )
      )
    )
    .$("border", 1);
}