/**
 * CampusLoop API Configuration
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = (): string => {
    if (__DEV__) {
        if (Platform.OS === 'web') return 'http://localhost:5001';
        if (Platform.OS === 'android') return 'http://10.0.2.2:5001';
        // iOS: extract the Mac's IP from Expo's Metro host so physical devices work.
        // On simulator hostUri is "localhost:8081"; on physical device it's "192.168.x.x:8081".
        const metroHost = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
        return `http://${metroHost}:5001`;
    }
    return 'https://api.campusloop.com'; // TODO: replace with real API URL
};

export const API_CONFIG = {
    BASE_URL: getBaseUrl(),
    TIMEOUT: 15000,
    ENDPOINTS: {
        // Auth
        SIGNUP:           '/api/auth/signup',
        VERIFY_OTP:       '/api/auth/verify-otp',
        RESEND_OTP:       '/api/auth/resend-otp',
        COMPLETE_PROFILE: '/api/auth/complete-profile',
        LOGIN:            '/api/auth/login',
        ME:               '/api/auth/me',
        GOOGLE_AUTH:      '/api/auth/google',
        FORGOT_PASSWORD:  '/api/auth/forgot-password',
        RESET_PASSWORD:   '/api/auth/reset-password',
        DELETE_ACCOUNT:   '/api/auth/account',

        // Activities
        ACTIVITIES:       '/api/activities',
        MY_ACTIVITIES:    '/api/activities/my',
        JOIN_ACTIVITY:    (id: string) => `/api/activities/${id}/join`,
        LEAVE_ACTIVITY:   (id: string) => `/api/activities/${id}/leave`,

        // Users
        UPDATE_PROFILE:   '/api/users/profile',
        UPDATE_AVATAR:    '/api/users/avatar',
        CHANGE_PASSWORD:  '/api/users/password',
        GET_USER:         (id: string) => `/api/users/${id}`,

        // Messages
        GET_MESSAGES:     (id: string) => `/api/messages/${id}`,
        SEND_MESSAGE:     (id: string) => `/api/messages/${id}`,

        // Notifications
        NOTIFICATIONS:    '/api/notifications',
        MARK_READ:        (id: string) => `/api/notifications/${id}/read`,
        MARK_ALL_READ:    '/api/notifications/read-all',

        // Posts
        POSTS:            '/api/posts',
        LIKE_POST:        (id: string) => `/api/posts/${id}/like`,
        COMMENT_POST:     (id: string) => `/api/posts/${id}/comment`,
        DELETE_POST:      (id: string) => `/api/posts/${id}`,

        // Search
        SEARCH_ACTIVITIES: '/api/activities',
        SEARCH_USERS:      '/api/users',
    },
};

export default API_CONFIG;
