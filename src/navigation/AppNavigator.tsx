/**
 * CampusLoop App Navigator
 * Main navigation structure
 */

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useCampusLoopAuth } from '../context/AuthContext';
import { useCampusLoopTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Auth Screens
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import { HomeScreen } from '../screens/home/HomeScreen';
import { ActivitiesScreen } from '../screens/activities/ActivitiesScreen';
import { CreateActivityScreen } from '../screens/activities/CreateActivityScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Custom Tab Bar Icon
const TabIcon = ({ focused, icon, color }: { focused: boolean; icon: string; color: string }) => {
    return (
        <View style={styles.tabIconContainer}>
            <Ionicons name={icon as any} size={24} color={color} />
            {focused && <View style={[styles.tabIndicator, { backgroundColor: color }]} />}
        </View>
    );
};

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
                    height: 85,
                    paddingTop: 8,
                    paddingBottom: 28,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: 4,
                },
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused} icon={focused ? 'home' : 'home-outline'} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Activities"
                component={ActivitiesScreen}
                options={{
                    tabBarLabel: 'Activities',
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused} icon={focused ? 'people' : 'people-outline'} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused} icon={focused ? 'person' : 'person-outline'} color={color} />
                    ),
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
            <Stack.Screen
                name="CreateActivity"
                component={CreateActivityScreen}
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </Stack.Navigator>
    );
};

// Auth Stack for unauthenticated users
const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
};

// Root Navigator
export const AppNavigator = () => {
    const { state: authState } = useCampusLoopAuth();
    const { colors } = useCampusLoopTheme();

    if (authState.isLoading) {
        // Splash screen
        return (
            <View style={[styles.splashContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.splashEmoji}>🎓</Text>
                <Text style={[styles.splashText, { color: colors.text }]}>CampusLoop</Text>
            </View>
        );
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

const styles = StyleSheet.create({
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginTop: 4,
    },
    splashContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    splashEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    splashText: {
        fontSize: 28,
        fontWeight: '700',
    },
});

export default AppNavigator;
