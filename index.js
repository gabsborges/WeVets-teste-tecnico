import { generateReport } from "./src/application/generateReport.js";
import { writeJsonFile } from "./src/infra/file/fileWriter.js";
import { logger } from "./src/utils/logger.js";

async function main() {
  try {
    logger.info("Starting report generation...");

    const data = await generateReport();

    await writeJsonFile("./output/data.json", data);

    logger.info("Report generated successfully.");
  } catch (error) {
    logger.error("Fatal error", error);
    process.exit(1);
  }
}

main();