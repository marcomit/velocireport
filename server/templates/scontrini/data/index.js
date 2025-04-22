import { join } from "path";
import format from "../../hidden";
export const getScontriniData = async () => await format.json(join(__dirname, "scontriniData"));
