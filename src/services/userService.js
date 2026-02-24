import { API_ENDPOINTS } from "../config/constants";
import { httpClient } from "../infra/httpClient";


export async function fetchUsers() {
  const { data } = await httpClient.get(API_ENDPOINTS.USERS);
  return data;
}