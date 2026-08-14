import { Platform } from 'react-native';
import React, { useEffect } from 'react';

import { Redirect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        checkLogin();
    }, []);

    async function checkLogin() {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            router.replace('/(tabs)');
        } else {
            router.replace('/auth/login');
        }
    }

    return null;
}