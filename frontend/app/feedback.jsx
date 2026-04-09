import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { api } from '../api';
import getStyles from '../styles/feedback.styles';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function FeedbackScreen() {
    const { colors, isDarkMode } = useTheme();
    const styles = getStyles(colors);
    const { stream_url, advice } = useLocalSearchParams();
    const router = useRouter();

    // Parse advice from params
    let adviceData = { good: [], improve: [], general: [] };

    try {
        if (advice) {
            const parsed = JSON.parse(advice);
            if (Array.isArray(parsed)) {
                adviceData.general = parsed;
            } else {
                adviceData = parsed;
            }
        }
    } catch (e) {
        console.log('Failed to parse advice:', e);
    }

    function goBack() {
        router.back();
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack} style={{ marginRight: 15 }}>
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.title}>Analysis Result</Text>
            </View>

            {/* Advice Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>💡 Coaching Advice</Text>

                {/* Good Points */}
                {adviceData.good && adviceData.good.length > 0 && (
                    <View style={styles.adviceGroup}>
                        <Text style={[styles.groupTitle, { color: '#4CAF50' }]}>✓ Good</Text>
                        {adviceData.good.map((item, index) => (
                            <View key={index} style={styles.adviceCard}>
                                <Text style={styles.adviceText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Improvements */}
                {adviceData.improve && adviceData.improve.length > 0 && (
                    <View style={styles.adviceGroup}>
                        <Text style={[styles.groupTitle, { color: '#FF9500' }]}>↑ To Improve</Text>
                        {adviceData.improve.map((item, index) => (
                            <View key={index} style={styles.adviceCard}>
                                <Text style={styles.adviceText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                )}

            </View>

            {/* Video Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎬 Processed Replay</Text>

                {stream_url ? (
                    <Video
                        source={{ uri: stream_url }}
                        style={styles.video}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping={true}
                        shouldPlay={true}
                    />
                ) : (
                    <View style={styles.videoPlaceholder}>
                        <Text style={styles.placeholderText}>No video available</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
