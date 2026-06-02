import fs from "fs";
import * as path from "path";

const unsync = (_file: string) => {
  try {
    if (fs.existsSync(_file)) {
      fs.unlinkSync(_file);
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
};

export const unsyncFromPublic = (_file: string) => {
  // Always resolve relative to project root

  return unsync(path.resolve("public/", _file));
};
export default unsync;
