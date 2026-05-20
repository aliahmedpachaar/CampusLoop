import React, { useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList,
    TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { CampusLoopSpacing, CampusLoopTypography, CampusLoopBorderRadius, CampusLoopShadows } from '../../constants/theme';
import { formatRelativeTime } from '../../utils/formatting';

const typeConfig: Record<string, { icon: string; color: string }> = {
    activity_join:    { icon: '👋', color: '#0D9488' },
    activity_leave:   { icon: '🚪', color: '#F97316' },
    activity_update:  { icon: '📢', color: '#0EA5E9' },
    activity_cancelled: { icon: '❌', color: '#EF4444' },
    new_message:      { icon: '💬', color: '#8B5CF6' },
    welcome:          { icon: '🎉', color: '#10B981' },
};

export const NotificationsScreen: React.FC<any> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();
    const { notifications, unreadCount, markRead, markAllRead, refresh } = useNotifications();

    useEffect(() => { refresh(); }, []);

    const handlePress = async (id: string) => {
        await markRead(id);
    };

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        const config = typeConfig[item.type] || { icon: '🔔', color: colors.primary };
        return (
            <Animated.View entering={FadeInDown.delay(index * 40).duration(300)}>
                <TouchableOpacity
                    style={[
                        styles.card,
                        { backgroundColor: item.isRead ? colors.surface : colors.primary + '0D', borderColor: item.isRead ? colors.border : colors.primary + '30' }
                    ]}
                    onPress={() => handlePress(item.id)}
                    activeOpacity={0.8}
                >
                    <View style={[styles.iconBox, { backgroundColor: config.color + '20' }]}>
                        <Text style={styles.iconText}>{config.icon}</Text>
                    </View>
                    <View style={styles.content}>
                        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                        <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>
                            {item.message}
                        </Text>
                        <Text style={[styles.time, { color: colors.textTertiary }]}>
                            {formatRelativeTime(item.createdAt)}
                        </Text>
                    </View>
                    {!item.isRead && (
                        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                    )}
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={markAllRead}>
                        <Text style={[styles.markAll, { color: colors.primary }]}>Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={notifications}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                onRefresh={refresh}
                refreshing={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyEmoji}>🔔</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            No notifications yet.{'\n'}Join activities to get updates!
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container:   { flex: 1 },
    header:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: CampusLoopSpacing.base, paddingVertical: CampusLoopSpacing.md, borderBottomWidth: 1 },
    backBtn:     { marginRight: CampusLoopSpacing.md, padding: 4 },
    headerTitle: { flex: 1, fontSize: CampusLoopTypography.fontSize.xl, fontWeight: CampusLoopTypography.fontWeight.bold },
    markAll:     { fontSize: CampusLoopTypography.fontSize.sm, fontWeight: CampusLoopTypography.fontWeight.medium },
    list:        { padding: CampusLoopSpacing.base, paddingBottom: 100 },
    card:        { flexDirection: 'row', alignItems: 'center', borderRadius: CampusLoopBorderRadius.lg, padding: CampusLoopSpacing.md, marginBottom: CampusLoopSpacing.sm, borderWidth: 1, ...CampusLoopShadows.sm },
    iconBox:     { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: CampusLoopSpacing.md },
    iconText:    { fontSize: 22 },
    content:     { flex: 1 },
    title:       { fontSize: CampusLoopTypography.fontSize.base, fontWeight: CampusLoopTypography.fontWeight.semibold, marginBottom: 2 },
    message:     { fontSize: CampusLoopTypography.fontSize.sm, lineHeight: 18, marginBottom: 4 },
    time:        { fontSize: CampusLoopTypography.fontSize.xs },
    dot:         { width: 8, height: 8, borderRadius: 4, marginLeft: CampusLoopSpacing.sm },
    empty:       { alignItems: 'center', paddingTop: 80 },
    emptyEmoji:  { fontSize: 48, marginBottom: CampusLoopSpacing.md },
    emptyText:   { fontSize: CampusLoopTypography.fontSize.base, textAlign: 'center', lineHeight: 24 },
});

export default NotificationsScreen;
