import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

    useEffect(() => {
        loadTheme();
    }, []);

    async function loadTheme() {
        try {
            const savedTheme = await AsyncStorage.getItem('user-theme');
            if (savedTheme !== null) {
                setIsDarkMode(savedTheme === 'dark');
            }
        } catch (error) {
            console.log('Error loading theme:', error);
        }
    }

    async function toggleTheme() {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        try {
            await AsyncStorage.setItem('user-theme', newMode ? 'dark' : 'light');
        } catch (error) {
            console.log('Error saving theme:', error);
        }
    }

    const theme = {
        isDarkMode,
        toggleTheme,
        colors: isDarkMode ? darkColors : lightColors
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

const darkColors = {
    background: '#000000',
    card: '#1c1c1e',
    text: '#ffffff',
    textSecondary: '#aaaaaa',
    primary: '#007AFF',
    border: '#333333',
    tabBar: '#000000',
    tabBarInactive: '#8E8E93',
    error: '#ff3b30',
    success: '#4CAF50',
    buttonBackground: '#007AFF',
    buttonText: '#ffffff'
};

const lightColors = {
    background: '#f2f2f7',
    card: '#ffffff',
    text: '#000000',
    textSecondary: '#8E8E93',
    primary: '#007AFF',
    border: '#C6C6C8',
    tabBar: '#ffffff',
    tabBarInactive: '#8E8E93',
    error: '#ff3b30',
    success: '#4CAF50',
    buttonBackground: '#007AFF',
    buttonText: '#ffffff'
};
