import { join } from 'path';
import format from '../../hidden';
export const getScontriniData = async () =>
  await format.json(join(__dirname, 'scontriniData'));
export const scontriniData2 = async () => await format.json(join(__dirname, "scontriniData2"));
