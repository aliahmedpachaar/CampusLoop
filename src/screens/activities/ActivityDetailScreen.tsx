/**
 * CampusLoop - Activity Detail Screen
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, ActivityIndicator,
    StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopAvatar } from '../../components/common/Avatar';
import { CampusLoopActivityService } from '../../services/activityService';
import { CampusLoopActivity } from '../../types/activity';
import { formatRelativeTime } from '../../utils/formatting';
import {
    CampusLoopSpacing, CampusLoopTypography,
    CampusLoopBorderRadius, CampusLoopShadows,
} from '../../constants/theme';

interface Props {
    navigation: any;
    route: { params: { activityId: string } };
}

const categoryEmoji: Record<string, string> = {
    study_group: '📚', assignment_help: '🤝', sports: '⚽',
    movies: '🎬', movie: '🎬', trip: '✈️', trips: '✈️',
    food: '🍕', event: '🎉', events: '🎉',
    project: '💻', project_collab: '💻', other: '💡',
};

const categoryColor: Record<string, string> = {
    study_group: '#0D9488', assignment_help: '#F59E0B', sports: '#10B981',
    movies: '#EF4444', movie: '#EF4444', trip: '#0EA5E9', trips: '#0EA5E9',
    food: '#F97316', event: '#8B5CF6', events: '#8B5CF6',
    project: '#6366F1', project_collab: '#6366F1', other: '#64748B',
};

const categoryLabel: Record<string, string> = {
    study_group: 'Study Group', assignment_help: 'Need Help', sports: 'Sports',
    movies: 'Movies/Events', movie: 'Movies/Events', trip: 'Trip', trips: 'Trip',
    food: 'Food', event: 'Event', events: 'Events',
    project: 'Project', project_collab: 'Project', other: 'Other',
};

export const ActivityDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    const { activityId } = route.params;
    const { colors } = useCampusLoopTheme();
    const { state: authState } = useCampusLoopAuth();
    const user = authState.user!;

    const [activity, setActivity] = useState<CampusLoopActivity | null>(null);
    const [loading, setLoading]   = useState(true);
    const [joining, setJoining]   = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        const data = await CampusLoopActivityService.getActivity(activityId);
        setActivity(data);
        setLoading(false);
    }, [activityId]);

    useEffect(() => { load(); }, [load]);

    const handleJoinLeave = async () => {
        if (!activity) return;
        setJoining(true);
        try {
            if (activity.isJoined) {
                const ok = await CampusLoopActivityService.leaveActivity(activityId, user.id);
                if (ok) setActivity(prev => prev ? { ...prev, isJoined: false, currentParticipants: prev.currentParticipants - 1 } : prev);
                else Alert.alert('Error', 'Could not leave activity');
            } else {
                const ok = await CampusLoopActivityService.joinActivity(activityId, user.id);
                if (ok) setActivity(prev => prev ? { ...prev, isJoined: true, currentParticipants: prev.currentParticipants + 1 } : prev);
                else Alert.alert('Error', 'Could not join activity');
            }
        } catch {
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setJoining(false);
        }
    };

    const openChat = () => {
        if (!activity) return;
        navigation.navigate('ActivityChat', {
            activityId: activity.id,
            activityTitle: activity.title,
            activityType: activity.type,
        });
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
                <View style={styles.center}>
                    <ActivityIndicator color={colors.primary} size="large" />
                </View>
            </SafeAreaView>
        );
    }

    if (!activity) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
                <View style={styles.center}>
                    <Text style={[styles.errorText, { color: colors.textSecondary }]}>Activity not found</Text>
                    <TouchableOpacity style={[styles.backBtnFallback, { backgroundColor: colors.primary }]} onPress={() => navigation.goBack()}>
                        <Text style={styles.backBtnFallbackText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const isCreator = activity.isCreator || activity.creatorId === user.id;
    const isJoined  = activity.isJoined || isCreator;
    const spotsLeft = activity.maxParticipants - activity.currentParticipants;
    const isFull    = spotsLeft <= 0;
    const accentColor = categoryColor[activity.type] || '#64748B';
    const emoji       = categoryEmoji[activity.type] || '💬';
    const label       = categoryLabel[activity.type] || 'Activity';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
                    Activity Details
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Hero banner */}
                <View style={[styles.hero, { backgroundColor: accentColor }]}>
                    <Text style={styles.heroEmoji}>{emoji}</Text>
                    <View style={[styles.typeBadge, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                        <Text style={styles.typeBadgeText}>{label}</Text>
                    </View>
                </View>

                {/* Main card */}
                <View style={[styles.card, { backgroundColor: colors.surface, ...CampusLoopShadows.sm }]}>
                    <Text style={[styles.title, { color: colors.text }]}>{activity.title}</Text>

                    {/* Creator row */}
                    <View style={styles.creatorRow}>
                        <CampusLoopAvatar name={activity.creatorName} imageUrl={activity.creatorAvatar} size={36} />
                        <View style={styles.creatorInfo}>
                            <Text style={[styles.creatorName, { color: colors.text }]}>{activity.creatorName}</Text>
                            <Text style={[styles.createdAt, { color: colors.textTertiary }]}>
                                {formatRelativeTime(activity.createdAt)}
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    {!!activity.description && (
                        <Text style={[styles.description, { color: colors.textSecondary }]}>
                            {activity.description}
                        </Text>
                    )}

                    {/* Meta row */}
                    <View style={styles.metaRow}>
                        {!!activity.location && (
                            <View style={styles.metaItem}>
                                <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
                                <Text style={[styles.metaText, { color: colors.textTertiary }]}>{activity.location}</Text>
                            </View>
                        )}
                        <View style={styles.metaItem}>
                            <Ionicons name="people-outline" size={14} color={colors.textTertiary} />
                            <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                                {activity.currentParticipants}/{activity.maxParticipants} joined
                                {spotsLeft > 0 ? ` · ${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left` : ' · Full'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Participants */}
                {activity.participants && activity.participants.length > 0 && (
                    <View style={[styles.card, { backgroundColor: colors.surface, ...CampusLoopShadows.sm }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Participants</Text>
                        {activity.participants.map(p => (
                            <View key={p.id} style={styles.participantRow}>
                                <CampusLoopAvatar name={p.name} imageUrl={p.avatar} size={32} />
                                <Text style={[styles.participantName, { color: colors.text }]}>{p.name}</Text>
                            </View>
                        ))}
                    </View>
                )}

            </ScrollView>

            {/* Bottom action bar */}
            <View style={[styles.actionBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.chatBtn, { borderColor: colors.border }]}
                    onPress={openChat}
                >
                    <Ionicons name="chatbubble-outline" size={20} color={colors.text} />
                    <Text style={[styles.chatBtnText, { color: colors.text }]}>Chat</Text>
                </TouchableOpacity>

                {isCreator ? (
                    <View style={[styles.joinBtn, { backgroundColor: accentColor + '20', flex: 1 }]}>
                        <Ionicons name="star" size={18} color={accentColor} />
                        <Text style={[styles.joinBtnText, { color: accentColor }]}>You created this</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[
                            styles.joinBtn,
                            {
                                backgroundColor: isJoined ? colors.success + '20' ?? '#10B98120'
                                    : isFull ? colors.border
                                        : accentColor,
                                flex: 1,
                            },
                        ]}
                        onPress={handleJoinLeave}
                        disabled={joining || (isFull && !isJoined)}
                        activeOpacity={0.8}
                    >
                        {joining
                            ? <ActivityIndicator color={isJoined ? '#10B981' : '#fff'} size="small" />
                            : <>
                                <Ionicons
                                    name={isJoined ? 'checkmark-circle' : isFull ? 'close-circle-outline' : 'add-circle-outline'}
                                    size={18}
                                    color={isJoined ? '#10B981' : isFull ? colors.textTertiary : '#fff'}
                                />
                                <Text style={[
                                    styles.joinBtnText,
                                    { color: isJoined ? '#10B981' : isFull ? colors.textTertiary : '#fff' },
                                ]}>
                                    {isJoined ? 'Joined' : isFull ? 'Full' : 'Join'}
                                </Text>
                            </>
                        }
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container:          { flex: 1 },
    center:             { flex: 1, alignItems: 'center', justifyContent: 'center', gap: CampusLoopSpacing.md },
    errorText:          { fontSize: CampusLoopTypography.fontSize.base },
    backBtnFallback:    { paddingHorizontal: CampusLoopSpacing.xl, paddingVertical: CampusLoopSpacing.md, borderRadius: CampusLoopBorderRadius.lg },
    backBtnFallbackText: { color: '#fff', fontWeight: CampusLoopTypography.fontWeight.semibold },
    header:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: CampusLoopSpacing.base, paddingVertical: CampusLoopSpacing.md, borderBottomWidth: 1, ...CampusLoopShadows.sm },
    backBtn:            { padding: 4, width: 40 },
    headerTitle:        { fontSize: CampusLoopTypography.fontSize.base, fontWeight: CampusLoopTypography.fontWeight.semibold, flex: 1, textAlign: 'center' },
    scrollContent:      { paddingBottom: CampusLoopSpacing.xl },
    hero:               { height: 140, alignItems: 'center', justifyContent: 'center', gap: CampusLoopSpacing.sm },
    heroEmoji:          { fontSize: 52 },
    typeBadge:          { paddingHorizontal: CampusLoopSpacing.md, paddingVertical: CampusLoopSpacing.xs, borderRadius: CampusLoopBorderRadius.full },
    typeBadgeText:      { color: '#fff', fontSize: CampusLoopTypography.fontSize.sm, fontWeight: CampusLoopTypography.fontWeight.semibold },
    card:               { margin: CampusLoopSpacing.base, marginTop: CampusLoopSpacing.md, borderRadius: CampusLoopBorderRadius.xl, padding: CampusLoopSpacing.base },
    title:              { fontSize: CampusLoopTypography.fontSize.xl, fontWeight: CampusLoopTypography.fontWeight.bold, marginBottom: CampusLoopSpacing.md },
    creatorRow:         { flexDirection: 'row', alignItems: 'center', gap: CampusLoopSpacing.sm, marginBottom: CampusLoopSpacing.md },
    creatorInfo:        { flex: 1 },
    creatorName:        { fontSize: CampusLoopTypography.fontSize.base, fontWeight: CampusLoopTypography.fontWeight.medium },
    createdAt:          { fontSize: CampusLoopTypography.fontSize.xs, marginTop: 2 },
    description:        { fontSize: CampusLoopTypography.fontSize.base, lineHeight: 24, marginBottom: CampusLoopSpacing.md },
    metaRow:            { gap: CampusLoopSpacing.sm },
    metaItem:           { flexDirection: 'row', alignItems: 'center', gap: CampusLoopSpacing.xs },
    metaText:           { fontSize: CampusLoopTypography.fontSize.sm },
    sectionTitle:       { fontSize: CampusLoopTypography.fontSize.base, fontWeight: CampusLoopTypography.fontWeight.semibold, marginBottom: CampusLoopSpacing.md },
    participantRow:     { flexDirection: 'row', alignItems: 'center', gap: CampusLoopSpacing.sm, marginBottom: CampusLoopSpacing.sm },
    participantName:    { fontSize: CampusLoopTypography.fontSize.base },
    actionBar:          { flexDirection: 'row', gap: CampusLoopSpacing.sm, paddingHorizontal: CampusLoopSpacing.base, paddingVertical: CampusLoopSpacing.md, borderTopWidth: 1 },
    chatBtn:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: CampusLoopSpacing.xs, paddingHorizontal: CampusLoopSpacing.lg, paddingVertical: CampusLoopSpacing.md, borderRadius: CampusLoopBorderRadius.lg, borderWidth: 1 },
    chatBtnText:        { fontSize: CampusLoopTypography.fontSize.base, fontWeight: CampusLoopTypography.fontWeight.medium },
    joinBtn:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: CampusLoopSpacing.xs, paddingVertical: CampusLoopSpacing.md, borderRadius: CampusLoopBorderRadius.lg },
    joinBtnText:        { fontSize: CampusLoopTypography.fontSize.base, fontWeight: CampusLoopTypography.fontWeight.semibold },
});

export default ActivityDetailScreen;
