import path from "path";
import format from "../../hidden";
export const getProvaCsv = async () =>
  await format.csv(path.join(__dirname, "raw-provaTsv.csv"));
