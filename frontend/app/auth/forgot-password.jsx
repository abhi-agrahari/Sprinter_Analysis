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
import { api } from '../../api';
import getStyles from '../../styles/auth/forgot-password.styles';
import { useTheme } from '../../context/ThemeContext';

export default function ForgotPasswordScreen() {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    const [email, setEmail] = useState('');
    const router = useRouter();

    async function handleReset() {
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        try {
            const response = await api.forgotPassword({ email });
            Alert.alert('Reset Link Sent', response.data.message || 'Check your email');
            router.replace('/auth/login');
        } catch (error) {
            const message = error.response?.data?.message || 'Please check your email address';
            Alert.alert('Error', message);
        }
    }

    function goBack() {
        router.back();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter your email to receive a recovery link</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TouchableOpacity style={styles.button} onPress={handleReset}>
                <Text style={styles.buttonText}>Send Link</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={goBack}>
                <Text style={styles.backText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}

