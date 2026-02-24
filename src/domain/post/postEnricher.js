import { userCepMap } from "../../config/constants.js";
import { fetchCepData } from "../../infra/repositories/cepApi.js";

const CONCURRENCY_LIMIT = 5;

async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = [];
  const executing = [];

  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);

    if (poolLimit <= array.length) {
      const e = p.then(() =>
        executing.splice(executing.indexOf(e), 1)
      );
      executing.push(e);
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(ret);
}

export async function enrichPosts(posts, users) {
  const userMap = new Map(users.map(u => [u.id, u]));

  return asyncPool(CONCURRENCY_LIMIT, posts, async (post) => {
    const author = userMap.get(post.userId);

    if (!author) return null;

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
  }).then(results => results.filter(Boolean));
}