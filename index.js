import { fetchPosts } from "./src/services/postService.js";
import { fetchUsers } from "./src/services/userService.js";
import { processPosts } from "./src/processors/postProcessor.js";
import { writeJsonFile } from "./src/infra/fileWriter.js";
import { logger } from "./src/utils/logger.js";

async function main() {
  try {
    logger.info("Starting data aggregation process...");

    const [posts, users] = await Promise.all([
      fetchPosts(),
      fetchUsers()
    ]);

    const processed = await processPosts(posts, users);

    await writeJsonFile("./output/data.json", processed);

    logger.info("Process finished successfully.");
  } catch (error) {
    logger.error("Fatal error during execution", error);
    process.exit(1);
  }
}

main();