/**
 * CampusLoop Notifications Screen
 * Displays user notifications
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { CampusLoopSpacing, CampusLoopTypography } from '../../constants/theme';
import { CampusLoopCard } from '../../components/common/Card';
import { formatRelativeTime } from '../../utils/formatting';

// Mock notifications data
const mockNotifications = [
    {
        id: '1',
        type: 'like',
        text: 'Sarah Johnson liked your post',
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        read: false,
    },
    {
        id: '2',
        type: 'comment',
        text: 'David Chen commented on your post: "Great idea!"',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true,
    },
    {
        id: '3',
        type: 'join',
        text: 'Emily Wilson joined your study group',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: true,
    },
];

export const NotificationsScreen: React.FC<any> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();

    const renderItem = ({ item }: { item: any }) => (
        <CampusLoopCard style={[styles.notificationCard, !item.read ? { backgroundColor: colors.primary + '10' } : undefined]}>
            <View style={styles.notificationContent}>
                <Text style={styles.icon}>{item.type === 'like' ? '❤️' : item.type === 'comment' ? '💬' : '👋'}</Text>
                <View style={styles.textContainer}>
                    <Text style={[styles.notificationText, { color: colors.text }]}>{item.text}</Text>
                    <Text style={[styles.timeText, { color: colors.textSecondary }]}>{formatRelativeTime(item.createdAt)}</Text>
                </View>
                {!item.read && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
            </View>
        </CampusLoopCard>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={mockNotifications}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No notifications yet</Text>
                    </View>
                }
            />
        </View>
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: CampusLoopSpacing.base,
        paddingVertical: CampusLoopSpacing.md,
        borderBottomWidth: 1,
    },
    backIcon: {
        fontSize: 24,
    },
    headerTitle: {
        fontSize: CampusLoopTypography.fontSize.xl,
        fontWeight: CampusLoopTypography.fontWeight.bold,
    },
    listContent: {
        padding: CampusLoopSpacing.base,
    },
    notificationCard: {
        marginBottom: CampusLoopSpacing.sm,
        padding: CampusLoopSpacing.md,
    },
    notificationContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        fontSize: 24,
        marginRight: CampusLoopSpacing.md,
    },
    textContainer: {
        flex: 1,
    },
    notificationText: {
        fontSize: CampusLoopTypography.fontSize.base,
        marginBottom: 4,
    },
    timeText: {
        fontSize: CampusLoopTypography.fontSize.xs,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: CampusLoopSpacing.sm,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: CampusLoopTypography.fontSize.base,
    },
});
