/**
 * CampusLoop Home Screen
 * Main feed with featured activities and quick actions
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    ScrollView,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    FadeInDown,
    FadeIn,
} from 'react-native-reanimated';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopAvatar } from '../../components/common/Avatar';
import { CampusLoopActivityService } from '../../services/activityService';
import { CampusLoopPostService } from '../../services/postService';
import { CampusLoopActivity } from '../../types/activity';
import { CampusLoopPost, CampusLoopPostCategory } from '../../types/post';
import { PostCard } from '../../components/posts/PostCard';
import { formatRelativeTime } from '../../utils/formatting';
import {
    CampusLoopSpacing,
    CampusLoopTypography,
    CampusLoopBorderRadius,
    CampusLoopShadows,
} from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../../context/NotificationContext';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
    navigation: any;
}

// Featured Activity Card
const FeaturedActivityCard: React.FC<{
    activity: CampusLoopActivity;
    onPress: () => void;
    colors: any;
}> = ({ activity, onPress, colors }) => {
    const categoryColors: Record<string, { bg: string; icon: string }> = {
        study_group: { bg: '#0D9488', icon: '📚' },
        assignment_help: { bg: '#F59E0B', icon: '🤝' },
        sports: { bg: '#10B981', icon: '⚽' },
        movies: { bg: '#EF4444', icon: '🎬' },
        movie: { bg: '#EF4444', icon: '🎬' },
        trip: { bg: '#0EA5E9', icon: '✈️' },
        trips: { bg: '#0EA5E9', icon: '✈️' },
        food: { bg: '#F97316', icon: '🍕' },
        event: { bg: '#8B5CF6', icon: '🎉' },
        events: { bg: '#8B5CF6', icon: '🎉' },
        project: { bg: '#6366F1', icon: '💻' },
        project_collab: { bg: '#6366F1', icon: '💻' },
        other: { bg: '#64748B', icon: '💡' },
    };
    const cat = categoryColors[activity.type] || { bg: '#64748B', icon: '🎯' };

    return (
        <TouchableOpacity
            style={[styles.featuredCard, { backgroundColor: cat.bg }]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.featuredHeader}>
                <Text style={styles.featuredIcon}>{cat.icon}</Text>
                <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>
                        {activity.currentParticipants}/{activity.maxParticipants}
                    </Text>
                </View>
            </View>
            <Text style={styles.featuredTitle} numberOfLines={2}>
                {activity.title}
            </Text>
            <View style={styles.featuredFooter}>
                <Text style={styles.featuredCreator}>by {activity.creatorName}</Text>
                <View style={styles.featuredTime}>
                    <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.featuredTimeText}>
                        {formatRelativeTime(activity.createdAt)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// Quick Action Button
const QuickActionButton: React.FC<{
    icon: string;
    label: string;
    color: string;
    onPress: () => void;
    bgColor: string;
}> = ({ icon, label, color, onPress, bgColor }) => (
    <TouchableOpacity style={[styles.quickActionBtn, { backgroundColor: bgColor }]} onPress={onPress}>
        <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
            <Text style={{ fontSize: 22 }}>{icon}</Text>
        </View>
        <Text style={[styles.quickActionLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
);

// Activity Row Item
const ActivityRowItem: React.FC<{
    activity: CampusLoopActivity;
    onPress: () => void;
    colors: any;
    index: number;
}> = ({ activity, onPress, colors, index }) => {
    const categoryIcons: Record<string, string> = {
        study_group: '📚',
        assignment_help: '🤝',
        sports: '⚽',
        movies: '🎬',
        movie: '🎬',
        trip: '✈️',
        trips: '✈️',
        food: '🍕',
        event: '🎉',
        events: '🎉',
        project: '💻',
        project_collab: '💻',
        other: '💡',
    };

    return (
        <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
            <TouchableOpacity
                style={[styles.activityRow, { backgroundColor: colors.surface }]}
                onPress={onPress}
            >
                <View style={[styles.activityRowIcon, { backgroundColor: colors.primary + '10' }]}>
                    <Text style={{ fontSize: 20 }}>{categoryIcons[activity.type] || '🎯'}</Text>
                </View>
                <View style={styles.activityRowContent}>
                    <Text style={[styles.activityRowTitle, { color: colors.text }]} numberOfLines={1}>
                        {activity.title}
                    </Text>
                    <Text style={[styles.activityRowMeta, { color: colors.textTertiary }]}>
                        {activity.creatorName} • {activity.currentParticipants} joined
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
        </Animated.View>
    );
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();
    const { state: authState } = useCampusLoopAuth();
    const { unreadCount } = useNotifications();

    const [featuredActivities, setFeaturedActivities] = useState<CampusLoopActivity[]>([]);
    const [posts, setPosts]               = useState<CampusLoopPost[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CampusLoopPostCategory | 'all'>('all');
    const [refreshing, setRefreshing]     = useState(false);
    const [greeting, setGreeting]         = useState('');

    const postCategories: { key: CampusLoopPostCategory | 'all'; label: string; icon: string }[] = [
        { key: 'all',        label: 'All',        icon: '🌐' },
        { key: 'discussion', label: 'Discussion',  icon: '💬' },
        { key: 'assignment', label: 'Assignment',  icon: '📝' },
        { key: 'coding',     label: 'Coding',      icon: '💻' },
        { key: 'activities', label: 'Activities',  icon: '🎯' },
        { key: 'sports',     label: 'Sports',      icon: '⚽' },
        { key: 'events',     label: 'Events',      icon: '🎉' },
    ];

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
        loadAll();
    }, []);

    useEffect(() => {
        loadPosts(selectedCategory);
    }, [selectedCategory]);

    const loadAll = async () => {
        await Promise.all([loadActivities(), loadPosts(selectedCategory)]);
        setRefreshing(false);
    };

    const loadActivities = async () => {
        try {
            const data = await CampusLoopActivityService.getActivities(undefined, authState.user?.id);
            setFeaturedActivities(data.slice(0, 5));
        } catch {}
    };

    const loadPosts = async (category: CampusLoopPostCategory | 'all') => {
        try {
            const data = await CampusLoopPostService.getPosts(category === 'all' ? undefined : category);
            setPosts(data);
        } catch {}
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadAll();
    };

    const handleLike = useCallback(async (postId: string) => {
        try {
            const result = await CampusLoopPostService.likePost(postId, authState.user?.id || '');
            setPosts(prev => prev.map(p =>
                p.id === postId ? { ...p, likesCount: result.likesCount, isLiked: result.isLiked } : p
            ));
        } catch {}
    }, [authState.user?.id]);

    const userName = authState.user?.fullName?.split(' ')[0] || 'there';

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* Header */}
                <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.header}
                >
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.greeting}>{greeting} 👋</Text>
                            <Text style={styles.userName}>{userName}</Text>
                        </View>
                        <View style={styles.headerActions}>
                            <TouchableOpacity
                                style={styles.headerBtn}
                                onPress={() => navigation.navigate('Notifications')}
                            >
                                <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
                                {unreadCount > 0 && (
                                    <View style={styles.notifBadge}>
                                        <Text style={styles.notifBadgeText}>
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.headerBtn}
                                onPress={() => navigation.navigate('Profile')}
                            >
                                <CampusLoopAvatar
                                    name={authState.user?.fullName || 'U'}
                                    size="small"
                                    imageUri={authState.user?.profilePicture}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Quick Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{featuredActivities.length}</Text>
                            <Text style={styles.statLabel}>Happening</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{authState.user?.activitiesJoined?.length ?? 0}</Text>
                            <Text style={styles.statLabel}>Joined</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{authState.user?.activitiesCreated?.length ?? 0}</Text>
                            <Text style={styles.statLabel}>Created</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <QuickActionButton
                        icon="📚"
                        label="Study"
                        color="#0D9488"
                        bgColor={colors.surface}
                        onPress={() => navigation.navigate('CreateActivity')}
                    />
                    <QuickActionButton
                        icon="🤝"
                        label="Help"
                        color="#F59E0B"
                        bgColor={colors.surface}
                        onPress={() => navigation.navigate('CreateActivity')}
                    />
                    <QuickActionButton
                        icon="🎬"
                        label="Movies"
                        color="#EF4444"
                        bgColor={colors.surface}
                        onPress={() => navigation.navigate('CreateActivity')}
                    />
                    <QuickActionButton
                        icon="✈️"
                        label="Trips"
                        color="#0EA5E9"
                        bgColor={colors.surface}
                        onPress={() => navigation.navigate('CreateActivity')}
                    />
                </View>

                {/* Featured Activities */}
                {featuredActivities.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                🔥 Happening Now
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Activities')}>
                                <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.featuredList}
                        >
                            {featuredActivities.map((activity, index) => (
                                <FeaturedActivityCard
                                    key={activity.id}
                                    activity={activity}
                                    onPress={() => navigation.navigate('ActivityDetail', { activityId: activity.id })}
                                    colors={colors}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Campus Feed */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>🗞️ Campus Feed</Text>
                    </View>

                    {/* Category chips */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryChips}
                    >
                        {postCategories.map(cat => (
                            <TouchableOpacity
                                key={cat.key}
                                style={[
                                    styles.chip,
                                    selectedCategory === cat.key
                                        ? { backgroundColor: colors.primary }
                                        : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }
                                ]}
                                onPress={() => setSelectedCategory(cat.key)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.chipIcon}>{cat.icon}</Text>
                                <Text style={[styles.chipLabel, { color: selectedCategory === cat.key ? '#FFFFFF' : colors.text }]}>
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Posts */}
                    <View style={styles.postsList}>
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onLike={handleLike}
                                    onComment={() => {}}
                                />
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyIcon}>📭</Text>
                                <Text style={[styles.emptyTitle, { color: colors.text }]}>No posts yet</Text>
                                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                    Be the first to post something!
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Spacer for FAB */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateActivity')}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.fabGradient}
                >
                    <Ionicons name="add" size={28} color="#FFFFFF" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 60,
        paddingHorizontal: CampusLoopSpacing.xl,
        paddingBottom: CampusLoopSpacing.xl,
        borderBottomLeftRadius: CampusLoopBorderRadius['2xl'],
        borderBottomRightRadius: CampusLoopBorderRadius['2xl'],
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: CampusLoopSpacing.xl,
    },
    greeting: {
        fontSize: CampusLoopTypography.fontSize.base,
        color: 'rgba(255,255,255,0.8)',
    },
    userName: {
        fontSize: CampusLoopTypography.fontSize['2xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        color: '#FFFFFF',
    },
    headerActions: {
        flexDirection: 'row',
        gap: CampusLoopSpacing.md,
    },
    headerBtn: {
        position: 'relative',
    },
    notifBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notifBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: CampusLoopBorderRadius.lg,
        padding: CampusLoopSpacing.base,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: CampusLoopTypography.fontSize.xl,
        fontWeight: CampusLoopTypography.fontWeight.bold,
        color: '#FFFFFF',
    },
    statLabel: {
        fontSize: CampusLoopTypography.fontSize.xs,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    quickActions: {
        flexDirection: 'row',
        paddingHorizontal: CampusLoopSpacing.base,
        marginTop: -CampusLoopSpacing.xl,
        gap: CampusLoopSpacing.sm,
    },
    quickActionBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: CampusLoopSpacing.md,
        borderRadius: CampusLoopBorderRadius.lg,
        ...CampusLoopShadows.md,
    },
    quickActionIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    quickActionLabel: {
        fontSize: CampusLoopTypography.fontSize.xs,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    section: {
        marginTop: CampusLoopSpacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: CampusLoopSpacing.xl,
        marginBottom: CampusLoopSpacing.md,
    },
    sectionTitle: {
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.bold,
    },
    seeAll: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    featuredList: {
        paddingHorizontal: CampusLoopSpacing.base,
        gap: CampusLoopSpacing.md,
    },
    featuredCard: {
        width: width * 0.65,
        padding: CampusLoopSpacing.base,
        borderRadius: CampusLoopBorderRadius.xl,
        ...CampusLoopShadows.md,
    },
    featuredHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: CampusLoopSpacing.md,
    },
    featuredIcon: {
        fontSize: 28,
    },
    featuredBadge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: CampusLoopSpacing.sm,
        paddingVertical: 4,
        borderRadius: CampusLoopBorderRadius.full,
    },
    featuredBadgeText: {
        color: '#FFFFFF',
        fontSize: CampusLoopTypography.fontSize.xs,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    featuredTitle: {
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.bold,
        color: '#FFFFFF',
        marginBottom: CampusLoopSpacing.md,
    },
    featuredFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    featuredCreator: {
        fontSize: CampusLoopTypography.fontSize.xs,
        color: 'rgba(255,255,255,0.8)',
    },
    featuredTime: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    featuredTimeText: {
        fontSize: CampusLoopTypography.fontSize.xs,
        color: 'rgba(255,255,255,0.8)',
    },
    activityList: {
        paddingHorizontal: CampusLoopSpacing.base,
        gap: CampusLoopSpacing.sm,
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: CampusLoopSpacing.md,
        borderRadius: CampusLoopBorderRadius.lg,
        ...CampusLoopShadows.sm,
    },
    activityRowIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: CampusLoopSpacing.md,
    },
    activityRowContent: {
        flex: 1,
    },
    activityRowTitle: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
        marginBottom: 2,
    },
    activityRowMeta: {
        fontSize: CampusLoopTypography.fontSize.xs,
    },
    categoryChips: {
        paddingHorizontal: CampusLoopSpacing.xl,
        paddingBottom: CampusLoopSpacing.md,
        gap: CampusLoopSpacing.sm,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: CampusLoopSpacing.md,
        paddingVertical: CampusLoopSpacing.sm,
        borderRadius: CampusLoopBorderRadius.full,
        gap: 4,
    },
    chipIcon: { fontSize: 14 },
    chipLabel: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    postsList: {
        paddingHorizontal: CampusLoopSpacing.base,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: CampusLoopSpacing['3xl'],
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: CampusLoopSpacing.md,
    },
    emptyTitle: {
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
        marginBottom: CampusLoopSpacing.xs,
    },
    emptyText: {
        fontSize: CampusLoopTypography.fontSize.sm,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        right: CampusLoopSpacing.xl,
        bottom: CampusLoopSpacing.xl,
        borderRadius: 28,
        overflow: 'hidden',
        ...CampusLoopShadows.lg,
    },
    fabGradient: {
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default HomeScreen;

