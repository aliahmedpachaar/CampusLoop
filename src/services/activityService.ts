/**
 * CampusLoop Activity Service
 * Connects to the backend API for activities
 */

import {
    CampusLoopActivity,
    CampusLoopCreateActivityData,
    CampusLoopActivityType,
} from '../types/activity';
import { apiService } from './api';
import { API_CONFIG } from '../config/api';

// Transform backend activity to app format
const transformActivity = (backendActivity: any): CampusLoopActivity => {
    const participants = backendActivity.participants || [];
    const acceptedParticipants = participants.filter((p: any) => p.status === 'accepted');

    return {
        id: backendActivity._id || backendActivity.id,
        creatorId: backendActivity.creator?._id || backendActivity.creator,
        creatorName: backendActivity.creator?.fullName || 'Unknown',
        creatorAvatar: backendActivity.creator?.avatar,
        type: backendActivity.type as CampusLoopActivityType,
        title: backendActivity.title,
        description: backendActivity.description,
        maxParticipants: backendActivity.maxParticipants,
        currentParticipants: acceptedParticipants.length,
        participantIds: acceptedParticipants.map((p: any) => p.user?._id || p.user),
        participants: acceptedParticipants.map((p: any) => ({
            id: p.user?._id || p.user,
            name: p.user?.fullName || 'Unknown',
            avatar: p.user?.avatar,
        })),
        university: backendActivity.university,
        campus: backendActivity.campus,
        location: backendActivity.location,
        scheduledDate: backendActivity.scheduledDate ? new Date(backendActivity.scheduledDate) : undefined,
        createdAt: new Date(backendActivity.createdAt),
        isJoined: backendActivity.isJoined || false,
        isCreator: backendActivity.isCreator || false,
        status: backendActivity.status || 'active',
        tags: backendActivity.tags || [],
    };
};

export const CampusLoopActivityService = {
    /**
     * Get activities with optional filters
     */
    getActivities: async (
        type?: CampusLoopActivityType,
        userId?: string
    ): Promise<CampusLoopActivity[]> => {
        try {
            const params: Record<string, any> = {};
            if (type && type !== 'other') {
                params.type = type;
            }

            const response = await apiService.get<any[]>(
                API_CONFIG.ENDPOINTS.ACTIVITIES,
                params
            );

            if (!response.success || !response.data) {
                return [];
            }

            return response.data.map(transformActivity);
        } catch (error) {
            console.error('Get activities error:', error);
            return [];
        }
    },

    /**
     * Get single activity by ID
     */
    getActivity: async (activityId: string): Promise<CampusLoopActivity | null> => {
        try {
            const response = await apiService.get<any>(
                `${API_CONFIG.ENDPOINTS.ACTIVITIES}/${activityId}`
            );

            if (!response.success || !response.data) {
                return null;
            }

            return transformActivity(response.data);
        } catch (error) {
            console.error('Get activity error:', error);
            return null;
        }
    },

    /**
     * Create new activity
     */
    createActivity: async (
        data: CampusLoopCreateActivityData,
        userId: string
    ): Promise<CampusLoopActivity> => {
        try {
            const response = await apiService.post<any>(
                API_CONFIG.ENDPOINTS.ACTIVITIES,
                {
                    type: data.type,
                    title: data.title,
                    description: data.description,
                    location: data.location || '',
                    scheduledDate: data.scheduledDate?.toISOString(),
                    maxParticipants: data.maxParticipants,
                    tags: data.tags || [],
                }
            );

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to create activity');
            }

            return transformActivity(response.data);
        } catch (error: any) {
            console.error('Create activity error:', error);
            throw new Error(error.message || 'Failed to create activity');
        }
    },

    /**
     * Join an activity
     */
    joinActivity: async (activityId: string, userId: string): Promise<boolean> => {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.JOIN_ACTIVITY(activityId)
            );

            return response.success;
        } catch (error) {
            console.error('Join activity error:', error);
            return false;
        }
    },

    /**
     * Leave an activity
     */
    leaveActivity: async (activityId: string, userId: string): Promise<boolean> => {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.LEAVE_ACTIVITY(activityId)
            );

            return response.success;
        } catch (error) {
            console.error('Leave activity error:', error);
            return false;
        }
    },

    /**
     * Get my activities (created + joined)
     */
    getMyActivities: async (type?: 'created' | 'joined'): Promise<CampusLoopActivity[]> => {
        try {
            const params: Record<string, any> = {};
            if (type) {
                params.type = type;
            }

            const response = await apiService.get<any[]>(
                API_CONFIG.ENDPOINTS.MY_ACTIVITIES,
                params
            );

            if (!response.success || !response.data) {
                return [];
            }

            return response.data.map(transformActivity);
        } catch (error) {
            console.error('Get my activities error:', error);
            return [];
        }
    },

    /**
     * Update activity
     */
    updateActivity: async (
        activityId: string,
        data: Partial<CampusLoopCreateActivityData>
    ): Promise<CampusLoopActivity | null> => {
        try {
            const response = await apiService.put<any>(
                `${API_CONFIG.ENDPOINTS.ACTIVITIES}/${activityId}`,
                data
            );

            if (!response.success || !response.data) {
                return null;
            }

            return transformActivity(response.data);
        } catch (error) {
            console.error('Update activity error:', error);
            return null;
        }
    },

    /**
     * Delete activity
     */
    deleteActivity: async (activityId: string): Promise<boolean> => {
        try {
            const response = await apiService.delete(
                `${API_CONFIG.ENDPOINTS.ACTIVITIES}/${activityId}`
            );

            return response.success;
        } catch (error) {
            console.error('Delete activity error:', error);
            return false;
        }
    },
};

export default CampusLoopActivityService;
