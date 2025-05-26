import * as fs from "fs";
import * as path from "path";
import { generateUlid } from "./index";

export const saveImageToDisk = async (
  base64File: string,
  originalFileName: string,
): Promise<string> => {
  const matches = base64File.match(/^data:.+;base64,(.*)$/);
  const base64Data = matches ? matches[1] : base64File;

  const buffer = Buffer.from(base64Data, "base64");

  const ext = originalFileName.split(".").pop();
  const filename = `${generateUlid()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public/assets/images");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fullPath = path.join(uploadDir, filename);
  fs.writeFileSync(fullPath, buffer);

  return `/assets/images/${filename}`;
};
