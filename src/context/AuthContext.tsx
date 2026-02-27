/**
 * CampusLoop Authentication Context - v2
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CampusLoopUser, CampusLoopAuthState } from '../types/user';
import { CampusLoopAuthService } from '../services/authService';
import { CampusLoopStorage } from '../utils/storage';

type AuthAction =
    | { type: 'SET_LOADING';          payload: boolean }
    | { type: 'SET_USER';             payload: { user: CampusLoopUser; token: string } }
    | { type: 'NEEDS_PROFILE_SETUP';  payload: { user: CampusLoopUser; token: string } }
    | { type: 'LOGOUT' }
    | { type: 'UPDATE_USER';          payload: CampusLoopUser };

const initialState: CampusLoopAuthState = {
    user: null, token: null, isLoading: true, isAuthenticated: false, needsProfileSetup: false,
};

const authReducer = (state: CampusLoopAuthState, action: AuthAction): CampusLoopAuthState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_USER':
            return { ...state, user: action.payload.user, token: action.payload.token,
                     isAuthenticated: true, needsProfileSetup: false, isLoading: false };
        case 'NEEDS_PROFILE_SETUP':
            return { ...state, user: action.payload.user, token: action.payload.token,
                     isAuthenticated: false, needsProfileSetup: true, isLoading: false };
        case 'UPDATE_USER':
            return { ...state, user: action.payload };
        case 'LOGOUT':
            return { ...initialState, isLoading: false };
        default:
            return state;
    }
};

interface AuthContextType {
    state: CampusLoopAuthState;
    signup:          (fullName: string, email: string, dateOfBirth: string, password: string) => Promise<void>;
    verifyOTP:       (email: string, otp: string) => Promise<{ needsProfile: boolean }>;
    resendOTP:       (email: string) => Promise<void>;
    login:           (email: string, password: string) => Promise<{ needsProfile: boolean }>;
    completeProfile: (data: { campus: string; course?: string }) => Promise<void>;
    googleAuth:      (params: { email: string; googleId: string; fullName: string; avatar?: string }) => Promise<{ needsProfile: boolean }>;
    forgotPassword:  (email: string, dateOfBirth: string) => Promise<void>;
    deleteAccount:   () => Promise<void>;
    logout:          () => Promise<void>;
    updateUser:      (user: CampusLoopUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const CampusLoopAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => { checkExistingSession(); }, []);

    const checkExistingSession = async () => {
        try {
            const token = await CampusLoopStorage.getAuthToken();
            if (token) {
                const user = await CampusLoopAuthService.verifyToken(token);
                if (user) {
                    if (user.profileComplete) {
                        dispatch({ type: 'SET_USER', payload: { user, token } });
                    } else {
                        // Token valid but profile not done — send back to profile setup
                        dispatch({ type: 'NEEDS_PROFILE_SETUP', payload: { user, token } });
                    }
                    return;
                }
                await CampusLoopStorage.clearAll();
            }
        } catch {
            await CampusLoopStorage.clearAll();
        }
        dispatch({ type: 'SET_LOADING', payload: false });
    };

    const signup = async (fullName: string, email: string, dateOfBirth: string, password: string) => {
        await CampusLoopAuthService.signup(fullName, email, dateOfBirth, password);
    };

    const verifyOTP = async (email: string, otp: string): Promise<{ needsProfile: boolean }> => {
        const response = await CampusLoopAuthService.verifyOTP(email, otp);
        if (response.needsProfile) {
            await CampusLoopStorage.saveUserData(response.user);
            dispatch({ type: 'NEEDS_PROFILE_SETUP', payload: { user: response.user, token: response.token } });
            return { needsProfile: true };
        }
        await CampusLoopStorage.saveUserData(response.user);
        dispatch({ type: 'SET_USER', payload: { user: response.user, token: response.token } });
        return { needsProfile: false };
    };

    const resendOTP = async (email: string) => {
        await CampusLoopAuthService.resendOTP(email);
    };

    const login = async (email: string, password: string): Promise<{ needsProfile: boolean }> => {
        const response = await CampusLoopAuthService.login(email, password);
        if (response.needsProfile) {
            await CampusLoopStorage.saveUserData(response.user);
            dispatch({ type: 'NEEDS_PROFILE_SETUP', payload: { user: response.user, token: response.token } });
            return { needsProfile: true };
        }
        await CampusLoopStorage.saveUserData(response.user);
        dispatch({ type: 'SET_USER', payload: { user: response.user, token: response.token } });
        return { needsProfile: false };
    };

    const completeProfile = async (data: { campus: string; course?: string }) => {
        const response = await CampusLoopAuthService.completeProfile(data);
        await CampusLoopStorage.saveUserData(response.user);
        dispatch({ type: 'SET_USER', payload: { user: response.user, token: response.token } });
    };

    const googleAuth = async (params: { email: string; googleId: string; fullName: string; avatar?: string }): Promise<{ needsProfile: boolean }> => {
        const response = await CampusLoopAuthService.googleAuth(params);
        if (response.needsProfile) {
            await CampusLoopStorage.saveUserData(response.user);
            dispatch({ type: 'NEEDS_PROFILE_SETUP', payload: { user: response.user, token: response.token } });
            return { needsProfile: true };
        }
        await CampusLoopStorage.saveUserData(response.user);
        dispatch({ type: 'SET_USER', payload: { user: response.user, token: response.token } });
        return { needsProfile: false };
    };

    const forgotPassword = async (email: string, dateOfBirth: string) => {
        await CampusLoopAuthService.forgotPassword(email, dateOfBirth);
    };

    const deleteAccount = async () => {
        await CampusLoopAuthService.deleteAccount();
        await CampusLoopStorage.clearAll();
        dispatch({ type: 'LOGOUT' });
    };

    const logout = async () => {
        await CampusLoopAuthService.logout();
        await CampusLoopStorage.clearAll();
        dispatch({ type: 'LOGOUT' });
    };

    const updateUser = (user: CampusLoopUser) => {
        dispatch({ type: 'UPDATE_USER', payload: user });
        CampusLoopStorage.saveUserData(user);
    };

    return (
        <AuthContext.Provider value={{ state, signup, verifyOTP, resendOTP, login, completeProfile, googleAuth, forgotPassword, deleteAccount, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useCampusLoopAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useCampusLoopAuth must be used within CampusLoopAuthProvider');
    return ctx;
};
