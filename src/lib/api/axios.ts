import axios from 'axios';
import { useAuthStore } from '@/store/auth';

// Instance axios request client-side, atur baseURL dan header auth
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
