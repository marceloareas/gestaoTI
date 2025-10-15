import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
});


api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err?.response || err);
    return Promise.reject(err);
  }
);