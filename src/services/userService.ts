/**
 * CampusLoop User Service
 * Connects to the backend API for user operations
 */

import { CampusLoopUser, CampusLoopUserProfile, CampusLoopProfileUpdateData } from '../types/user';
import { apiService } from './api';
import { API_CONFIG } from '../config/api';

// Transform backend user to app format
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

export const CampusLoopUserService = {
    /**
     * Get user by ID
     */
    getUser: async (userId: string): Promise<CampusLoopUser | null> => {
        try {
            const response = await apiService.get<any>(
                API_CONFIG.ENDPOINTS.GET_USER(userId)
            );

            if (!response.success || !response.data) {
                return null;
            }

            return transformUser(response.data);
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        }
    },

    /**
     * Update user profile
     */
    updateProfile: async (data: {
        fullName?: string;
        university?: string;
        campus?: string;
        course?: string;
        semester?: string;
        bio?: string;
        interests?: string[];
    }): Promise<CampusLoopUser | null> => {
        try {
            const response = await apiService.put<any>(
                API_CONFIG.ENDPOINTS.UPDATE_PROFILE,
                data
            );

            if (!response.success || !response.data) {
                return null;
            }

            return transformUser(response.data);
        } catch (error) {
            console.error('Update profile error:', error);
            return null;
        }
    },

    /**
     * Update avatar
     */
    updateAvatar: async (avatarUrl: string): Promise<boolean> => {
        try {
            const response = await apiService.put(
                API_CONFIG.ENDPOINTS.UPDATE_AVATAR,
                { avatar: avatarUrl }
            );

            return response.success;
        } catch (error) {
            console.error('Update avatar error:', error);
            return false;
        }
    },

    /**
     * Change password
     */
    changePassword: async (currentPassword: string, newPassword: string): Promise<boolean> => {
        try {
            const response = await apiService.put(
                API_CONFIG.ENDPOINTS.CHANGE_PASSWORD,
                { currentPassword, newPassword }
            );

            return response.success;
        } catch (error) {
            console.error('Change password error:', error);
            return false;
        }
    },

    /**
     * Deactivate account
     */
    deactivateAccount: async (): Promise<boolean> => {
        try {
            const response = await apiService.delete('/api/users/account');
            return response.success;
        } catch (error) {
            console.error('Deactivate account error:', error);
            return false;
        }
    },
};

export default CampusLoopUserService;
