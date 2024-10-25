import { join } from "path";
import format from "../../hidden";
export const getProvaCsv = async () =>
  await format.txt(join(__dirname, "raw-provaCsv.txt"));
export const getProvaTsv = async () =>
  await format.get(join(__dirname, "fetch-provaTsv"));
export const getScontriniData = async () =>
  await format.txt(join(__dirname, "raw-scontriniData.txt"));
