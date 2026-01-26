/**
 * CampusLoop Message Service
 * Mock messaging service - ready for backend integration
 */

import {
    CampusLoopMessage,
    CampusLoopConversation,
    CampusLoopSendMessageData,
} from '../types/message';

const mockDelay = (ms: number = 600) => new Promise(resolve => setTimeout(resolve, ms));

// Mock conversations database
let mockConversations: CampusLoopConversation[] = [
    {
        id: 'conv_1',
        participantIds: ['1', '2'],
        otherUserId: '2',
        otherUserName: 'Sarah Johnson',
        lastMessage: 'Sure, I can help with that!',
        lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
        unreadCount: 2,
    },
];

// Mock messages database
let mockMessages: CampusLoopMessage[] = [
    {
        id: 'msg_1',
        conversationId: 'conv_1',
        senderId: '1',
        receiverId: '2',
        content: 'Hey, are you free to work on the assignment tomorrow?',
        status: 'read',
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
    },
    {
        id: 'msg_2',
        conversationId: 'conv_1',
        senderId: '2',
        receiverId: '1',
        content: 'Sure, I can help with that!',
        status: 'delivered',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
    },
];

export const CampusLoopMessageService = {
    /**
     * Get user conversations
     * TODO: Replace with actual API call
     */
    getConversations: async (userId: string): Promise<CampusLoopConversation[]> => {
        await mockDelay();

        // Filter conversations for this user
        const userConversations = mockConversations.filter(conv =>
            conv.participantIds.includes(userId)
        );

        // Sort by last message time
        return userConversations.sort(
            (a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
        );
    },

    /**
     * Get messages for a conversation
     * TODO: Replace with actual API call
     */
    getMessages: async (conversationId: string): Promise<CampusLoopMessage[]> => {
        await mockDelay();

        const messages = mockMessages.filter(msg => msg.conversationId === conversationId);

        // Sort by date (oldest first for chat display)
        return messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    },

    /**
     * Send message
     * TODO: Replace with actual API call
     */
    sendMessage: async (
        senderId: string,
        data: CampusLoopSendMessageData
    ): Promise<CampusLoopMessage> => {
        await mockDelay(400);

        const newMessage: CampusLoopMessage = {
            id: `msg_${Date.now()}`,
            conversationId: data.conversationId,
            senderId,
            receiverId: data.receiverId,
            content: data.content,
            status: 'sent',
            createdAt: new Date(),
        };

        mockMessages.push(newMessage);

        // Update conversation
        const conversation = mockConversations.find(c => c.id === data.conversationId);
        if (conversation) {
            conversation.lastMessage = data.content;
            conversation.lastMessageTime = new Date();
        }

        // Simulate delivery after delay
        setTimeout(() => {
            newMessage.status = 'delivered';
        }, 1000);

        return newMessage;
    },

    /**
     * Mark conversation as read
     * TODO: Replace with actual API call
     */
    markAsRead: async (conversationId: string): Promise<void> => {
        await mockDelay(200);

        const conversation = mockConversations.find(c => c.id === conversationId);
        if (conversation) {
            conversation.unreadCount = 0;
        }

        // Mark messages as read
        mockMessages
            .filter(msg => msg.conversationId === conversationId)
            .forEach(msg => {
                msg.status = 'read';
            });
    },

    /**
     * Create or get conversation with user
     * TODO: Replace with actual API call
     */
    getOrCreateConversation: async (
        userId: string,
        otherUserId: string,
        otherUserName: string
    ): Promise<CampusLoopConversation> => {
        await mockDelay(500);

        // Check if conversation exists
        const existing = mockConversations.find(
            conv =>
                conv.participantIds.includes(userId) && conv.participantIds.includes(otherUserId)
        );

        if (existing) {
            return existing;
        }

        // Create new conversation
        const newConversation: CampusLoopConversation = {
            id: `conv_${Date.now()}`,
            participantIds: [userId, otherUserId],
            otherUserId,
            otherUserName,
            lastMessage: '',
            lastMessageTime: new Date(),
            unreadCount: 0,
        };

        mockConversations.push(newConversation);
        return newConversation;
    },
};
