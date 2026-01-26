/**
 * CampusLoop Notification Types
 * All notification-related TypeScript interfaces
 */

export type CampusLoopNotificationType =
    | 'activity_join'
    | 'message'
    | 'post_like'
    | 'post_comment'
    | 'connection_request';

export interface CampusLoopNotification {
    id: string;
    userId: string;
    type: CampusLoopNotificationType;
    title: string;
    message: string;
    relatedId?: string; // ID of related post, activity, etc.
    fromUserId?: string;
    fromUserName?: string;
    fromUserAvatar?: string;
    isRead: boolean;
    createdAt: Date;
}

export const CampusLoopNotificationTypeIcons: Record<CampusLoopNotificationType, string> = {
    activity_join: 'users',
    message: 'message-circle',
    post_like: 'heart',
    post_comment: 'message-square',
    connection_request: 'user-plus',
};
