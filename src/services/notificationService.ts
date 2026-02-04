/**
 * CampusLoop Notification Service
 * Connects to the backend API for notifications
 */

import { apiService } from './api';
import { API_CONFIG } from '../config/api';

export interface CampusLoopNotification {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    sender?: {
        id: string;
        fullName: string;
        avatar?: string;
    };
    activity?: {
        id: string;
        title: string;
        type: string;
    };
    createdAt: Date;
}

// Transform backend notification to app format
const transformNotification = (backendNotification: any): CampusLoopNotification => {
    return {
        id: backendNotification._id || backendNotification.id,
        type: backendNotification.type,
        title: backendNotification.title,
        message: backendNotification.message,
        isRead: backendNotification.isRead,
        sender: backendNotification.sender ? {
            id: backendNotification.sender._id || backendNotification.sender.id,
            fullName: backendNotification.sender.fullName,
            avatar: backendNotification.sender.avatar,
        } : undefined,
        activity: backendNotification.activity ? {
            id: backendNotification.activity._id || backendNotification.activity.id,
            title: backendNotification.activity.title,
            type: backendNotification.activity.type,
        } : undefined,
        createdAt: new Date(backendNotification.createdAt),
    };
};

export const CampusLoopNotificationService = {
    /**
     * Get user notifications
     */
    getNotifications: async (): Promise<{ notifications: CampusLoopNotification[]; unreadCount: number }> => {
        try {
            const response = await apiService.get<any>(API_CONFIG.ENDPOINTS.NOTIFICATIONS);

            if (!response.success || !response.data) {
                return { notifications: [], unreadCount: 0 };
            }

            return {
                notifications: response.data.map(transformNotification),
                unreadCount: (response as any).unreadCount || 0,
            };
        } catch (error) {
            console.error('Get notifications error:', error);
            return { notifications: [], unreadCount: 0 };
        }
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (notificationId: string): Promise<boolean> => {
        try {
            const response = await apiService.put(
                API_CONFIG.ENDPOINTS.MARK_READ(notificationId)
            );
            return response.success;
        } catch (error) {
            console.error('Mark as read error:', error);
            return false;
        }
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async (): Promise<boolean> => {
        try {
            const response = await apiService.put(API_CONFIG.ENDPOINTS.MARK_ALL_READ);
            return response.success;
        } catch (error) {
            console.error('Mark all as read error:', error);
            return false;
        }
    },

    /**
     * Delete notification
     */
    deleteNotification: async (notificationId: string): Promise<boolean> => {
        try {
            const response = await apiService.delete(
                `${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/${notificationId}`
            );
            return response.success;
        } catch (error) {
            console.error('Delete notification error:', error);
            return false;
        }
    },
};

export default CampusLoopNotificationService;
