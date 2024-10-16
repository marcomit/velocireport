import path from "path";
import format from "../../hidden";
export const getProvaCsv = async () =>
  await format.csv(path.join(__dirname, "raw-provaTsv.csv"));
export const getScontriniData = async () => await format.txt("raw-scontriniData.txt")export const getScontriniData = async () => await format.json("raw-scontriniData.json")