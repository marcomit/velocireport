import { join } from 'path';
import format from '../../hidden';
export const getFattureData = async () =>
  await format.json(join(__dirname, 'fattureData'));
