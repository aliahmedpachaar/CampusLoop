import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { apiService } from '../services/api';
import { API_CONFIG } from '../config/api';
import { useCampusLoopAuth } from './AuthContext';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    activityId?: string;
    senderName?: string;
    senderAvatar?: string;
    createdAt: Date;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markRead: (id: string) => Promise<void>;
    markAllRead: () => Promise<void>;
    refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const transform = (n: any): Notification => ({
    id:           n._id || n.id,
    type:         n.type,
    title:        n.title,
    message:      n.message,
    isRead:       n.isRead,
    activityId:   n.activity?._id || n.activity,
    senderName:   n.sender?.fullName,
    senderAvatar: n.sender?.avatar,
    createdAt:    new Date(n.createdAt),
});

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { state: authState } = useCampusLoopAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const socketRef = useRef<Socket | null>(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const refresh = async () => {
        if (!authState.isAuthenticated) return;
        try {
            const res = await apiService.get<any[]>(API_CONFIG.ENDPOINTS.NOTIFICATIONS);
            if (res.success && res.data) setNotifications(res.data.map(transform));
        } catch {}
    };

    // Load on auth + connect socket
    useEffect(() => {
        if (!authState.isAuthenticated || !authState.user) return;

        refresh();

        const socket = io(API_CONFIG.BASE_URL, { transports: ['websocket'] });
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join', authState.user!.id);
        });

        socket.on('newNotification', () => {
            refresh();
        });

        return () => {
            socket.disconnect();
        };
    }, [authState.isAuthenticated, authState.user?.id]);

    const markRead = async (id: string) => {
        try {
            await apiService.put(API_CONFIG.ENDPOINTS.MARK_READ(id));
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch {}
    };

    const markAllRead = async () => {
        try {
            await apiService.put(API_CONFIG.ENDPOINTS.MARK_ALL_READ);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch {}
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, refresh }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
    return ctx;
};
