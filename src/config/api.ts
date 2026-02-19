/**
 * CampusLoop API Configuration
 * Central configuration for backend connection
 */

// Change this to your backend URL
// For local development on iOS simulator: use localhost
// For local development on Android emulator: use 10.0.2.2
// For physical device: use your computer's IP address (e.g., 192.168.x.x)

const getBaseUrl = () => {
    // Development
    if (__DEV__) {
        // Automatically detected IP for physical device
        return 'http://10.100.101.52:5001';

        // For iOS simulator
        // return 'http://localhost:5001';

        // For Android emulator
        // return 'http://10.0.2.2:5001';
    }

    // Production - replace with your deployed backend URL
    return 'https://api.campusloop.com';
};

export const API_CONFIG = {
    BASE_URL: getBaseUrl(),
    ENDPOINTS: {
        // Auth
        SIGNUP: '/api/auth/signup',
        LOGIN: '/api/auth/login',
        ME: '/api/auth/me',
        FORGOT_PASSWORD: '/api/auth/forgot-password',

        // Activities
        ACTIVITIES: '/api/activities',
        MY_ACTIVITIES: '/api/activities/my',
        JOIN_ACTIVITY: (id: string) => `/api/activities/${id}/join`,
        LEAVE_ACTIVITY: (id: string) => `/api/activities/${id}/leave`,

        // Users
        UPDATE_PROFILE: '/api/users/profile',
        UPDATE_AVATAR: '/api/users/avatar',
        CHANGE_PASSWORD: '/api/users/password',
        GET_USER: (id: string) => `/api/users/${id}`,

        // Messages
        GET_MESSAGES: (activityId: string) => `/api/messages/${activityId}`,
        SEND_MESSAGE: (activityId: string) => `/api/messages/${activityId}`,

        // Notifications
        NOTIFICATIONS: '/api/notifications',
        MARK_READ: (id: string) => `/api/notifications/${id}/read`,
        MARK_ALL_READ: '/api/notifications/read-all',
    },
    TIMEOUT: 10000, // 10 seconds
};

export default API_CONFIG;
