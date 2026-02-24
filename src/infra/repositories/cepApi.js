import { API_ENDPOINTS } from "../../config/constants.js";
import { httpClient } from "../http/httpClient.js";

const cepCache = new Map();

export async function fetchCepData(cep) {
  if (cepCache.has(cep)) return cepCache.get(cep);

  try {
    const { data } = await httpClient.get(API_ENDPOINTS.VIA_CEP(cep));

    const result = data.erro
      ? { city: null, state: null }
      : { city: data.localidade, state: data.uf };

    cepCache.set(cep, result);
    return result;

  } catch {
    const fallback = { city: null, state: null };
    cepCache.set(cep, fallback);
    return fallback;
  }
}