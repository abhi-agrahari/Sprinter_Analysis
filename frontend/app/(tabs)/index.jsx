import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../api';
import getStyles from '../../styles/tabs/index.styles';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function HomeScreen() {
    const { colors, isDarkMode } = useTheme();
    const styles = getStyles(colors);

    // State variables
    const [userName, setUserName] = useState('Athlete');
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Load user data when screen opens
    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {
        try {
            const data = await AsyncStorage.getItem('user');
            if (data) {
                const user = JSON.parse(data);
                setUserName(user.name || 'Athlete');
            }
        } catch (error) {
            console.log('Error loading user:', error);
        }
    }

    // Pick video from gallery
    async function pickVideo() {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'We need access to your gallery to pick videos.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['videos'],
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                const sizeLimit = 100 * 1024 * 1024; // 100MB

                if (asset.fileSize && asset.fileSize > sizeLimit) {
                    Alert.alert('Video too large', 'Please upload a video smaller than 100MB.');
                    return;
                }
                setVideo(asset);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick video');
        }
    }

    // Send video to backend for analysis
    async function analyzeVideo() {
        if (!video) {
            Alert.alert('Error', 'Please select a video first');
            return;
        }

        setLoading(true);

        try {
            // Create form data
            const formData = new FormData();
            formData.append('file', {
                uri: video.uri,
                name: 'sprint_video.mp4',
                type: 'video/mp4',
            });

            // Send to API
            const response = await api.analyze(formData);

            // Go to feedback screen with results
            router.push({
                pathname: '/feedback',
                params: {
                    stream_url: response.data.stream_url,
                    advice: JSON.stringify(response.data.advice),
                },
            });
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'There was an error processing your video.';
            Alert.alert('Analysis Failed', errorMsg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.appTitle}>Sprinter Analysis</Text>
                <Text style={styles.greeting}>Hello, {userName} 👋</Text>
                <Text style={styles.subtitle}>
                    Upload your sprint video below to get AI biomechanics advice!
                </Text>
            </View>

            {/* Video Upload Box */}
            <TouchableOpacity style={styles.uploadBox} onPress={pickVideo}>
                {video ? (
                    <View style={styles.videoSelected}>
                        <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
                        <Text style={styles.videoText}>Video Selected!</Text>
                        <Text style={styles.videoName}>Ready to Analyze</Text>
                        <TouchableOpacity
                            style={styles.changeButton}
                            onPress={() => setVideo(null)}
                        >
                            <Text style={styles.changeText}>Change Video</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.pickVideo}>
                        <Ionicons name="videocam" size={60} color="#007AFF" />
                        <Text style={styles.pickerText}>Select Sprint Video</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* Size Limit Note */}
            <Text style={styles.limitNote}>
                ⚠️ Video size limit: 100MB{'\n'}
                Upload front view of your sprinting video
            </Text>

            {/* Analyze Button */}
            <TouchableOpacity
                style={[styles.analyzeButton, loading && styles.analyzeButtonDisabled]}
                onPress={analyzeVideo}
                disabled={loading}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator color={colors.buttonText} />
                        <Text style={styles.loadingText}>
                            Analyzing... This may take a minute
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.analyzeButtonText}>ANALYZE SPRINT</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

