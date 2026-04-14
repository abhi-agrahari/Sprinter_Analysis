import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../api';
import getStyles from '../../styles/tabs/history.styles';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function HistoryScreen() {
    const { colors, isDarkMode } = useTheme();
    const styles = getStyles(colors);
    const [history, setHistory] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    // Load history when screen opens
    useEffect(() => {
        fetchHistory();
    }, []);

    async function fetchHistory() {
        try {
            const response = await api.getHistory();
            setHistory(response.data || []);
        } catch (error) {
            console.log('Error fetching history:', error);
        }
    }

    // Pull to refresh
    async function onRefresh() {
        setRefreshing(true);
        await fetchHistory();
        setRefreshing(false);
    }

    // Format advice for display
    function formatAdvice(rawAdvice) {
        if (!rawAdvice) return "No advice available";

        let advice = rawAdvice;

        // If it's a string, try to parse it
        if (typeof advice === 'string') {
            try {
                // Python dicts use single quotes, replace with double for JSON
                advice = JSON.parse(advice.replace(/'/g, '"'));
            } catch (e) {
                return String(advice).substring(0, 80) + '...';
            }
        }

        // Handle array format
        if (Array.isArray(advice)) {
            return advice.slice(0, 2).join(' • ');
        }

        // Handle object format {good: [], improve: []}
        if (typeof advice === 'object') {
            const parts = [];
            if (advice.good && advice.good.length > 0) {
                parts.push('✓ ' + advice.good[0]);
            }
            if (advice.improve && advice.improve.length > 0) {
                parts.push('↑ ' + advice.improve[0]);
            }
            return parts.join('\n') || "Analysis complete";
        }

        return String(advice);
    }

    // Format date for display
    function formatDate(dateStr) {
        if (!dateStr) return null;
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch (e) {
            return dateStr;
        }
    }

    // Open a history item
    function openItem(item) {
        // Parse advice string back to object for the feedback screen
        let adviceObj = item.advice;
        if (typeof adviceObj === 'string') {
            try {
                adviceObj = JSON.parse(adviceObj.replace(/'/g, '"'));
            } catch (e) {
                adviceObj = { good: [], improve: [String(item.advice)] };
            }
        }

        router.push({
            pathname: '/feedback',
            params: {
                stream_url: item.video_url,
                advice: JSON.stringify(adviceObj),
            },
        });
    }

    // Render each history item
    function renderItem({ item, index }) {
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => openItem(item)}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.dateContainer}>
                        <Ionicons name="sparkles" size={16} color={colors.primary} />
                        <Text style={styles.dateText}>
                            {formatDate(item.created_at) || `Analysis #${index + 1}`}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
                </View>
                <Text style={styles.adviceText} numberOfLines={2}>
                    {formatAdvice(item.advice)}
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sprint History</Text>

            <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={[styles.list, { paddingBottom: 100 }]}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="search-outline" size={50} color={colors.border} />
                        <Text style={styles.emptyText}>
                            No analysis history found.{'\n'}
                            Analyze your first sprint!
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

