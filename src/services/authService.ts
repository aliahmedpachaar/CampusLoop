/**
 * CampusLoop Authentication Service
 * Mock authentication service - ready for backend integration
 */

import { CampusLoopUser, CampusLoopSignupData } from '../types/user';

// Mock delay to simulate network requests
const mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user database (in-memory)
let mockUsers: CampusLoopUser[] = [
    {
        id: '1',
        email: 'demo@university.edu',
        fullName: 'Demo Student',
        university: 'Stanford University',
        course: 'Computer Science',
        semester: 'Semester 3',
        interests: ['Coding', 'Web Development', 'Sports', 'Music'],
        profilePicture: undefined,
        bio: 'CS student passionate about building cool stuff!',
        createdAt: new Date('2024-01-15'),
        locationEnabled: false,
    },
];

// Mock password storage (DO NOT use in production!)
const mockPasswords: Record<string, string> = {
    'demo@university.edu': 'password123',
};

export interface CampusLoopAuthResponse {
    user: CampusLoopUser;
    token: string;
}

export const CampusLoopAuthService = {
    /**
     * Login with email and password
     * TODO: Replace with actual API call
     */
    login: async (email: string, password: string): Promise<CampusLoopAuthResponse> => {
        await mockDelay(800);

        const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user || mockPasswords[email] !== password) {
            throw new Error('Invalid email or password');
        }

        const token = `mock_token_${user.id}_${Date.now()}`;

        return { user, token };
    },

    /**
     * Sign up new user
     * TODO: Replace with actual API call
     */
    signup: async (data: CampusLoopSignupData): Promise<CampusLoopAuthResponse> => {
        await mockDelay(1000);

        // Check if email already exists
        const existingUser = mockUsers.find(
            u => u.email.toLowerCase() === data.email.toLowerCase()
        );

        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Create new user
        const newUser: CampusLoopUser = {
            id: `user_${Date.now()}`,
            email: data.email,
            fullName: data.fullName,
            university: data.university,
            course: data.course,
            semester: data.semester,
            interests: data.interests,
            profilePicture: data.profilePicture,
            bio: '',
            createdAt: new Date(),
            locationEnabled: false,
        };

        mockUsers.push(newUser);
        mockPasswords[data.email] = data.password;

        const token = `mock_token_${newUser.id}_${Date.now()}`;

        return { user: newUser, token };
    },

    /**
     * Verify token and get user
     * TODO: Replace with actual API call
     */
    verifyToken: async (token: string): Promise<CampusLoopUser | null> => {
        await mockDelay(500);

        // Extract user ID from mock token
        const match = token.match(/mock_token_(.+?)_/);
        if (!match) return null;

        const userId = match[1];
        const user = mockUsers.find(u => u.id === userId);

        return user || null;
    },

    /**
     * Logout (client-side only for mock)
     */
    logout: async (): Promise<void> => {
        await mockDelay(300);
        // In real implementation, invalidate token on server
    },

    /**
     * Validate email format
     */
    validateEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Check if email is from university domain
     */
    isUniversityEmail: (email: string): boolean => {
        const universityDomains = ['.edu', '.ac.uk', '.edu.au', '.edu.sg'];
        return universityDomains.some(domain => email.toLowerCase().endsWith(domain));
    },
};
