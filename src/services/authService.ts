/**
 * CampusLoop Authentication Service - v2
 * email + password login, OTP for signup verification, DOB for password reset
 */

import { CampusLoopUser } from '../types/user';
import { apiService } from './api';
import { API_CONFIG } from '../config/api';
import { CampusLoopStorage } from '../utils/storage';

export interface CampusLoopAuthResponse {
    user:         CampusLoopUser;
    token:        string;
    needsProfile?: boolean;
}

const transformUser = (u: any): CampusLoopUser => ({
    id:              u.id || u._id,
    email:           u.email,
    fullName:        u.fullName || '',
    university:      u.university || 'City University Malaysia',
    campus:          u.campus    || '',
    course:          u.course    || '',
    semester:        u.semester  || '',
    interests:       u.interests || [],
    profilePicture:  u.avatar    || '',
    bio:             u.bio       || '',
    emailVerified:   u.emailVerified   ?? false,
    profileComplete: u.profileComplete ?? false,
    authProvider:    u.authProvider    || 'email',
    createdAt:       new Date(u.createdAt),
    locationEnabled: false,
});

export const CampusLoopAuthService = {

    // ── Sign Up ──────────────────────────────────────────────────────────────
    // name + email + dateOfBirth + password → OTP sent to email

    signup: async (fullName: string, email: string, dateOfBirth: string, password: string): Promise<void> => {
        const response = await apiService.post(
            API_CONFIG.ENDPOINTS.SIGNUP, { fullName, email, dateOfBirth, password }
        );
        if (!response.success) throw new Error(response.message || 'Sign up failed');
    },

    // ── Verify OTP (after signup) ─────────────────────────────────────────────

    verifyOTP: async (email: string, otp: string): Promise<CampusLoopAuthResponse> => {
        const response = await apiService.post<{ user: any; token: string; needsProfile: boolean }>(
            API_CONFIG.ENDPOINTS.VERIFY_OTP, { email, otp }
        );
        if (!response.success || !response.data) throw new Error(response.message || 'Verification failed');
        const { user, token, needsProfile } = response.data;
        await CampusLoopStorage.saveAuthToken(token);
        return { user: transformUser(user), token, needsProfile };
    },

    resendOTP: async (email: string): Promise<void> => {
        const response = await apiService.post(API_CONFIG.ENDPOINTS.RESEND_OTP, { email });
        if (!response.success) throw new Error(response.message || 'Failed to resend code');
    },

    // ── Complete Profile (campus + course after first sign-up) ───────────────

    completeProfile: async (data: { campus: string; course?: string }): Promise<CampusLoopAuthResponse> => {
        const response = await apiService.post<{ user: any; token: string }>(
            API_CONFIG.ENDPOINTS.COMPLETE_PROFILE, data
        );
        if (!response.success || !response.data) throw new Error(response.message || 'Profile setup failed');
        const { user, token } = response.data;
        await CampusLoopStorage.saveAuthToken(token);
        return { user: transformUser(user), token };
    },

    // ── Sign In ───────────────────────────────────────────────────────────────

    login: async (email: string, password: string): Promise<CampusLoopAuthResponse> => {
        const response = await apiService.post<{ user: any; token: string; needsProfile: boolean }>(
            API_CONFIG.ENDPOINTS.LOGIN, { email, password }
        );
        if (!response.success || !response.data) throw new Error(response.message || 'Sign in failed');
        const { user, token, needsProfile } = response.data;
        await CampusLoopStorage.saveAuthToken(token);
        return { user: transformUser(user), token, needsProfile };
    },

    // ── Google auth ────────────────────────────────────────────────────────────

    googleAuth: async (params: {
        email: string; googleId: string; fullName: string; avatar?: string;
    }): Promise<CampusLoopAuthResponse> => {
        const response = await apiService.post<{ user: any; token: string; needsProfile: boolean }>(
            API_CONFIG.ENDPOINTS.GOOGLE_AUTH, params
        );
        if (!response.success || !response.data) throw new Error(response.message || 'Google sign-in failed');
        const { user, token, needsProfile } = response.data;
        await CampusLoopStorage.saveAuthToken(token);
        return { user: transformUser(user), token, needsProfile };
    },

    // ── Forgot Password (requires email + date of birth to match) ─────────────

    forgotPassword: async (email: string, dateOfBirth: string): Promise<void> => {
        const response = await apiService.post(
            API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, { email, dateOfBirth }
        );
        if (!response.success) throw new Error(response.message || 'Could not send reset code');
    },

    // ── Reset Password ────────────────────────────────────────────────────────

    resetPassword: async (email: string, otp: string, newPassword: string): Promise<void> => {
        const response = await apiService.post(
            API_CONFIG.ENDPOINTS.RESET_PASSWORD, { email, otp, newPassword }
        );
        if (!response.success) throw new Error(response.message || 'Password reset failed');
    },

    // ── Delete Account ────────────────────────────────────────────────────────

    deleteAccount: async (): Promise<void> => {
        const response = await apiService.delete(API_CONFIG.ENDPOINTS.DELETE_ACCOUNT);
        if (!response.success) throw new Error(response.message || 'Could not delete account');
    },

    // ── Session ────────────────────────────────────────────────────────────────

    verifyToken: async (_token: string): Promise<CampusLoopUser | null> => {
        try {
            const response = await apiService.get<any>(API_CONFIG.ENDPOINTS.ME);
            if (!response.success || !response.data) return null;
            return transformUser(response.data);
        } catch {
            return null;
        }
    },

    logout: async (): Promise<void> => {
        await CampusLoopStorage.clearAll();
    },

    getStoredToken: async (): Promise<string | null> => CampusLoopStorage.getAuthToken(),
};

export default CampusLoopAuthService;
