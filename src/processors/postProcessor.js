import { userCepMap } from "../config/constants";
import { fetchCepData } from "../services/cepService";


export async function processPosts(posts, users) {
  const userMap = new Map(users.map(user => [user.id, user]));

  const processed = await Promise.all(
    posts.map(async (post) => {
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
    })
  );

  return processed;
}