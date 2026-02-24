import { fetchPosts } from "../infra/repositories/postApi.js";
import { fetchUsers } from "../infra/repositories/userApi.js";
import { enrichPosts } from "../domain/post/postEnricher.js";
import { logger } from "../utils/logger.js";

export async function generateReport() {
  try {
    logger.info("Fetching posts and users...");

    const [posts, users] = await Promise.all([
      fetchPosts(),
      fetchUsers()
    ]);

    logger.info(`Posts fetched: ${posts.length}`);
    logger.info(`Users fetched: ${users.length}`);

    const result = await enrichPosts(posts, users);

    logger.info(`Report items generated: ${result.length}`);

    return result;
  } catch (error) {
    logger.error("Failed to generate report", error);
    throw error;
  }
}