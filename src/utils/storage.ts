/**
 * CampusLoop Storage Utilities
 * AsyncStorage wrapper for type-safe local storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    AUTH_TOKEN: '@CampusLoop:authToken',
    USER_DATA: '@CampusLoop:userData',
    THEME_MODE: '@CampusLoop:themeMode',
    LOCATION_SETTINGS: '@CampusLoop:locationSettings',
};

export const CampusLoopStorage = {
    /**
     * Save authentication token
     */
    saveAuthToken: async (token: string): Promise<void> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        } catch (error) {
            console.error('Error saving auth token:', error);
        }
    },

    /**
     * Get authentication token
     */
    getAuthToken: async (): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        } catch (error) {
            console.error('Error getting auth token:', error);
            return null;
        }
    },

    /**
     * Save user data
     */
    saveUserData: async (userData: any): Promise<void> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    },

    /**
     * Get user data
     */
    getUserData: async (): Promise<any | null> => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },

    /**
     * Save theme mode
     */
    saveThemeMode: async (isDark: boolean): Promise<void> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, JSON.stringify(isDark));
        } catch (error) {
            console.error('Error saving theme mode:', error);
        }
    },

    /**
     * Get theme mode
     */
    getThemeMode: async (): Promise<boolean> => {
        try {
            const mode = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
            return mode ? JSON.parse(mode) : false;
        } catch (error) {
            console.error('Error getting theme mode:', error);
            return false;
        }
    },

    /**
     * Clear all storage (logout)
     */
    clearAll: async (): Promise<void> => {
        try {
            await AsyncStorage.multiRemove([
                STORAGE_KEYS.AUTH_TOKEN,
                STORAGE_KEYS.USER_DATA,
            ]);
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    },
};
