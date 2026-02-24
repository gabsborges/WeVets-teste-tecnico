import { userCepMap } from "../../config/constants.js";
import { fetchCepData } from "../../infra/repositories/cepApi.js";
import { logger } from "../../utils/logger.js";

const CONCURRENCY_LIMIT = 5;

async function asyncPool(limit, array, iteratorFn) {
  const results = [];
  const executing = [];

  for (const item of array) {
    const p = iteratorFn(item);
    results.push(p);

    const e = p.finally(() => executing.splice(executing.indexOf(e), 1));
    executing.push(e);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.allSettled(results);
}

function buildPostOutput(post, author, cep, address) {
  return {
    postId: post.id,
    title: post.title,
    authorName: author.name,
    authorEmail: author.email,
    cep,
    city: address.city,
    state: address.state
  };
}

/**
 * @param {Array<any>} posts
 * @param {Array<any>} users
 */
export async function enrichPosts(posts, users) {
  const userMap = new Map(users.map(u => [u.id, u]));

  const settledResults = await asyncPool(CONCURRENCY_LIMIT, posts, async (post) => {
    if (!post?.id || !post?.userId) return null;

    const author = userMap.get(post.userId);
    if (!author?.name || !author?.email) return null;

    const cep = userCepMap[author.id];
    if (!cep) return null;

    let address = { city: null, state: null };
    try {
      address = await fetchCepData(cep);
    } catch (err) {
      logger.warn(`Failed to fetch CEP for user ${author.id}: ${cep}`);
    }

    return buildPostOutput(post, author, cep, address);
  });

  return settledResults
    .filter(r => r.status === "fulfilled" && r.value)
    .map(r => r.value);
}