import pdf from "../../src/html";
import data from "./data.json";

export default async () => {
  const scontrini = data["scontrini"];

  return pdf
    .table(
      pdf.thead(
        pdf.tr(
          pdf.th("Receipt ID"),
          pdf.th("Date"),
          pdf.th("Status"),
          pdf.th("Payment Status"),
          pdf.th("Description"),
          pdf.th("Quantity"),
          pdf.th("Unit Price"),
          pdf.th("Total Price")
        )
      ),
      pdf.tbody(
        ...scontrini.flatMap((scontrino) => {
          const righe = scontrino.righe || []; // Ensure righe exists
          return righe.map((riga) =>
            pdf.tr(
              pdf.td(scontrino._id),
              pdf.td(scontrino.editInfo.dataCreazione),
              pdf.td(scontrino.stato),
              pdf.td(scontrino.statoPagamento),
              pdf.td(riga.descrizione),
              pdf.td(riga.quantita),
              pdf.td(`$${riga.prezzoUnitario}`),
              pdf.td(`$${riga.prezzo}`)
            )
          );
        })
      )
    )
    .$("border", 1);
};
