import axios from "axios";

const rawBaseUrl = (import.meta.env.VITE_API_URL || "").trim();
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "").replace(/\/api$/, "");

const api = axios.create({
  baseURL: normalizedBaseUrl,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("adminToken");
      window.dispatchEvent(new Event("authChange"));

      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
