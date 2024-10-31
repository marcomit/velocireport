import pdf from "@/syntax/veloci-js";
// import * as content from "./data";
// Generate the PDF structure for the receipts report
export default async (content) => {
  // const receipts = data["scontrini"];
  const receipts = (await content.getScontriniData())['scontrini'];
  // const receipts = (await content.getScontriniData())["scontrini"];
  // Function to create a table row for each item in the receipt
  const createReceiptRows = (receipt) => {
    const items = receipt.righe || []; // Ensure items exist
    return items.map((item) => {
      const priceClass = item.prezzo > 100 ? "price--high" : "price--normal"; // Conditional price class
      return pdf.tr(
        pdf
          .td(receipt._id)
          .$("class", `receipt__id receipt__id--${receipt._id}`), // Dynamic class for receipt ID
        pdf.td(receipt.editInfo.dataCreazione).$("class", "receipt__date"),
        pdf.td(receipt.stato).$("class", "receipt__status"),
        pdf.td(receipt.statoPagamento).$("class", "receipt__payment-status"),
        pdf.td(item.descrizione).$("class", "receipt__description"),
        pdf.td(item.quantita).$("class", "receipt__quantity"),
        pdf.td(`$${item.prezzoUnitario}`).$("class", "receipt__unit-price"), // Format unit price
        pdf
          .td(`$${item.prezzo}`)
          .$("class", `receipt__total-price ${priceClass}`) // Conditional class for price
      );
    });
  };
  // Function to calculate the overall total for the receipts
  const calculateTotal = () =>
    receipts
      .reduce((sum, receipt) => sum + (receipt.totale || 0), 0)
      .toFixed(2);

  return pdf.div(
    pdf.h1("Receipts Report").$("class", "text-center text-red-500"),
    // pdf.canvas().$("id", "prova"),
    pdf
      .table(
        // Define the table header
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
        // Define the table body, mapping each receipt and its items
        pdf.tbody(
          ...receipts.flatMap((receipt) => createReceiptRows(receipt)), // Generate rows for each receipt
          // Add a final row for the overall total
          pdf.tr(
            pdf.td().$("colspan", 6), // Empty cells to align the total
            pdf.td("Total:").$("class", "receipt__total-label"),
            pdf.td(`$${calculateTotal()}`).$("class", "receipt__overall-total")
          )
        )
      )
      .$("border", 1) // Apply border style
      .$("class", "table table--receipts"),
    pdf.canvas().$("id", "prova")
  ); // Apply the main class for the entire table
};
