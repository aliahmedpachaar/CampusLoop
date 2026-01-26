/**
 * CampusLoop Activities Screen
 * Browse and join student activities
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopCard } from '../../components/common/Card';
import { CampusLoopAvatar } from '../../components/common/Avatar';
import { CampusLoopButton } from '../../components/common/Button';
import { CampusLoopActivityService } from '../../services/activityService';
import { CampusLoopActivity, CampusLoopActivityTypeLabels, CampusLoopActivityTypeColors } from '../../types/activity';
import { formatRelativeTime, formatDateTime } from '../../utils/formatting';
import { CampusLoopSpacing, CampusLoopTypography } from '../../constants/theme';

interface ActivitiesScreenProps {
    navigation: any;
}

export const ActivitiesScreen: React.FC<ActivitiesScreenProps> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();
    const { state: authState } = useCampusLoopAuth();

    const [activities, setActivities] = useState<CampusLoopActivity[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadActivities();
    }, []);

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

    const handleJoinLeave = async (activity: CampusLoopActivity) => {
        try {
            if (activity.isJoined) {
                const updated = await CampusLoopActivityService.leaveActivity(activity.id, authState.user!.id);
                setActivities(activities.map(a => (a.id === activity.id ? updated : a)));
            } else {
                const updated = await CampusLoopActivityService.joinActivity(activity.id, authState.user!.id);
                setActivities(activities.map(a => (a.id === activity.id ? updated : a)));
            }
        } catch (error: any) {
            console.error('Error joining/leaving activity:', error);
        }
    };

    const renderActivityCard = ({ item }: { item: CampusLoopActivity }) => {
        const isFull = item.currentParticipants >= item.maxParticipants;
        const spotsLeft = item.maxParticipants - item.currentParticipants;

        return (
            <CampusLoopCard style={styles.activityCard}>
                <View style={[styles.typeBadge, { backgroundColor: CampusLoopActivityTypeColors[item.type] }]}>
                    <Text style={styles.typeBadgeText}>{CampusLoopActivityTypeLabels[item.type]}</Text>
                </View>

                <Text style={[styles.activityTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.activityDescription, { color: colors.textSecondary }]}>
                    {item.description}
                </Text>

                <View style={styles.activityMeta}>
                    <View style={styles.creatorInfo}>
                        <CampusLoopAvatar name={item.creatorName} size="small" imageUri={item.creatorAvatar} />
                        <View style={styles.creatorText}>
                            <Text style={[styles.creatorName, { color: colors.text }]}>{item.creatorName}</Text>
                            <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                                {formatRelativeTime(item.createdAt)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.participantInfo}>
                        <Text style={[styles.participantCount, { color: colors.text }]}>
                            {item.currentParticipants}/{item.maxParticipants}
                        </Text>
                        <Text style={[styles.participantLabel, { color: colors.textSecondary }]}>participants</Text>
                    </View>
                </View>

                {item.location && (
                    <Text style={[styles.location, { color: colors.textSecondary }]}>📍 {item.location}</Text>
                )}

                {item.scheduledDate && (
                    <Text style={[styles.scheduledDate, { color: colors.textSecondary }]}>
                        🗓️ {formatDateTime(item.scheduledDate)}
                    </Text>
                )}

                <View style={styles.actionContainer}>
                    {!isFull || item.isJoined ? (
                        <CampusLoopButton
                            title={item.isJoined ? 'Leave' : 'Join'}
                            onPress={() => handleJoinLeave(item)}
                            variant={item.isJoined ? 'outline' : 'primary'}
                            fullWidth
                        />
                    ) : (
                        <Text style={[styles.fullText, { color: colors.error }]}>Activity Full</Text>
                    )}
                </View>

                {!isFull && spotsLeft <= 3 && spotsLeft > 0 && (
                    <Text style={[styles.spotsWarning, { color: colors.warning }]}>
                        Only {spotsLeft} spot{spotsLeft > 1 ? 's' : ''} left!
                    </Text>
                )}
            </CampusLoopCard>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Activities</Text>
            </View>

            <FlatList
                data={activities}
                keyExtractor={item => item.id}
                renderItem={renderActivityCard}
                contentContainerStyle={styles.activityList}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            {loading ? 'Loading activities...' : 'No activities yet. Create one!'}
                        </Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('CreateActivity')}>
                <Text style={styles.fabIcon}>➕</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: CampusLoopSpacing.base,
        paddingVertical: CampusLoopSpacing.md,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: CampusLoopTypography.fontSize.xl,
        fontWeight: CampusLoopTypography.fontWeight.bold,
    },
    activityList: {
        padding: CampusLoopSpacing.base,
    },
    activityCard: {
        marginBottom: CampusLoopSpacing.base,
    },
    typeBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: CampusLoopSpacing.sm,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: CampusLoopSpacing.sm,
    },
    typeBadgeText: {
        fontSize: CampusLoopTypography.fontSize.xs,
        fontWeight: CampusLoopTypography.fontWeight.medium,
        color: '#FFFFFF',
    },
    activityTitle: {
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.bold,
        marginBottom: CampusLoopSpacing.sm,
    },
    activityDescription: {
        fontSize: CampusLoopTypography.fontSize.base,
        lineHeight: CampusLoopTypography.lineHeight.relaxed * CampusLoopTypography.fontSize.base,
        marginBottom: CampusLoopSpacing.md,
    },
    activityMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: CampusLoopSpacing.sm,
    },
    creatorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    creatorText: {
        marginLeft: CampusLoopSpacing.sm,
    },
    creatorName: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    activityTime: {
        fontSize: CampusLoopTypography.fontSize.xs,
    },
    participantInfo: {
        alignItems: 'flex-end',
    },
    participantCount: {
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.bold,
    },
    participantLabel: {
        fontSize: CampusLoopTypography.fontSize.xs,
    },
    location: {
        fontSize: CampusLoopTypography.fontSize.sm,
        marginBottom: CampusLoopSpacing.xs,
    },
    scheduledDate: {
        fontSize: CampusLoopTypography.fontSize.sm,
        marginBottom: CampusLoopSpacing.sm,
    },
    actionContainer: {
        marginTop: CampusLoopSpacing.sm,
    },
    fullText: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
        textAlign: 'center',
        paddingVertical: CampusLoopSpacing.md,
    },
    spotsWarning: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
        textAlign: 'center',
        marginTop: CampusLoopSpacing.xs,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: CampusLoopSpacing['3xl'],
    },
    emptyText: {
        fontSize: CampusLoopTypography.fontSize.base,
    },
    fab: {
        position: 'absolute',
        bottom: CampusLoopSpacing.xl,
        right: CampusLoopSpacing.xl,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    fabIcon: {
        fontSize: 24,
    },
});
