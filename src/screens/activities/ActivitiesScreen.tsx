/**
 * CampusLoop Enhanced Activities Screen
 * Categorized activities with beautiful cards and join animations
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopCard } from '../../components/common/Card';
import { CampusLoopAvatar } from '../../components/common/Avatar';
import { CampusLoopActivityService } from '../../services/activityService';
import { CampusLoopActivity } from '../../types/activity';
import { formatRelativeTime } from '../../utils/formatting';
import {
    CampusLoopSpacing,
    CampusLoopTypography,
    CampusLoopBorderRadius,
    CampusLoopShadows,
} from '../../constants/theme';

interface ActivitiesScreenProps {
    navigation: any;
}

type ActivityCategory = 'all' | 'study' | 'sports' | 'events' | 'trips' | 'movies' | 'exams';

const categoryIcons: Record<ActivityCategory, string> = {
    all: '🎯',
    study: '📚',
    sports: '⚽',
    events: '🎉',
    trips: '✈️',
    movies: '🎬',
    exams: '📝',
};

const categoryLabels: Record<ActivityCategory, string> = {
    all: 'All',
    study: 'Study',
    sports: 'Sports',
    events: 'Events',
    trips: 'Trips',
    movies: 'Movies',
    exams: 'Exams',
};

const categoryToActivityType: Record<string, string> = {
    study: 'study_group',
    sports: 'sports',
    events: 'event',
    trips: 'event',
    movies: 'event',
    exams: 'study_group',
};

export const ActivitiesScreen: React.FC<ActivitiesScreenProps> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();
    const { state: authState } = useCampusLoopAuth();

    const [activities, setActivities] = useState<CampusLoopActivity[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('all');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadActivities();
    }, [selectedCategory]);

    const loadActivities = async () => {
        try {
            const data = await CampusLoopActivityService.getActivities(authState.user?.id);
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
            const updatedActivity = await CampusLoopActivityService.joinActivity(
                activityId,
                authState.user!.id
            );
            setActivities(
                activities.map((a) => (a.id === activityId ? updatedActivity : a))
            );
        } catch (error) {
            console.error('Error joining activity:', error);
        }
    };

    const categories: ActivityCategory[] = ['all', 'study', 'sports', 'events', 'trips', 'movies', 'exams'];

    const renderActivityCard = ({ item }: { item: CampusLoopActivity }) => (
        <ActivityCard
            activity={item}
            onJoin={handleJoinActivity}
            colors={colors}
        />
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Activities</Text>
                <Text style={styles.headerSubtitle}>Join events, study groups & more</Text>
            </LinearGradient>

            {/* Category Tabs */}
            <View style={styles.categoriesContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.categoryTab,
                                selectedCategory === item && [
                                    styles.categoryTabActive,
                                    { backgroundColor: colors.primary },
                                ],
                            ]}
                            onPress={() => setSelectedCategory(item)}
                        >
                            <Text style={styles.categoryIcon}>{categoryIcons[item]}</Text>
                            <Text
                                style={[
                                    styles.categoryLabel,
                                    {
                                        color:
                                            selectedCategory === item
                                                ? '#FFFFFF'
                                                : colors.textSecondary,
                                    },
                                ]}
                            >
                                {categoryLabels[item]}
                            </Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.categoriesList}
                />
            </View>

            {/* Activities List */}
            <FlatList
                data={activities}
                keyExtractor={(item) => item.id}
                renderItem={renderActivityCard}
                contentContainerStyle={styles.activitiesList}
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
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            No activities yet. Be the first to create one!
                        </Text>
                    </View>
                }
            />

            {/* Create Activity FAB */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => {
                    // TODO: Navigate to CreateActivity screen
                    console.log('Create activity');
                }}
            >
                <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    style={styles.fabGradient}
                >
                    <Text style={styles.fabIcon}>➕</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

