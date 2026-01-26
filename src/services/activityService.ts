/**
 * CampusLoop Activity Service
 * Mock activity and collaboration service - ready for backend integration
 */

import {
    CampusLoopActivity,
    CampusLoopActivityParticipant,
    CampusLoopCreateActivityData,
    CampusLoopActivityType,
} from '../types/activity';

const mockDelay = (ms: number = 700) => new Promise(resolve => setTimeout(resolve, ms));

// Mock activities database
let mockActivities: CampusLoopActivity[] = [
    {
        id: 'activity_1',
        creatorId: '2',
        creatorName: 'Sarah Johnson',
        type: 'study_group',
        title: 'Data Structures Study Group',
        description: 'Preparing for midterm exam. Meeting twice a week to review concepts and solve problems together.',
        maxParticipants: 5,
        currentParticipants: 3,
        participantIds: ['2', '1'],
        university: 'Massachusetts Institute of Technology (MIT)',
        location: 'Library Room 204',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isJoined: false,
    },
    {
        id: 'activity_2',
        creatorId: '1',
        creatorName: 'Demo Student',
        type: 'project_collab',
        title: 'Mobile App Development Team',
        description: 'Building a campus food delivery app. Need 2 more developers (React Native experience preferred).',
        maxParticipants: 4,
        currentParticipants: 2,
        participantIds: ['1'],
        university: 'Stanford University',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isJoined: true,
    },
    {
        id: 'activity_3',
        creatorId: '2',
        creatorName: 'Sarah Johnson',
        type: 'sports',
        title: 'Weekend Football Match',
        description: 'Casual football game on Saturday morning. All skill levels welcome!',
        maxParticipants: 12,
        currentParticipants: 8,
        participantIds: ['2'],
        university: 'Massachusetts Institute of Technology (MIT)',
        location: 'Main Campus Field',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isJoined: false,
    },
];

export const CampusLoopActivityService = {
    /**
     * Get activities with optional filters
     * TODO: Replace with actual API call
     */
    getActivities: async (
        type?: CampusLoopActivityType,
        userId?: string
    ): Promise<CampusLoopActivity[]> => {
        await mockDelay();

        let filtered = [...mockActivities];

        if (type) {
            filtered = filtered.filter(activity => activity.type === type);
        }

        if (userId) {
            filtered = filtered.map(activity => ({
                ...activity,
                isJoined: activity.participantIds.includes(userId),
            }));
        }

        // Sort by date (newest first)
        return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },

    /**
     * Create new activity
     * TODO: Replace with actual API call
     */
    createActivity: async (
        userId: string,
        userName: string,
        userUniversity: string,
        data: CampusLoopCreateActivityData
    ): Promise<CampusLoopActivity> => {
        await mockDelay(800);

        const newActivity: CampusLoopActivity = {
            id: `activity_${Date.now()}`,
            creatorId: userId,
            creatorName: userName,
            type: data.type,
            title: data.title,
            description: data.description,
            maxParticipants: data.maxParticipants,
            currentParticipants: 1,
            participantIds: [userId],
            university: userUniversity,
            location: data.location,
            scheduledDate: data.scheduledDate,
            createdAt: new Date(),
            isJoined: true,
        };

        mockActivities.unshift(newActivity);
        return newActivity;
    },

    /**
     * Join activity
     * TODO: Replace with actual API call
     */
    joinActivity: async (activityId: string, userId: string): Promise<CampusLoopActivity> => {
        await mockDelay(500);

        const activity = mockActivities.find(a => a.id === activityId);

        if (!activity) {
            throw new Error('Activity not found');
        }

        if (activity.currentParticipants >= activity.maxParticipants) {
            throw new Error('Activity is full');
        }

        if (activity.participantIds.includes(userId)) {
            throw new Error('Already joined');
        }

        activity.participantIds.push(userId);
        activity.currentParticipants += 1;
        activity.isJoined = true;

        return activity;
    },

    /**
     * Leave activity
     * TODO: Replace with actual API call
     */
    leaveActivity: async (activityId: string, userId: string): Promise<CampusLoopActivity> => {
        await mockDelay(500);

        const activity = mockActivities.find(a => a.id === activityId);

        if (!activity) {
            throw new Error('Activity not found');
        }

        const index = activity.participantIds.indexOf(userId);
        if (index === -1) {
            throw new Error('Not a participant');
        }

        activity.participantIds.splice(index, 1);
        activity.currentParticipants -= 1;
        activity.isJoined = false;

        return activity;
    },

    /**
     * Get activity participants
     * TODO: Replace with actual API call
     */
    getActivityParticipants: async (activityId: string): Promise<CampusLoopActivityParticipant[]> => {
        await mockDelay(600);

        // Mock participants
        return [];
    },
};
