import fs from "fs";
import * as path from "path";

const unsync = (_file: string) => {
  try {
    if (fs.existsSync(_file)) {
      fs.unlinkSync(_file);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("🔥 Delete error:", error);
    throw error;
  }
};

export const unsyncFromPublic = (_file: string) => {
  // remove leading slash if exists
  const cleanPath = _file.replace(/^\/+/, "");
  // remove "public/" if already included
  const relativePath = cleanPath.startsWith("public/")
    ? cleanPath.replace("public/", "")
    : cleanPath;
  const fullPath = path.join(process.cwd(), "public", relativePath);
  return unsync(fullPath);
};

export default unsync;