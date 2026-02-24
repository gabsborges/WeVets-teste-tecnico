import { fetchPosts } from "../infra/repositories/postApi.js";
import { fetchUsers } from "../infra/repositories/userApi.js";
import { enrichPosts } from "../domain/post/postEnricher.js";

export async function generateReport() {
  const [posts, users] = await Promise.all([
    fetchPosts(),
    fetchUsers()
  ]);

  return enrichPosts(posts, users);
}