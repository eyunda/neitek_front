import axios from 'axios';
import { getAuth } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

// Agrega automáticamente el token
api.interceptors.request.use((config) => {
  const auth = getAuth();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export default api;
