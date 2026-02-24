import { httpClient } from "../http/httpClient.js";
import { API_ENDPOINTS } from "../../config/constants.js";

export async function fetchPosts() {
  const { data } = await httpClient.get(API_ENDPOINTS.POSTS);

  return data
    .sort((a, b) => b.id - a.id)
    .slice(0, 20);
}