import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { api } from '../../api';
import getStyles from '../../styles/tabs/profile.styles';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function ProfileScreen() {
    const { colors, isDarkMode, toggleTheme } = useTheme();
    const styles = getStyles(colors);

    const [profile, setProfile] = useState({
        name: '',
        height: '',
        weight: '',
        gender: ''
    });
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    // Load profile when screen opens
    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        try {
            const response = await api.getProfile();
            const data = response.data;

            setProfile({
                name: data.name || '',
                height: data.height ? String(data.height) : '',
                weight: data.weight ? String(data.weight) : '',
                gender: data.gender || ''
            });
        } catch (error) {
            console.log('Error loading profile:', error);
        }
    }

    // Save profile changes
    async function saveProfile() {
        setSaving(true);
        try {
            await api.updateProfile({
                name: profile.name,
                height: profile.height ? Number(profile.height) : null,
                weight: profile.weight ? Number(profile.weight) : null,
                gender: profile.gender
            });

            // Update stored user name
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                user.name = profile.name;
                await AsyncStorage.setItem('user', JSON.stringify(user));
            }

            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    }

    // Logout
    async function logout() {
        await AsyncStorage.clear();
        router.replace('/auth/login');
    }

    // Update profile field
    function updateField(field, value) {
        setProfile({
            ...profile,
            [field]: value
        });
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
            <View style={styles.header}>
                <Ionicons name="person-circle" size={80} color={colors.primary} />
                <Text style={styles.title}>Athlete Profile</Text>
            </View>

            <View style={styles.form}>
                {/* Name Input */}
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="person" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        value={profile.name}
                        onChangeText={(text) => updateField('name', text)}
                        placeholder="Enter your name"
                        placeholderTextColor={colors.textSecondary}
                    />
                </View>

                {/* Height and Weight Row */}
                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Height (cm)</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="pencil" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={profile.height}
                                onChangeText={(text) => updateField('height', text)}
                                placeholder="Height"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Weight (kg)</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="fitness" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={profile.weight}
                                onChangeText={(text) => updateField('weight', text)}
                                placeholder="Weight"
                                placeholderTextColor={colors.textSecondary}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>

                {/* Gender Selection */}
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderContainer}>
                    {['Male', 'Female'].map((gender) => (
                        <TouchableOpacity
                            key={gender}
                            style={[
                                styles.genderButton,
                                profile.gender === gender && styles.genderButtonActive
                            ]}
                            onPress={() => updateField('gender', gender)}
                        >
                            <Text style={[
                                styles.genderText,
                                profile.gender === gender && styles.genderTextActive
                            ]}>
                                {gender}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Theme Selection */}
                <Text style={styles.label}>App Theme</Text>
                <TouchableOpacity style={styles.themeSection} onPress={toggleTheme}>
                    <Text style={styles.themeLabel}>Appearance</Text>
                    <View style={styles.themeToggle}>
                        <Ionicons
                            name={isDarkMode ? 'moon' : 'sunny'}
                            size={20}
                            color={colors.primary}
                        />
                        <Text style={styles.themeToggleText}>
                            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Save Button */}
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveProfile}
                    disabled={saving}
                >
                    <Text style={styles.saveButtonText}>
                        {saving ? 'Saving...' : 'UPDATE PROFILE'}
                    </Text>
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Ionicons name="power" size={18} color={colors.error} style={{ marginRight: 8 }} />
                    <Text style={styles.logoutButtonText}>LOGOUT</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

