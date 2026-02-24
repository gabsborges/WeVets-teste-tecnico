import { userCepMap } from "../../config/constants.js";
import { fetchCepData } from "../../infra/repositories/cepApi.js";

const CONCURRENCY_LIMIT = 5;

/**
 * @typedef {Object} PostOutput
 * @property {number} postId
 * @property {string} title
 * @property {string} authorName
 * @property {string} authorEmail
 * @property {string} cep
 * @property {string|null} city
 * @property {string|null} state
 */

async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = [];
  const executing = [];

  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);

    const e = p.then(() => {
      executing.splice(executing.indexOf(e), 1);
    });

    executing.push(e);

    if (executing.length >= poolLimit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(ret);
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
 * @returns {Promise<PostOutput[]>}
 */
export async function enrichPosts(posts, users) {
  const userMap = new Map(users.map(u => [u.id, u]));

  const results = await asyncPool(CONCURRENCY_LIMIT, posts, async (post) => {
    if (!post || !post.id || !post.userId) return null;

    const author = userMap.get(post.userId);
    if (!author || !author.email || !author.name) return null;

    const cep = userCepMap[author.id];
    if (!cep) return null;

    let address = { city: null, state: null };

    try {
      address = await fetchCepData(cep);
    } catch {

    }

    return buildPostOutput(post, author, cep, address);
  });

  return results.filter(Boolean);
}