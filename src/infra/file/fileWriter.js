import fs from "fs/promises";
import path from "path";
import { logger } from "../../utils/logger.js";

export async function writeJsonFile(filePath, data) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    logger.info(`File written successfully: ${filePath}`);
  } catch (err) {
    logger.error(`Failed to write file: ${filePath}`, err);
    throw err;
  }
}