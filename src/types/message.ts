/**
 * CampusLoop Message Types
 * All messaging-related TypeScript interfaces
 */

export type CampusLoopMessageStatus = 'sent' | 'delivered' | 'read';

export interface CampusLoopMessage {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    content: string;
    status: CampusLoopMessageStatus;
    createdAt: Date;
}

export interface CampusLoopConversation {
    id: string;
    participantIds: string[];
    otherUserId: string;
    otherUserName: string;
    otherUserAvatar?: string;
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
}

export interface CampusLoopSendMessageData {
    conversationId: string;
    receiverId: string;
    content: string;
}
