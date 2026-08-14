import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL =
    process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 120000,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');

        console.log('========== API REQUEST ==========');
        console.log('URL:', config.baseURL + config.url);
        console.log('TOKEN EXISTS:', !!token);

        if (token) {
            console.log('TOKEN:', token.substring(0, 20) + '...');

            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(
            'AUTH HEADER:',
            config.headers?.Authorization
                ? 'Bearer token attached'
                : 'NOT ATTACHED'
        );

        console.log('=================================');

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
        return axiosInstance.post('/api/analyze', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    getHistory: () => {
        return axiosInstance.get('/api/history');
    },
};