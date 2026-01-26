/**
 * CampusLoop Authentication Context
 * Global authentication state management
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CampusLoopUser, CampusLoopAuthState, CampusLoopSignupData } from '../types/user';
import { CampusLoopAuthService } from '../services/authService';
import { CampusLoopStorage } from '../utils/storage';

// Auth actions
type AuthAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_USER'; payload: { user: CampusLoopUser; token: string } }
    | { type: 'LOGOUT' }
    | { type: 'UPDATE_USER'; payload: CampusLoopUser };

// Initial state
const initialState: CampusLoopAuthState = {
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
};

// Reducer
const authReducer = (state: CampusLoopAuthState, action: AuthAction): CampusLoopAuthState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_USER':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload,
            };
        case 'LOGOUT':
            return {
                ...initialState,
                isLoading: false,
            };
        default:
            return state;
    }
};

// Context type
interface AuthContextType {
    state: CampusLoopAuthState;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: CampusLoopSignupData) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: CampusLoopUser) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const CampusLoopAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check for existing session on mount
    useEffect(() => {
        checkExistingSession();
    }, []);

    const checkExistingSession = async () => {
        try {
            const token = await CampusLoopStorage.getAuthToken();

            if (token) {
                const user = await CampusLoopAuthService.verifyToken(token);

                if (user) {
                    dispatch({ type: 'SET_USER', payload: { user, token } });
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        } catch (error) {
            console.error('Session check error:', error);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await CampusLoopAuthService.login(email, password);

            // Save to storage
            await CampusLoopStorage.saveAuthToken(response.token);
            await CampusLoopStorage.saveUserData(response.user);

            dispatch({ type: 'SET_USER', payload: response });
        } catch (error) {
            throw error;
        }
    };

    const signup = async (data: CampusLoopSignupData) => {
        try {
            const response = await CampusLoopAuthService.signup(data);

            // Save to storage
            await CampusLoopStorage.saveAuthToken(response.token);
            await CampusLoopStorage.saveUserData(response.user);

            dispatch({ type: 'SET_USER', payload: response });
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await CampusLoopAuthService.logout();
            await CampusLoopStorage.clearAll();
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUser = (user: CampusLoopUser) => {
        dispatch({ type: 'UPDATE_USER', payload: user });
        CampusLoopStorage.saveUserData(user);
    };

    return (
        <AuthContext.Provider value={{ state, login, signup, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useCampusLoopAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useCampusLoopAuth must be used within CampusLoopAuthProvider');
    }
    return context;
};
