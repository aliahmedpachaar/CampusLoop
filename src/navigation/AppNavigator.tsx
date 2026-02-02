/**
 * CampusLoop App Navigator
 * Main navigation structure
 */

import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useCampusLoopAuth } from '../context/AuthContext';
import { useCampusLoopTheme } from '../context/ThemeContext';

// Auth Screens
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';

// Main Screens
import { HomeScreen } from '../screens/home/HomeScreen';
import { ActivitiesScreen } from '../screens/activities/ActivitiesScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

// New Screens
import { CreatePostScreen } from '../screens/post/CreatePostScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for authenticated users
const MainTabs = () => {
    const { colors } = useCampusLoopTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textTertiary,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                },
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Feed',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏠</Text>,
                }}
            />
            <Tab.Screen
                name="Activities"
                component={ActivitiesScreen}
                options={{
                    tabBarLabel: 'Activities',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🎯</Text>,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>👤</Text>,
                }}
            />
        </Tab.Navigator>
    );
};

// Authenticated Stack containing Tabs + Modal/Push Screens
const AuthenticatedStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </Stack.Navigator>
    );
};

// Auth Stack for unauthenticated users
const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
    );
};

// Root Navigator
export const AppNavigator = () => {
    const { state: authState } = useCampusLoopAuth();
    const { colors } = useCampusLoopTheme();

    if (authState.isLoading) {
        // Could show a splash screen here
        return null;
    }

    return (
        <NavigationContainer
            theme={{
                ...DefaultTheme,
                colors: {
                    ...DefaultTheme.colors,
                    primary: colors.primary,
                    background: colors.background,
                    card: colors.surface,
                    text: colors.text,
                    border: colors.border,
                    notification: colors.error,
                },
            }}>
            {authState.isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
        </NavigationContainer>
    );
};
