import pLimit from "p-limit";
import { userCepMap } from "../config/constants.js";
import { fetchCepData } from "../infra/repositories/cepService.js";


export async function processPosts(posts, users) {
  const userMap = new Map(users.map(user => [user.id, user]));

    const limit = pLimit(5);

  const processed = await Promise.all(
  posts.map(post =>
    limit(async () => {
      const author = userMap.get(post.userId);
      const cep = userCepMap[author.id];

      const { city, state } = await fetchCepData(cep);

      return {
        postId: post.id,
        title: post.title,
        authorName: author.name,
        authorEmail: author.email,
        cep,
        city,
        state
      };
    }))
  );

  return processed;
}