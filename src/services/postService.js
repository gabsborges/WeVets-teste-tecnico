import { API_ENDPOINTS } from "../config/constants";
import { httpClient } from "../infra/httpClient";


export async function fetchPosts() {
  const { data } = await httpClient.get(API_ENDPOINTS.POSTS);

  return data
    .sort((a, b) => b.id - a.id)
    .slice(0, 20);
}