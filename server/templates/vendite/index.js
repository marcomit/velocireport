import pdf from "@/syntax/veloci-js";
import data from "../scontrini/data.json";
export default async function (content) {
  const vendite1 = await content.getVenditeData();
  const vendite2 = await content.getVenditeDataaaa();
  return {content :
  pdf.div(
   pdf
    .table(
      pdf.p(JSON.stringify(vendite2)),
      pdf.tbody(
        ...data["scontrini"].map((item, index) =>
          pdf.tr(
            pdf.td("INDICE: " + index),
            pdf.td(item["_id"]),
            pdf.td(item["prodotto"]),
            riga(item["righe"])
          ).$("class", "border-4 border-indigo-500").$("style", "border-radius:20px")
        )
      )
    )
    , ).$("class", "border-2 border-black"),
    after : () => {}
    }
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
