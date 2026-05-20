/**
 * CampusLoop App Navigator
 */

import React from 'react';
import { Text, View, StyleSheet, Image, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useCampusLoopAuth } from '../context/AuthContext';
import { useCampusLoopTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// Auth Screens
import { WelcomeScreen }        from '../screens/auth/WelcomeScreen';
import { SignupScreen }         from '../screens/auth/SignupScreen';
import { LoginScreen }          from '../screens/auth/LoginScreen';
import { VerifyEmailScreen }    from '../screens/auth/VerifyEmailScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen }  from '../screens/auth/ResetPasswordScreen';
import { ProfileSetupScreen }   from '../screens/auth/ProfileSetupScreen';

// Main Screens
import { HomeScreen }           from '../screens/home/HomeScreen';
import { ActivitiesScreen }     from '../screens/activities/ActivitiesScreen';
import { CreateActivityScreen }  from '../screens/activities/CreateActivityScreen';
import { ActivityChatScreen }    from '../screens/activities/ActivityChatScreen';
import { ActivityDetailScreen }  from '../screens/activities/ActivityDetailScreen';
import { CreatePostScreen }     from '../screens/post/CreatePostScreen';
import { ProfileScreen }        from '../screens/profile/ProfileScreen';
import NotificationsScreen      from '../screens/notifications/NotificationsScreen';
import { EditProfileScreen }    from '../screens/profile/EditProfileScreen';
import { SearchScreen }         from '../screens/search/SearchScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const TabIcon = ({ focused, icon, color }: { focused: boolean; icon: string; color: string }) => (
    <View style={styles.tabIconContainer}>
        <Ionicons name={icon as any} size={24} color={color} />
        {focused && <View style={[styles.tabIndicator, { backgroundColor: color }]} />}
    </View>
);

const MainTabs = () => {
    const { colors } = useCampusLoopTheme();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor:   colors.primary,
                tabBarInactiveTintColor: colors.textTertiary,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor:  colors.border,
                    borderTopWidth:  1,
                    height:          Platform.OS === 'web' ? 60 : 85,
                    paddingTop:      8,
                    paddingBottom:   Platform.OS === 'web' ? 8 : 28,
                },
                tabBarLabelStyle: { fontSize: 12, fontWeight: '500', marginTop: 4 },
            }}>
            <Tab.Screen name="Home" component={HomeScreen}
                options={{ tabBarLabel: 'Home', tabBarIcon: ({ focused, color }) => <TabIcon focused={focused} icon={focused ? 'home' : 'home-outline'} color={color} /> }} />
            <Tab.Screen name="Activities" component={ActivitiesScreen}
                options={{ tabBarLabel: 'Activities', tabBarIcon: ({ focused, color }) => <TabIcon focused={focused} icon={focused ? 'people' : 'people-outline'} color={color} /> }} />
            <Tab.Screen name="Search" component={SearchScreen}
                options={{ tabBarLabel: 'Search', tabBarIcon: ({ focused, color }) => <TabIcon focused={focused} icon={focused ? 'search' : 'search-outline'} color={color} /> }} />
            <Tab.Screen name="Profile" component={ProfileScreen}
                options={{ tabBarLabel: 'Profile', tabBarIcon: ({ focused, color }) => <TabIcon focused={focused} icon={focused ? 'person' : 'person-outline'} color={color} /> }} />
        </Tab.Navigator>
    );
};

const AuthenticatedStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="CreateActivity" component={CreateActivityScreen}
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="ActivityDetail"  component={ActivityDetailScreen}
            options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="ActivityChat"   component={ActivityChatScreen}
            options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="CreatePost"     component={CreatePostScreen}
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Notifications"  component={NotificationsScreen} />
        <Stack.Screen name="EditProfile"    component={EditProfileScreen} />
    </Stack.Navigator>
);

// Shown when token is valid but profileComplete = false (e.g. app restart mid-setup)
const ProfileSetupOnlyStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
);

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Welcome"       component={WelcomeScreen} />
        <Stack.Screen name="Signup"        component={SignupScreen} />
        <Stack.Screen name="Login"         component={LoginScreen} />
        <Stack.Screen name="VerifyOTP"     component={VerifyEmailScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="ProfileSetup"  component={ProfileSetupScreen} />
    </Stack.Navigator>
);

export const AppNavigator = () => {
    const { state: authState } = useCampusLoopAuth();
    const { colors } = useCampusLoopTheme();

    if (authState.isLoading) {
        return (
            <View style={[styles.splashContainer, { backgroundColor: colors.background }]}>
                <Image source={require('../assets/images/logo.png')} style={styles.splashLogo} resizeMode="contain" />
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
                    primary:      colors.primary,
                    background:   colors.background,
                    card:         colors.surface,
                    text:         colors.text,
                    border:       colors.border,
                    notification: colors.error,
                },
            }}>
            {authState.isAuthenticated
                ? <AuthenticatedStack />
                : authState.needsProfileSetup
                    ? <ProfileSetupOnlyStack />
                    : <AuthStack />}
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabIconContainer: { alignItems: 'center', justifyContent: 'center' },
    tabIndicator:     { width: 4, height: 4, borderRadius: 2, marginTop: 4 },
    splashContainer:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
    splashLogo:       { width: 120, height: 120 },
    splashText:       { fontSize: 28, fontWeight: '700', marginTop: 16 },
});

export default AppNavigator;
