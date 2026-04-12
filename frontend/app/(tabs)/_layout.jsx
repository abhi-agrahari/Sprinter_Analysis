import React from 'react';
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function TabLayout() {
    const { colors, isDarkMode } = useTheme();

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: colors.tabBar,
                borderTopColor: colors.border,
                height: 70,
                elevation: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                borderTopWidth: 1,
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.tabBarInactive,
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons 
                            name={focused ? 'home' : 'home-outline'} 
                            size={26} 
                            color={color} 
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons 
                            name={focused ? 'time' : 'time-outline'} 
                            size={26} 
                            color={color} 
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons 
                            name={focused ? 'person' : 'person-outline'} 
                            size={26} 
                            color={color} 
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
