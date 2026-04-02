import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
    return (
        <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="auth" />
                <Stack.Screen name="feedback" />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}