import axios from "axios";

export const httpClient = axios.create({
  timeout: 5000
});

httpClient.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(
      new Error(`HTTP Error: ${error.response?.status || "UNKNOWN"}`)
    );
  }
);