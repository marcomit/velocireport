import { table, tbody, td, th, thead, tr } from "../../src/html";
import data from "./data.json";

export default async () => {
  const scontrini = data["scontrini"];
  return table(
    thead(tr(th("ID"), th("stato"))),
    tbody(
      ...scontrini.map((scontrino) =>
        tr(td(scontrino._id), td(scontrino.stato))
      )
    )
  );
};
