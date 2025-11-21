"use server";

import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = "https://kb8334ks-3000.asse.devtunnels.ms";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      cookies().then((c) => c.delete("auth-token"));
    }
    return Promise.reject(error);
  },
);

export default api;
