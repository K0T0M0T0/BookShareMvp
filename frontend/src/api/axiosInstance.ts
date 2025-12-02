import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
const SESSION_KEY = "mvp_session";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const storedSession = localStorage.getItem(SESSION_KEY);

  if (storedSession) {
    try {
      const { token } = JSON.parse(storedSession);
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore JSON errors; request proceeds without auth header
    }
  }

  return config;
});

export default apiClient;

