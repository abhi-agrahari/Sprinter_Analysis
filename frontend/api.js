import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { router } from 'expo-router';

// get the API base URL based on platform
function getApiBase() {
  let hostIP = '127.0.0.1';

  // try to get IP from Expo config
  const debuggerHost = Constants.expoConfig?.hostUri;

  if (debuggerHost) {
    hostIP = debuggerHost.split(':')[0];
  } else if (Platform.OS === 'android') {
    hostIP = '10.0.2.2';
  }

  return `http://${hostIP}:5000/api`;
}

const API_BASE = process.env.EXPO_PUBLIC_API_URL || getApiBase();

// create axios instance
const backend = axios.create({
  baseURL: API_BASE,
});

// add token to requests
backend.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

backend.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      AsyncStorage.removeItem('token');
      router.replace('/auth/login');
    }
    return Promise.reject(error);
  }
);

// API functions
export const api = {
  // Auth
  login: (data) => backend.post('/login', data),
  signup: (data) => backend.post('/signup', data),
  forgotPassword: (data) => backend.post('/forgot_password', data),

  // Profile
  getProfile: () => backend.get('/profile'),
  updateProfile: (data) => backend.put('/profile', data),

  // Analysis
  analyze: (formData) => backend.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getHistory: () => backend.get('/history'),
};
