import pdf from "@/syntax/veloci-js";

export default async (content) => {
  const receipts = (await content.getScontriniData())["scontrini"];
  const createReceiptRows = (receipt) => {
    const items = receipt.righe || [];
    return items.map((item) => {
      const priceClass = item.prezzo > 100 ? "price--high" : "price--normal";
      return pdf.tr(
        pdf
          .td(receipt._id)
          .$("class", `receipt__id receipt__id--${receipt._id}`),
        pdf.td(receipt.editInfo.dataCreazione).$("class", "receipt__date"),
        pdf.td(receipt.stato).$("class", "receipt__status"),
        pdf.td(receipt.statoPagamento).$("class", "receipt__payment-status"),
        pdf.td(item.descrizione).$("class", "receipt__description"),
        pdf.td(item.quantita).$("class", "receipt__quantity"),
        pdf.td(`$${item.prezzoUnitario}`).$("class", "receipt__unit-price"),
        pdf
          .td(`$${item.prezzo}`)
          .$("class", `receipt__total-price ${priceClass}`)
      );
    });
  };
  const calculateTotal = () =>
    receipts
      .reduce((sum, receipt) => sum + (receipt.totale || 0), 0)
      .toFixed(2);

  return {
    after: async () => {
      document.getElementById("after").innerHTML = `Total`;
      const ctx = document.getElementById("prova");

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [
            {
              label: "# of Votes",
              data: [12, 19, 3, 5, 2, 3],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
    content: pdf.div(
      pdf
        .h1("Receipts Report")
        .$("class", "text-center text-red-500")
        .$("id", "after"),
      pdf
        .table(
          pdf.thead(
            pdf.tr(
              pdf.th("Receipt ID").$("class", "table__header"),
              pdf.th("Date").$("class", "table__header"),
              pdf.th("Status").$("class", "table__header text-red"),
              pdf.th("Payment Status").$("class", "table__header"),
              pdf.th("Description").$("class", "table__header"),
              pdf.th("Quantity").$("class", "table__header"),
              pdf.th("Unit Price").$("class", "table__header"),
              pdf.th("Total Price").$("class", "table__header")
            )
          ),
          pdf.tbody(
            ...receipts.flatMap((receipt) => createReceiptRows(receipt)),
            pdf.tr(
              pdf.td().$("colspan", 6),
              pdf.td("Total:").$("class", "receipt__total-label"),
              pdf
                .td(`$${calculateTotal()}`)
                .$("class", "receipt__overall-total")
            )
          )
        )
        .$("border", 1)
        .$("class", "table table--receipts"),
      pdf.canvas().$("id", "prova")
    ),
  };
};
