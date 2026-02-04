/**
 * CampusLoop Authentication Service
 * Connects to the backend API for authentication
 */

import { CampusLoopUser, CampusLoopSignupData } from '../types/user';
import { apiService } from './api';
import { API_CONFIG } from '../config/api';
import { CampusLoopStorage } from '../utils/storage';

export interface CampusLoopAuthResponse {
    user: CampusLoopUser;
    token: string;
}

// Transform backend user to app user format
const transformUser = (backendUser: any): CampusLoopUser => {
    return {
        id: backendUser.id || backendUser._id,
        email: backendUser.email,
        fullName: backendUser.fullName,
        university: backendUser.university,
        campus: backendUser.campus,
        course: backendUser.course,
        semester: backendUser.semester,
        interests: backendUser.interests || [],
        profilePicture: backendUser.avatar,
        bio: backendUser.bio || '',
        createdAt: new Date(backendUser.createdAt),
        locationEnabled: false,
    };
};

export const CampusLoopAuthService = {
    /**
     * Login with email and password
     */
    login: async (email: string, password: string): Promise<CampusLoopAuthResponse> => {
        try {
            const response = await apiService.post<{ user: any; token: string }>(
                API_CONFIG.ENDPOINTS.LOGIN,
                { email, password }
            );

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Login failed');
            }

            const { user, token } = response.data;

            // Save token to storage
            await CampusLoopStorage.saveAuthToken(token);

            return {
                user: transformUser(user),
                token,
            };
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Login failed. Please try again.');
        }
    },

    /**
     * Sign up new user
     */
    signup: async (data: CampusLoopSignupData): Promise<CampusLoopAuthResponse> => {
        try {
            const response = await apiService.post<{ user: any; token: string }>(
                API_CONFIG.ENDPOINTS.SIGNUP,
                {
                    email: data.email,
                    password: data.password,
                    fullName: data.fullName,
                    university: data.university,
                    campus: data.campus || '',
                    course: data.course || '',
                    semester: data.semester || '',
                    interests: data.interests || [],
                }
            );

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Signup failed');
            }

            const { user, token } = response.data;

            // Save token to storage
            await CampusLoopStorage.saveAuthToken(token);

            return {
                user: transformUser(user),
                token,
            };
        } catch (error: any) {
            console.error('Signup error:', error);
            throw new Error(error.message || 'Signup failed. Please try again.');
        }
    },

    /**
     * Verify token and get current user
     */
    verifyToken: async (token: string): Promise<CampusLoopUser | null> => {
        try {
            // Token is already stored, apiService will use it
            const response = await apiService.get<any>(API_CONFIG.ENDPOINTS.ME);

            if (!response.success || !response.data) {
                return null;
            }

            return transformUser(response.data);
        } catch (error) {
            console.error('Token verification error:', error);
            return null;
        }
    },

    /**
     * Logout user
     */
    logout: async (): Promise<void> => {
        await CampusLoopStorage.clearAll();
    },

    /**
     * Forgot password
     */
    forgotPassword: async (email: string): Promise<boolean> => {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.FORGOT_PASSWORD,
                { email }
            );
            return response.success;
        } catch (error) {
            console.error('Forgot password error:', error);
            return false;
        }
    },

    /**
     * Get stored auth token
     */
    getStoredToken: async (): Promise<string | null> => {
        return await CampusLoopStorage.getAuthToken();
    },
};

export default CampusLoopAuthService;

