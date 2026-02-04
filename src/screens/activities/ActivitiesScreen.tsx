/**
 * CampusLoop Activities Screen
 * NomadTable-inspired activity discovery and creation
 * Where students connect for activities, study groups, trips & more
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    StatusBar,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    FadeIn,
    FadeInDown,
    FadeInRight,
    SlideInRight,
    Layout,
} from 'react-native-reanimated';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopAvatar } from '../../components/common/Avatar';
import { CampusLoopActivityService } from '../../services/activityService';
import { CampusLoopActivity } from '../../types/activity';
import { formatRelativeTime } from '../../utils/formatting';
import {
    CampusLoopSpacing,
    CampusLoopTypography,
    CampusLoopBorderRadius,
    CampusLoopShadows,
    ActivityCategories,
} from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface ActivitiesScreenProps {
    navigation: any;
}

type ActivityCategoryKey = keyof typeof ActivityCategories | 'all';

const categories: { key: ActivityCategoryKey; icon: string; label: string; color: string }[] = [
    { key: 'all', icon: '🎯', label: 'All', color: '#64748B' },
    { key: 'study', icon: '📚', label: 'Study', color: '#0D9488' },
    { key: 'help', icon: '🤝', label: 'Help', color: '#F59E0B' },
    { key: 'sports', icon: '⚽', label: 'Sports', color: '#10B981' },
    { key: 'movies', icon: '🎬', label: 'Movies', color: '#EF4444' },
    { key: 'trips', icon: '✈️', label: 'Trips', color: '#0EA5E9' },
    { key: 'food', icon: '🍕', label: 'Food', color: '#F97316' },
    { key: 'events', icon: '🎉', label: 'Events', color: '#8B5CF6' },
];

// Activity Card Component
interface ActivityCardProps {
    activity: CampusLoopActivity;
    onPress: () => void;
    onJoin: () => void;
    colors: any;
    index: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onPress, onJoin, colors, index }) => {
    const scale = useSharedValue(1);
    const isJoined = activity.isJoined;

    const getCategoryInfo = (type: string) => {
        const typeToCategory: Record<string, ActivityCategoryKey> = {
            study_group: 'study',
            assignment_help: 'help',
            sports: 'sports',
            event: 'events',
            project_collab: 'study',
        };
        const categoryKey = typeToCategory[type] || 'events';
        return categories.find(c => c.key === categoryKey) || categories[0];
    };

    const categoryInfo = getCategoryInfo(activity.type);
    const spotsLeft = activity.maxParticipants - activity.currentParticipants;

    const cardStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 100).duration(400)}
            layout={Layout.springify()}
            style={[styles.activityCard, { backgroundColor: colors.surface }, cardStyle]}
        >
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                {/* Header */}
                <View style={styles.cardHeader}>
                    <View style={styles.creatorInfo}>
                        <CampusLoopAvatar
                            name={activity.creatorName}
                            size="small"
                            imageUri={activity.creatorAvatar}
                        />
                        <View style={styles.creatorText}>
                            <Text style={[styles.creatorName, { color: colors.text }]}>
                                {activity.creatorName}
                            </Text>
                            <Text style={[styles.timeAgo, { color: colors.textTertiary }]}>
                                {formatRelativeTime(activity.createdAt)}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color + '15' }]}>
                        <Text style={styles.categoryIcon}>{categoryInfo.icon}</Text>
                        <Text style={[styles.categoryLabel, { color: categoryInfo.color }]}>
                            {categoryInfo.label}
                        </Text>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                    <Text style={[styles.activityTitle, { color: colors.text }]}>
                        {activity.title}
                    </Text>
                    <Text
                        style={[styles.activityDescription, { color: colors.textSecondary }]}
                        numberOfLines={2}
                    >
                        {activity.description}
                    </Text>
                </View>

                {/* Meta Info */}
                <View style={styles.metaRow}>
                    {activity.scheduledDate && (
                        <View style={styles.metaItem}>
                            <Ionicons name="calendar-outline" size={14} color={colors.textTertiary} />
                            <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                                {new Date(activity.scheduledDate).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </Text>
                        </View>
                    )}
                    {activity.location && (
                        <View style={styles.metaItem}>
                            <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
                            <Text style={[styles.metaText, { color: colors.textTertiary }]} numberOfLines={1}>
                                {activity.location}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Footer */}
                <View style={styles.cardFooter}>
                    <View style={styles.participantsInfo}>
                        <View style={styles.avatarStack}>
                            {[...Array(Math.min(3, activity.currentParticipants))].map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.stackedAvatar,
                                        { left: i * 16, backgroundColor: colors.primary, borderColor: colors.surface }
                                    ]}
                                >
                                    <Text style={styles.avatarText}>
                                        {String.fromCharCode(65 + i)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <Text style={[styles.participantsText, { color: colors.textSecondary, marginLeft: Math.min(3, activity.currentParticipants) * 16 + 8 }]}>
                            {activity.currentParticipants}/{activity.maxParticipants} joined
                            {spotsLeft > 0 && spotsLeft <= 3 && (
                                <Text style={{ color: colors.secondary }}> • {spotsLeft} spots left!</Text>
                            )}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.joinButton,
                            isJoined
                                ? { backgroundColor: colors.success + '15', borderColor: colors.success }
                                : { backgroundColor: colors.primary, borderColor: colors.primary }
                        ]}
                        onPress={onJoin}
                        disabled={isJoined || spotsLeft === 0}
                    >
                        {isJoined ? (
                            <>
                                <Ionicons name="checkmark" size={16} color={colors.success} />
                                <Text style={[styles.joinButtonText, { color: colors.success }]}>Joined</Text>
                            </>
                        ) : spotsLeft === 0 ? (
                            <Text style={[styles.joinButtonText, { color: colors.textTertiary }]}>Full</Text>
                        ) : (
                            <>
                                <Ionicons name="add" size={16} color="#FFFFFF" />
                                <Text style={[styles.joinButtonText, { color: '#FFFFFF' }]}>Join</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export const ActivitiesScreen: React.FC<ActivitiesScreenProps> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();
    const { state: authState } = useCampusLoopAuth();

    const [activities, setActivities] = useState<CampusLoopActivity[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ActivityCategoryKey>('all');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadActivities();
    }, [selectedCategory]);

    const loadActivities = async () => {
        try {
            const data = await CampusLoopActivityService.getActivities(undefined, authState.user?.id);
            setActivities(data);
        } catch (error) {
            console.error('Error loading activities:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadActivities();
    };

    const handleJoinActivity = async (activityId: string) => {
        try {
            const success = await CampusLoopActivityService.joinActivity(
                activityId,
                authState.user!.id
            );
            if (success) {
                // Update local state
                setActivities(prev =>
                    prev.map(a => a.id === activityId
                        ? { ...a, isJoined: true, currentParticipants: a.currentParticipants + 1 }
                        : a
                    )
                );
            }
        } catch (error) {
            console.error('Error joining activity:', error);
        }
    };

    const filteredActivities = selectedCategory === 'all'
        ? activities
        : activities.filter(a => {
            const typeToCategory: Record<string, string> = {
                study_group: 'study',
                assignment_help: 'help',
                sports: 'sports',
                movies: 'events',
                trip: 'events',
                food: 'events',
                event: 'events',
                project: 'study',
                other: 'events',
            };
            return typeToCategory[a.type] === selectedCategory;
        });

    const renderActivityCard = ({ item, index }: { item: CampusLoopActivity; index: number }) => (
        <ActivityCard
            activity={item}
            onPress={() => navigation.navigate('ActivityDetail', { activityId: item.id })}
            onJoin={() => handleJoinActivity(item.id)}
            colors={colors}
            index={index}
        />
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.headerTitle}>Activities</Text>
                        <Text style={styles.headerSubtitle}>
                            Find your next adventure 🚀
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={() => navigation.navigate('SearchActivities')}
                    >
                        <Ionicons name="search" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Category Filter */}
            <View style={[styles.categoryContainer, { backgroundColor: colors.surface }]}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryScroll}
                >
                    {categories.map((category) => {
                        const isSelected = selectedCategory === category.key;
                        return (
                            <TouchableOpacity
                                key={category.key}
                                style={[
                                    styles.categoryChip,
                                    isSelected && { backgroundColor: category.color + '15' },
                                ]}
                                onPress={() => setSelectedCategory(category.key)}
                            >
                                <Text style={styles.categoryChipIcon}>{category.icon}</Text>
                                <Text
                                    style={[
                                        styles.categoryChipLabel,
                                        { color: isSelected ? category.color : colors.textSecondary },
                                    ]}
                                >
                                    {category.label}
                                </Text>
                                {isSelected && (
                                    <View style={[styles.selectedDot, { backgroundColor: category.color }]} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity
                    style={[styles.quickAction, { backgroundColor: colors.surface }]}
                    onPress={() => navigation.navigate('CreateActivity', { type: 'study_group' })}
                >
                    <View style={[styles.quickActionIcon, { backgroundColor: '#0D9488' + '15' }]}>
                        <Text style={{ fontSize: 20 }}>📚</Text>
                    </View>
                    <Text style={[styles.quickActionText, { color: colors.text }]}>Study</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.quickAction, { backgroundColor: colors.surface }]}
                    onPress={() => navigation.navigate('CreateActivity', { type: 'event' })}
                >
                    <View style={[styles.quickActionIcon, { backgroundColor: '#EF4444' + '15' }]}>
                        <Text style={{ fontSize: 20 }}>🎬</Text>
                    </View>
                    <Text style={[styles.quickActionText, { color: colors.text }]}>Movie</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.quickAction, { backgroundColor: colors.surface }]}
                    onPress={() => navigation.navigate('CreateActivity', { type: 'sports' })}
                >
                    <View style={[styles.quickActionIcon, { backgroundColor: '#10B981' + '15' }]}>
                        <Text style={{ fontSize: 20 }}>⚽</Text>
                    </View>
                    <Text style={[styles.quickActionText, { color: colors.text }]}>Sports</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.quickAction, { backgroundColor: colors.surface }]}
                    onPress={() => navigation.navigate('CreateActivity', { type: 'event' })}
                >
                    <View style={[styles.quickActionIcon, { backgroundColor: '#0EA5E9' + '15' }]}>
                        <Text style={{ fontSize: 20 }}>✈️</Text>
                    </View>
                    <Text style={[styles.quickActionText, { color: colors.text }]}>Trip</Text>
                </TouchableOpacity>
            </View>

            {/* Activities List */}
            <FlatList
                data={filteredActivities}
                keyExtractor={(item) => item.id}
                renderItem={renderActivityCard}
                contentContainerStyle={styles.activitiesList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🎯</Text>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>
                            No activities yet
                        </Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            Be the first to create an activity and connect with fellow students!
                        </Text>
                        <TouchableOpacity
                            style={[styles.emptyButton, { backgroundColor: colors.primary }]}
                            onPress={() => navigation.navigate('CreateActivity')}
                        >
                            <Text style={styles.emptyButtonText}>Create Activity</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {/* Floating Action Button */}
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
        paddingBottom: CampusLoopSpacing.lg,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: CampusLoopTypography.fontSize['2xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: CampusLoopTypography.fontSize.sm,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    searchButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryContainer: {
        paddingVertical: CampusLoopSpacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    categoryScroll: {
        paddingHorizontal: CampusLoopSpacing.base,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: CampusLoopSpacing.md,
        paddingVertical: CampusLoopSpacing.sm,
        borderRadius: CampusLoopBorderRadius.full,
        marginRight: CampusLoopSpacing.sm,
    },
    categoryChipIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    categoryChipLabel: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    selectedDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginLeft: 6,
    },
    quickActions: {
        flexDirection: 'row',
        paddingHorizontal: CampusLoopSpacing.base,
        paddingVertical: CampusLoopSpacing.md,
        gap: CampusLoopSpacing.sm,
    },
    quickAction: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: CampusLoopSpacing.md,
        borderRadius: CampusLoopBorderRadius.lg,
        ...CampusLoopShadows.sm,
    },
    quickActionIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    quickActionText: {
        fontSize: CampusLoopTypography.fontSize.xs,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    activitiesList: {
        padding: CampusLoopSpacing.base,
        paddingBottom: 100,
    },
    activityCard: {
        borderRadius: CampusLoopBorderRadius.xl,
        marginBottom: CampusLoopSpacing.base,
        padding: CampusLoopSpacing.base,
        ...CampusLoopShadows.base,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: CampusLoopSpacing.md,
    },
    creatorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    creatorText: {
        marginLeft: CampusLoopSpacing.sm,
    },
    creatorName: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    timeAgo: {
        fontSize: CampusLoopTypography.fontSize.xs,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: CampusLoopSpacing.sm,
        paddingVertical: 4,
        borderRadius: CampusLoopBorderRadius.full,
    },
    categoryIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    categoryLabel: {
        fontSize: CampusLoopTypography.fontSize.xs,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    cardContent: {
        marginBottom: CampusLoopSpacing.md,
    },
    activityTitle: {
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
        marginBottom: 4,
    },
    activityDescription: {
        fontSize: CampusLoopTypography.fontSize.sm,
        lineHeight: 20,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: CampusLoopSpacing.md,
        marginBottom: CampusLoopSpacing.md,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: CampusLoopTypography.fontSize.xs,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: CampusLoopSpacing.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    participantsInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarStack: {
        flexDirection: 'row',
        position: 'relative',
    },
    stackedAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    avatarText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    participantsText: {
        fontSize: CampusLoopTypography.fontSize.xs,
    },
    joinButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: CampusLoopSpacing.md,
        paddingVertical: CampusLoopSpacing.sm,
        borderRadius: CampusLoopBorderRadius.full,
        borderWidth: 1,
        gap: 4,
    },
    joinButtonText: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: CampusLoopSpacing['3xl'],
        paddingHorizontal: CampusLoopSpacing.xl,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: CampusLoopSpacing.lg,
    },
    emptyTitle: {
        fontSize: CampusLoopTypography.fontSize.xl,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
        marginBottom: CampusLoopSpacing.sm,
    },
    emptyText: {
        fontSize: CampusLoopTypography.fontSize.base,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: CampusLoopSpacing.xl,
    },
    emptyButton: {
        paddingHorizontal: CampusLoopSpacing.xl,
        paddingVertical: CampusLoopSpacing.md,
        borderRadius: CampusLoopBorderRadius.lg,
    },
    emptyButtonText: {
        color: '#FFFFFF',
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
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

export default ActivitiesScreen;

