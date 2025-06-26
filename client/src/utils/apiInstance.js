// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Automatically attach token from Redux or localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // or get from Redux if you're storing there

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
