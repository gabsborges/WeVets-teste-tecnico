import { API_ENDPOINTS } from "../../config/constants.js";
import { httpClient } from "../http/httpClient.js";

export async function fetchUsers() {
  const { data } = await httpClient.get(API_ENDPOINTS.USERS);
  return data;
}