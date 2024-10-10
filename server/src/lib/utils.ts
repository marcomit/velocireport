import { access } from "fs/promises";
async function exists(path: string) {
  try {
    await access(path);
    return true;
  } catch (e) {
    return false;
  }
}

export { exists };
