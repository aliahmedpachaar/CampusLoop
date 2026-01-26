/**
 * CampusLoop Notification Service
 * Mock notification service - ready for backend integration
 */

import { CampusLoopNotification, CampusLoopNotificationType } from '../types/notification';

const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock notifications database
let mockNotifications: CampusLoopNotification[] = [
    {
        id: 'notif_1',
        userId: '1',
        type: 'activity_join',
        title: 'New participant',
        message: 'Sarah Johnson joined your activity "Mobile App Development Team"',
        relatedId: 'activity_2',
        fromUserId: '2',
        fromUserName: 'Sarah Johnson',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
        id: 'notif_2',
        userId: '1',
        type: 'post_like',
        title: 'Post liked',
        message: 'Sarah Johnson liked your post',
        relatedId: 'post_2',
        fromUserId: '2',
        fromUserName: 'Sarah Johnson',
        isRead: false,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
        id: 'notif_3',
        userId: '1',
        type: 'message',
        title: 'New message',
        message: 'Sarah Johnson sent you a message',
        relatedId: 'conv_1',
        fromUserId: '2',
        fromUserName: 'Sarah Johnson',
        isRead: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
];

export const CampusLoopNotificationService = {
    /**
     * Get user notifications
     * TODO: Replace with actual API call
     */
    getNotifications: async (userId: string): Promise<CampusLoopNotification[]> => {
        await mockDelay();

        const userNotifications = mockNotifications.filter(notif => notif.userId === userId);

        // Sort by date (newest first)
        return userNotifications.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
    },

    /**
     * Get unread count
     * TODO: Replace with actual API call
     */
    getUnreadCount: async (userId: string): Promise<number> => {
        await mockDelay(300);

        return mockNotifications.filter(notif => notif.userId === userId && !notif.isRead)
            .length;
    },

    /**
     * Mark notification as read
     * TODO: Replace with actual API call
     */
    markAsRead: async (notificationId: string): Promise<void> => {
        await mockDelay(200);

        const notification = mockNotifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
        }
    },

    /**
     * Mark all as read
     * TODO: Replace with actual API call
     */
    markAllAsRead: async (userId: string): Promise<void> => {
        await mockDelay(300);

        mockNotifications
            .filter(notif => notif.userId === userId)
            .forEach(notif => {
                notif.isRead = true;
            });
    },

    /**
     * Clear all notifications
     * TODO: Replace with actual API call
     */
    clearAll: async (userId: string): Promise<void> => {
        await mockDelay(300);

        mockNotifications = mockNotifications.filter(notif => notif.userId !== userId);
    },
};
