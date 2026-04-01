import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../api';
import styles from '../../styles/auth/signup.styles';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        height: '',
        weight: '',
        gender: 'Male'
    });
    const router = useRouter();

    function updateField(field, value) {
        setForm({
            ...form,
            [field]: value
        });
    }

    async function handleSignup() {
        // Basic validation
        if (!form.name || !form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            await api.signup(form);
            Alert.alert('Success', 'Account created! Please login.');
            router.replace('/auth/login');
        } catch (error) {
            const message = error.response?.data?.message || 'Something went wrong';
            Alert.alert('Signup Failed', message);
        }
    }

    function goToLogin() {
        router.push('/auth/login');
    }

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Track your sprint performance with AI</Text>

            <View style={styles.inputContainer}>
                <Ionicons name="person" size={18} color="#666" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#666"
                    value={form.name}
                    onChangeText={(text) => updateField('name', text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="mail" size={18} color="#666" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#666"
                    value={form.email}
                    onChangeText={(text) => updateField('email', text)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={18} color="#666" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    value={form.password}
                    onChangeText={(text) => updateField('password', text)}
                    secureTextEntry
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfInput]}>
                    <Ionicons name="pencil" size={18} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Height"
                        placeholderTextColor="#666"
                        value={form.height}
                        onChangeText={(text) => updateField('height', text)}
                        keyboardType="numeric"
                    />
                </View>
                <View style={[styles.inputContainer, styles.halfInput]}>
                    <Ionicons name="fitness" size={18} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Weight"
                        placeholderTextColor="#666"
                        value={form.weight}
                        onChangeText={(text) => updateField('weight', text)}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
                {['Male', 'Female'].map((gender) => (
                    <TouchableOpacity
                        key={gender}
                        style={[
                            styles.genderButton,
                            form.gender === gender && styles.genderButtonActive
                        ]}
                        onPress={() => updateField('gender', gender)}
                    >
                        <Text style={[
                            styles.genderText,
                            form.gender === gender && styles.genderTextActive
                        ]}>
                            {gender}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={goToLogin}>
                <Text style={styles.loginText}>
                    Already have an account? <Text style={styles.loginLink}>Login</Text>
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

