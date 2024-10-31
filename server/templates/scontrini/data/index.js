import { join } from "path";
import format from "../../hidden";
export async function getProvaCsv() {
  return await format.txt(join(__dirname, "raw-provaCsv.txt"));
}
export async function getProvaTsv() {
  return await format.get(join(__dirname, "fetch-provaTsv"));
}
export async function getScontriniData() {
  return await format.json(join(__dirname, "raw-scontriniData.json"));
}
