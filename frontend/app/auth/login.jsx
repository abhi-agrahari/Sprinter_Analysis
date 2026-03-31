import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../api';
import getStyles from '../../styles/auth/login.styles';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function LoginScreen() {
    const { colors, isDarkMode } = useTheme();
    const styles = getStyles(colors);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    async function handleLogin() {
        // Basic validation
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        try {
            const response = await api.login({ email, password });

            // Save token and user data
            await AsyncStorage.setItem('token', response.data.token);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

            // Go to main app
            router.replace('/(tabs)');
        } catch (error) {
            Alert.alert('Login Failed', 'Invalid email or password');
        }
    }

    function goToSignup() {
        router.push('/auth/signup');
    }

    function goToForgotPassword() {
        router.push('/auth/forgot-password');
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="fitness" size={60} color={colors.primary} />
                <Text style={styles.title}>Sprinter Analysis</Text>
                <Text style={styles.subtitle}>Sign in to continue your analysis</Text>
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="mail" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity onPress={goToForgotPassword} style={styles.forgotButton}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={goToSignup} style={styles.signupButton}>
                <Text style={styles.signupText}>
                    Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}