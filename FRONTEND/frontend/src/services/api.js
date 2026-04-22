// ============================================================
// FILE: src/services/api.js
// ============================================================

import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

// const api = axios.create({ baseURL: API_BASE_URL });

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/customer/login";
    }
    return Promise.reject(err);
  }
);

export default api;