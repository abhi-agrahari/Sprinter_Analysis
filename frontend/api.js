import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'https://sprinter-analysis-backend.onrender.com';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 120000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const api = {
  login: (data) => {
    return axiosInstance.post('/api/login', data);
  },

  signup: (data) => {
    return axiosInstance.post('/api/signup', data);
  },

  forgotPassword: (data) => {
    return axiosInstance.post('/api/forgot_password', data);
  },

  getProfile: () => {
    return axiosInstance.get('/api/profile');
  },

  updateProfile: (data) => {
    return axiosInstance.put('/api/profile', data);
  },

  analyze: (formData) => {
    return axiosInstance.post('/api/analyze', formData);
  },

  getHistory: () => {
    return axiosInstance.get('/api/history');
  },
};