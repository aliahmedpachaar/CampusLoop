/**
 * CampusLoop User Service
 * Mock user profile service - ready for backend integration
 */

import { CampusLoopUser, CampusLoopUserProfile, CampusLoopProfileUpdateData } from '../types/user';

const mockDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user data
const mockUserProfiles: CampusLoopUser[] = [
    {
        id: '1',
        email: 'demo@university.edu',
        fullName: 'Demo Student',
        university: 'Stanford University',
        course: 'Computer Science',
        semester: 'Semester 3',
        interests: ['Coding', 'Web Development', 'Sports', 'Music'],
        bio: 'CS student passionate about building cool stuff!',
        createdAt: new Date('2024-01-15'),
        locationEnabled: false,
    },
    {
        id: '2',
        email: 'sarah@mit.edu',
        fullName: 'Sarah Johnson',
        university: 'Massachusetts Institute of Technology (MIT)',
        course: 'Data Science',
        semester: 'Semester 5',
        interests: ['Machine Learning', 'Data Analysis', 'Reading', 'Yoga'],
        bio: 'Data science enthusiast | ML researcher',
        createdAt: new Date('2023-09-01'),
        locationEnabled: true,
        locationRadius: 'campus',
    },
];

export const CampusLoopUserService = {
    /**
     * Get user profile by ID
     * TODO: Replace with actual API call
     */
    getUserProfile: async (userId: string): Promise<CampusLoopUserProfile> => {
        await mockDelay();

        const user = mockUserProfiles.find(u => u.id === userId);

        if (!user) {
            throw new Error('User not found');
        }

        return {
            id: user.id,
            fullName: user.fullName,
            university: user.university,
            course: user.course,
            semester: user.semester,
            interests: user.interests,
            profilePicture: user.profilePicture,
            bio: user.bio,
            activitiesCount: Math.floor(Math.random() * 10) + 1, // Mock count
        };
    },

    /**
     * Update user profile
     * TODO: Replace with actual API call
     */
    updateProfile: async (
        userId: string,
        data: CampusLoopProfileUpdateData
    ): Promise<CampusLoopUser> => {
        await mockDelay();

        const userIndex = mockUserProfiles.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

        // Update user data
        mockUserProfiles[userIndex] = {
            ...mockUserProfiles[userIndex],
            ...data,
        };

        return mockUserProfiles[userIndex];
    },

    /**
     * Upload profile picture
     * TODO: Replace with actual file upload
     */
    uploadProfilePicture: async (imageUri: string): Promise<string> => {
        await mockDelay(1500);

        // In real implementation, upload to cloud storage and return URL
        // For now, return the local URI
        return imageUri;
    },

    /**
     * Search users by name or university
     * TODO: Replace with actual API call
     */
    searchUsers: async (query: string): Promise<CampusLoopUserProfile[]> => {
        await mockDelay(600);

        const lowerQuery = query.toLowerCase();

        const results = mockUserProfiles
            .filter(
                user =>
                    user.fullName.toLowerCase().includes(lowerQuery) ||
                    user.university.toLowerCase().includes(lowerQuery)
            )
            .map(user => ({
                id: user.id,
                fullName: user.fullName,
                university: user.university,
                course: user.course,
                semester: user.semester,
                interests: user.interests,
                profilePicture: user.profilePicture,
                bio: user.bio,
                activitiesCount: Math.floor(Math.random() * 10) + 1,
            }));

        return results;
    },
};
