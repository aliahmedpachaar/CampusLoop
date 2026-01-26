/**
 * CampusLoop User Types
 * All user-related TypeScript interfaces
 */

export interface CampusLoopUser {
    id: string;
    email: string;
    fullName: string;
    university: string;
    course: string;
    semester: string;
    interests: string[];
    profilePicture?: string;
    bio?: string;
    createdAt: Date;
    locationEnabled: boolean;
    locationRadius?: 'building' | 'campus' | 'nearby';
}

export interface CampusLoopUserProfile {
    id: string;
    fullName: string;
    university: string;
    course: string;
    semester: string;
    interests: string[];
    profilePicture?: string;
    bio?: string;
    activitiesCount: number;
}

export interface CampusLoopProfileUpdateData {
    fullName?: string;
    university?: string;
    course?: string;
    semester?: string;
    interests?: string[];
    profilePicture?: string;
    bio?: string;
}

export interface CampusLoopAuthState {
    user: CampusLoopUser | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export interface CampusLoopSignupData {
    email: string;
    password: string;
    fullName: string;
    university: string;
    course: string;
    semester: string;
    interests: string[];
    profilePicture?: string;
}
