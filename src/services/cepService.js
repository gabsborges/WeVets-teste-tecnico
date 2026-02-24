import { httpClient } from "../infra/httpClient.js";
import { API_ENDPOINTS } from "../config/constants.js";
import { logger } from "../utils/logger.js";

export async function fetchCepData(cep) {
  try {
    const { data } = await httpClient.get(API_ENDPOINTS.VIA_CEP(cep));

    if (data.erro) {
      return { city: null, state: null };
    }

    return {
      city: data.localidade,
      state: data.uf
    };
  } catch (error) {
    logger.warn(`Failed to fetch CEP ${cep}`);
    return { city: null, state: null };
  }
}