// Activity Card Component
interface ActivityCardProps {
    activity: CampusLoopActivity;
    onJoin: (id: string) => void;
    colors: any;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onJoin, colors }) => {
    const scaleAnim = new Animated.Value(1);

    const handleJoin = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }),
        ]).start();

        onJoin(activity.id);
    };

    const isJoined = activity.isJoined;
    const spotsLeft = activity.maxParticipants - activity.currentParticipants;
    const activityTypeKey = activity.type.replace('_', ' ');

    return (
        <CampusLoopCard style={styles.activityCard}>
            {/* Activity Header */}
            <View style={styles.activityHeader}>
                <View style={styles.activityTypeContainer}>
                    <Text style={styles.activityTypeIcon}>
                        {activity.type === 'study_group' ? '📚' :
                            activity.type === 'sports' ? '⚽' :
                                activity.type === 'event' ? '🎉' :
                                    activity.type === 'assignment_help' ? '📝' : '🎯'}
                    </Text>
                    <Text style={[styles.activityType, { color: colors.primary }]}>
                        {activityTypeKey}
                    </Text>
                </View>
                <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                    {activity.scheduledDate ? formatRelativeTime(activity.scheduledDate) : 'TBD'}
                </Text>
            </View>

            {/* Activity Title & Description */}
            <Text style={[styles.activityTitle, { color: colors.text }]}>
                {activity.title}
            </Text>
            <Text style={[styles.activityDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                {activity.description}
            </Text>

            {/* Location */}
            {activity.location && (
                <View style={styles.locationContainer}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                        {activity.location}
                    </Text>
                </View>
            )}

            {/* Participants */}
            <View style={styles.participantsContainer}>
                <View style={styles.avatarsStack}>
                    {activity.participantIds.slice(0, 3).map((participantId: string, index: number) => (
                        <View
                            key={participantId}
                            style={[styles.avatarWrapper, { marginLeft: index > 0 ? -12 : 0 }]}
                        >
                            <CampusLoopAvatar
                                name={`User ${index + 1}`}
                                size="tiny"
                            />
                        </View>
                    ))}
                    {activity.currentParticipants > 3 && (
                        <View style={[styles.moreParticipants, { backgroundColor: colors.border }]}>
                            <Text style={[styles.moreParticipantsText, { color: colors.text }]}>
                                +{activity.currentParticipants - 3}
                            </Text>
                        </View>
                    )}
                </View>
                <Text style={[styles.spotsText, { color: colors.textSecondary }]}>
                    {spotsLeft} spots left
                </Text>
            </View>

            {/* Join Button */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                    style={[
                        styles.joinButton,
                        isJoined
                            ? { backgroundColor: colors.success }
                            : { backgroundColor: colors.primary },
                    ]}
                    onPress={handleJoin}
                    disabled={isJoined}
                >
                    <Text style={styles.joinButtonText}>
                        {isJoined ? '✓ Joined' : '+ Join Activity'}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </CampusLoopCard>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingBottom: CampusLoopSpacing.xl,
        paddingHorizontal: CampusLoopSpacing.base,
    },
    headerTitle: {
        fontSize: CampusLoopTypography.fontSize['2xl'],
        fontWeight: CampusLoopTypography.fontWeight.extrabold,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: CampusLoopTypography.fontSize.base,
        color: '#FFFFFF',
        opacity: 0.9,
    },
    categoriesContainer: {
        paddingVertical: CampusLoopSpacing.md,
    },
    categoriesList: {
        paddingHorizontal: CampusLoopSpacing.base,
    },
    categoryTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: CampusLoopSpacing.base,
        paddingVertical: CampusLoopSpacing.sm,
        marginRight: CampusLoopSpacing.sm,
        borderRadius: CampusLoopBorderRadius.lg,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    categoryTabActive: {
        ...CampusLoopShadows.sm,
    },
    categoryIcon: {
        fontSize: 18,
        marginRight: 6,
    },
    categoryLabel: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    activitiesList: {
        padding: CampusLoopSpacing.base,
    },
    activityCard: {
        marginBottom: CampusLoopSpacing.base,
    },
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: CampusLoopSpacing.sm,
    },
    activityTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activityTypeIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    activityType: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.bold,
        textTransform: 'uppercase',
    },
    activityTime: {
        fontSize: CampusLoopTypography.fontSize.xs,
    },
    activityTitle: {
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.bold,
        marginBottom: CampusLoopSpacing.xs,
    },
    activityDescription: {
        fontSize: CampusLoopTypography.fontSize.base,
        lineHeight: CampusLoopTypography.lineHeight.normal * CampusLoopTypography.fontSize.base,
        marginBottom: CampusLoopSpacing.sm,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: CampusLoopSpacing.md,
    },
    locationIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    locationText: {
        fontSize: CampusLoopTypography.fontSize.sm,
    },
    participantsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: CampusLoopSpacing.md,
    },
    avatarsStack: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarWrapper: {
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderRadius: 16,
    },
    moreParticipants: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -12,
    },
    moreParticipantsText: {
        fontSize: CampusLoopTypography.fontSize.xs,
        fontWeight: CampusLoopTypography.fontWeight.bold,
    },
    spotsText: {
        fontSize: CampusLoopTypography.fontSize.sm,
    },
    joinButton: {
        paddingVertical: CampusLoopSpacing.md,
        borderRadius: CampusLoopBorderRadius.base,
        alignItems: 'center',
    },
    joinButtonText: {
        color: '#FFFFFF',
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.bold,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: CampusLoopSpacing['3xl'],
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: CampusLoopSpacing.base,
    },
    emptyText: {
        fontSize: CampusLoopTypography.fontSize.base,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: CampusLoopSpacing.xl,
        right: CampusLoopSpacing.xl,
        width: 64,
        height: 64,
        borderRadius: 32,
        ...CampusLoopShadows.xl,
    },
    fabGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabIcon: {
        fontSize: 28,
    },
});
