import { join } from "path";
import format from "../../hidden";
export const getVenditeData = async () =>
  await format.txt(join(__dirname, "raw-venditeData.txt"));
export const getScontriniData = async () =>
  await format.get(join(__dirname, "fetch-scontriniData"));
