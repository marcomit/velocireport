import pdf from "../../src/html";
import data from "./data.json";

export default async () => {
  const scontrini = data["scontrini"];
  return pdf.table(
    pdf.thead(pdf.tr(pdf.th("ID"), pdf.th("stato"))),
    pdf.tbody(
      ...scontrini.map((scontrino) =>
        pdf.tr(pdf.td(scontrino._id), pdf.td(scontrino.stato))
      )
    )
  );
};
