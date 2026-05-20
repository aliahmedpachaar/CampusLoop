import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TextInput,
    TouchableOpacity, KeyboardAvoidingView, Platform,
    ActivityIndicator, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View as AnimatedView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { io, Socket } from 'socket.io-client';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopAvatar } from '../../components/common/Avatar';
import { apiService } from '../../services/api';
import { API_CONFIG } from '../../config/api';
import {
    CampusLoopSpacing, CampusLoopTypography,
    CampusLoopBorderRadius, CampusLoopShadows,
} from '../../constants/theme';
import { formatRelativeTime } from '../../utils/formatting';

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    createdAt: Date;
}

interface Props {
    navigation: any;
    route: { params: { activityId: string; activityTitle: string; activityType: string } };
}

export const ActivityChatScreen: React.FC<Props> = ({ navigation, route }) => {
    const { activityId, activityTitle, activityType } = route.params;
    const { colors } = useCampusLoopTheme();
    const { state: authState } = useCampusLoopAuth();
    const user = authState.user!;

    const [messages, setMessages]     = useState<Message[]>([]);
    const [inputText, setInputText]   = useState('');
    const [loading, setLoading]       = useState(true);
    const [sending, setSending]       = useState(false);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    const socketRef    = useRef<Socket | null>(null);
    const flatListRef  = useRef<FlatList>(null);
    const typingTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Connect socket ────────────────────────────────────────────────────────
    useEffect(() => {
        const socket = io(API_CONFIG.BASE_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join', user.id);
            socket.emit('joinActivity', activityId);
        });

        socket.on('newMessage', (data: any) => {
            const msg: Message = {
                id:           data.id || data._id || String(Date.now()),
                senderId:     data.senderId || data.sender?._id,
                senderName:   data.senderName || data.sender?.fullName,
                senderAvatar: data.senderAvatar || data.sender?.avatar,
                content:      data.content,
                createdAt:    new Date(data.createdAt),
            };
            setMessages(prev => [...prev, msg]);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        });

        socket.on('userTyping', ({ userId, userName }: { userId: string; userName: string }) => {
            if (userId === user.id) return;
            setTypingUsers(prev => prev.includes(userName) ? prev : [...prev, userName]);
        });

        socket.on('userStopTyping', ({ userId }: { userId: string }) => {
            setTypingUsers(prev => prev.filter(n => n !== userId));
        });

        return () => {
            socket.emit('leaveActivity', activityId);
            socket.disconnect();
        };
    }, [activityId, user.id]);

    // ── Load history ──────────────────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            try {
                const res = await apiService.get<any[]>(API_CONFIG.ENDPOINTS.GET_MESSAGES(activityId));
                if (res.success && res.data) {
                    const formatted: Message[] = res.data.map((m: any) => ({
                        id:           m._id,
                        senderId:     m.sender?._id || m.sender,
                        senderName:   m.sender?.fullName || 'Unknown',
                        senderAvatar: m.sender?.avatar,
                        content:      m.content,
                        createdAt:    new Date(m.createdAt),
                    }));
                    setMessages(formatted);
                    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
                }
            } catch {
                // no history yet is fine
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [activityId]);

    // ── Typing indicator ──────────────────────────────────────────────────────
    const handleTyping = (text: string) => {
        setInputText(text);
        if (!socketRef.current) return;
        socketRef.current.emit('typing', { activityId, userId: user.id, userName: user.fullName });
        if (typingTimer.current) clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => {
            socketRef.current?.emit('stopTyping', { activityId, userId: user.id });
        }, 1500);
    };

    // ── Send message ──────────────────────────────────────────────────────────
    const handleSend = useCallback(async () => {
        const text = inputText.trim();
        if (!text || sending) return;

        setSending(true);
        setInputText('');
        socketRef.current?.emit('stopTyping', { activityId, userId: user.id });

        const optimistic: Message = {
            id:           `opt_${Date.now()}`,
            senderId:     user.id,
            senderName:   user.fullName,
            senderAvatar: user.profilePicture,
            content:      text,
            createdAt:    new Date(),
        };
        setMessages(prev => [...prev, optimistic]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

        try {
            const res = await apiService.post<any>(API_CONFIG.ENDPOINTS.SEND_MESSAGE(activityId), { content: text });
            if (res.success && res.data) {
                // Broadcast via socket so other users see it
                socketRef.current?.emit('sendMessage', {
                    activityId,
                    id:           res.data._id,
                    senderId:     user.id,
                    senderName:   user.fullName,
                    senderAvatar: user.profilePicture,
                    content:      text,
                    createdAt:    res.data.createdAt,
                });
                // Replace optimistic with real id
                setMessages(prev => prev.map(m =>
                    m.id === optimistic.id ? { ...m, id: res.data._id } : m
                ));
            }
        } catch {
            Alert.alert('Error', 'Failed to send message');
            setMessages(prev => prev.filter(m => m.id !== optimistic.id));
        } finally {
            setSending(false);
        }
    }, [inputText, sending, activityId, user]);

    // ── Render message ────────────────────────────────────────────────────────
    const isMine = (msg: Message) => msg.senderId === user.id;

    const renderMessage = ({ item, index }: { item: Message; index: number }) => {
        const mine       = isMine(item);
        const prevMsg    = index > 0 ? messages[index - 1] : null;
        const showAvatar = !mine && (!prevMsg || prevMsg.senderId !== item.senderId);
        const showName   = !mine && showAvatar;

        return (
            <AnimatedView style={[styles.msgRow, mine ? styles.msgRowMine : styles.msgRowOther]}>
                {!mine && (
                    <View style={styles.avatarSlot}>
                        {showAvatar
                            ? <CampusLoopAvatar name={item.senderName} imageUrl={item.senderAvatar} size={32} />
                            : <View style={{ width: 32 }} />
                        }
                    </View>
                )}
                <View style={[styles.msgCol, mine ? styles.msgColMine : styles.msgColOther]}>
                    {showName && (
                        <Text style={[styles.senderName, { color: colors.textTertiary }]}>{item.senderName}</Text>
                    )}
                    <View style={[
                        styles.bubble,
                        mine
                            ? [styles.bubbleMine, { backgroundColor: colors.primary }]
                            : [styles.bubbleOther, { backgroundColor: colors.surface, borderColor: colors.border }]
                    ]}>
                        <Text style={[styles.bubbleText, { color: mine ? '#FFFFFF' : colors.text }]}>
                            {item.content}
                        </Text>
                    </View>
                    <Text style={[styles.msgTime, { color: colors.textTertiary }, mine && styles.msgTimeMine]}>
                        {formatRelativeTime(item.createdAt)}
                    </Text>
                </View>
            </AnimatedView>
        );
    };

    const categoryEmoji: Record<string, string> = {
        study_group: '📚', assignment_help: '🤝', sports: '⚽',
        movies: '🎬', movie: '🎬', trip: '✈️', trips: '✈️',
        food: '🍕', event: '🎉', events: '🎉',
        project: '💻', project_collab: '💻', other: '💡',
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerEmoji}>{categoryEmoji[activityType] || '💬'}</Text>
                    <View>
                        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
                            {activityTitle}
                        </Text>
                        <Text style={[styles.headerSub, { color: colors.textTertiary }]}>Group Chat</Text>
                    </View>
                </View>
            </View>

            {/* Messages */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color={colors.primary} size="large" />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.msgList}
                    ListEmptyComponent={
                        <View style={styles.emptyChat}>
                            <Text style={styles.emptyChatEmoji}>💬</Text>
                            <Text style={[styles.emptyChatText, { color: colors.textSecondary }]}>
                                No messages yet.{'\n'}Say hello to the group!
                            </Text>
                        </View>
                    }
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                />
            )}

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
                <View style={[styles.typingBar, { backgroundColor: colors.background }]}>
                    <Text style={[styles.typingText, { color: colors.textTertiary }]}>
                        {typingUsers[0]} is typing…
                    </Text>
                </View>
            )}

            {/* Input */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={[styles.inputRow, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                        placeholder="Message…"
                        placeholderTextColor={colors.textTertiary}
                        value={inputText}
                        onChangeText={handleTyping}
                        multiline
                        maxLength={500}
                        returnKeyType="default"
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, { backgroundColor: inputText.trim() ? colors.primary : colors.border }]}
                        onPress={handleSend}
                        disabled={!inputText.trim() || sending}
                        activeOpacity={0.8}
                    >
                        {sending
                            ? <ActivityIndicator color="#fff" size="small" />
                            : <Ionicons name="send" size={18} color="#FFFFFF" />
                        }
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container:     { flex: 1 },
    header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: CampusLoopSpacing.base, paddingVertical: CampusLoopSpacing.md, borderBottomWidth: 1, ...CampusLoopShadows.sm },
    backBtn:       { marginRight: CampusLoopSpacing.md, padding: 4 },
    headerInfo:    { flex: 1, flexDirection: 'row', alignItems: 'center', gap: CampusLoopSpacing.sm },
    headerEmoji:   { fontSize: 28 },
    headerTitle:   { fontSize: CampusLoopTypography.fontSize.base, fontWeight: CampusLoopTypography.fontWeight.semibold, flex: 1 },
    headerSub:     { fontSize: CampusLoopTypography.fontSize.xs, marginTop: 1 },
    center:        { flex: 1, alignItems: 'center', justifyContent: 'center' },
    msgList:       { padding: CampusLoopSpacing.base, paddingBottom: CampusLoopSpacing.md },
    msgRow:        { flexDirection: 'row', marginBottom: CampusLoopSpacing.xs },
    msgRowMine:    { justifyContent: 'flex-end' },
    msgRowOther:   { justifyContent: 'flex-start' },
    avatarSlot:    { marginRight: CampusLoopSpacing.sm, alignSelf: 'flex-end' },
    msgCol:        { maxWidth: '75%' },
    msgColMine:    { alignItems: 'flex-end' },
    msgColOther:   { alignItems: 'flex-start' },
    senderName:    { fontSize: CampusLoopTypography.fontSize.xs, marginBottom: 2, marginLeft: 4 },
    bubble:        { borderRadius: CampusLoopBorderRadius.lg, paddingHorizontal: CampusLoopSpacing.md, paddingVertical: CampusLoopSpacing.sm },
    bubbleMine:    { borderBottomRightRadius: 4 },
    bubbleOther:   { borderBottomLeftRadius: 4, borderWidth: 1 },
    bubbleText:    { fontSize: CampusLoopTypography.fontSize.base, lineHeight: 22 },
    msgTime:       { fontSize: 10, marginTop: 2, marginLeft: 4 },
    msgTimeMine:   { marginRight: 4 },
    typingBar:     { paddingHorizontal: CampusLoopSpacing.xl, paddingVertical: 4 },
    typingText:    { fontSize: CampusLoopTypography.fontSize.xs, fontStyle: 'italic' },
    inputRow:      { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: CampusLoopSpacing.md, paddingVertical: CampusLoopSpacing.md, borderTopWidth: 1, gap: CampusLoopSpacing.sm },
    input:         { flex: 1, borderRadius: CampusLoopBorderRadius.xl, paddingHorizontal: CampusLoopSpacing.md, paddingVertical: Platform.OS === 'ios' ? 10 : 8, fontSize: CampusLoopTypography.fontSize.base, maxHeight: 100, borderWidth: 1 },
    sendBtn:       { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    emptyChat:     { alignItems: 'center', paddingTop: 80 },
    emptyChatEmoji: { fontSize: 48, marginBottom: CampusLoopSpacing.md },
    emptyChatText: { fontSize: CampusLoopTypography.fontSize.base, textAlign: 'center', lineHeight: 24 },
});

export default ActivityChatScreen;
