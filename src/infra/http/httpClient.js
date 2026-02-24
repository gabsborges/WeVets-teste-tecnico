import axios from "axios";

export const httpClient = axios.create({
  timeout: 5000
});

httpClient.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const message = error.message;

    return Promise.reject(
      new Error(`HTTP Error ${status || ""} - ${message}`)
    );
  }
);