import { join } from "path";
import { format } from "../../hidden";
export const getProvaCsv = async () =>
  await format.txt(join(__dirname, "raw-provaCsv.txt"));
