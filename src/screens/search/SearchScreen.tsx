import React, { useState, useCallback, useRef } from 'react';
import {
    View, Text, StyleSheet, TextInput, FlatList,
    TouchableOpacity, ActivityIndicator, StatusBar,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopAvatar } from '../../components/common/Avatar';
import { CampusLoopActivityService } from '../../services/activityService';
import { CampusLoopActivity, CampusLoopActivityTypeLabels } from '../../types/activity';
import { formatRelativeTime } from '../../utils/formatting';
import {
    CampusLoopSpacing, CampusLoopTypography,
    CampusLoopBorderRadius, CampusLoopShadows, ActivityCategories,
} from '../../constants/theme';

type Tab = 'activities';

interface Props { navigation: any }

const categoryEmoji: Record<string, string> = {
    study_group: '📚', assignment_help: '🤝', sports: '⚽',
    movies: '🎬', movie: '🎬', trip: '✈️', trips: '✈️',
    food: '🍕', event: '🎉', events: '🎉',
    project: '💻', project_collab: '💻', other: '💡',
};
const categoryColor: Record<string, string> = {
    study_group: '#0D9488', assignment_help: '#F59E0B', sports: '#10B981',
    movies: '#EF4444', trip: '#0EA5E9', food: '#F97316', event: '#8B5CF6',
    project: '#6366F1', other: '#64748B',
};

export const SearchScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();
    const { state: authState } = useCampusLoopAuth();

    const [query, setQuery]           = useState('');
    const [results, setResults]       = useState<CampusLoopActivity[]>([]);
    const [loading, setLoading]       = useState(false);
    const [searched, setSearched]     = useState(false);
    const [selectedType, setSelectedType] = useState<string>('all');

    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const filterTabs = [
        { key: 'all', label: 'All', icon: '🎯' },
        { key: 'study_group', label: 'Study', icon: '📚' },
        { key: 'assignment_help', label: 'Help', icon: '🤝' },
        { key: 'sports', label: 'Sports', icon: '⚽' },
        { key: 'movies', label: 'Movies', icon: '🎬' },
        { key: 'trip', label: 'Trips', icon: '✈️' },
        { key: 'food', label: 'Food', icon: '🍕' },
        { key: 'event', label: 'Events', icon: '🎉' },
    ];

    const doSearch = useCallback(async (text: string, type: string) => {
        if (!text.trim() && type === 'all') {
            setResults([]);
            setSearched(false);
            return;
        }
        setLoading(true);
        setSearched(true);
        try {
            const all = await CampusLoopActivityService.getActivities(
                type !== 'all' ? type as any : undefined,
                authState.user?.id,
            );
            const filtered = text.trim()
                ? all.filter(a =>
                    a.title.toLowerCase().includes(text.toLowerCase()) ||
                    a.description.toLowerCase().includes(text.toLowerCase()) ||
                    a.creatorName.toLowerCase().includes(text.toLowerCase()) ||
                    (a.location || '').toLowerCase().includes(text.toLowerCase())
                  )
                : all;
            setResults(filtered);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, [authState.user?.id]);

    const handleChangeText = (text: string) => {
        setQuery(text);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => doSearch(text, selectedType), 400);
    };

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        doSearch(query, type);
    };

    const handleJoin = async (activityId: string) => {
        try {
            await CampusLoopActivityService.joinActivity(activityId);
            setResults(prev => prev.map(a =>
                a.id === activityId
                    ? { ...a, isJoined: true, currentParticipants: a.currentParticipants + 1 }
                    : a
            ));
        } catch {}
    };

    const renderActivity = ({ item, index }: { item: CampusLoopActivity; index: number }) => {
        const color = categoryColor[item.type] || '#64748B';
        const emoji = categoryEmoji[item.type] || '🎯';
        const isAlreadyIn = item.isJoined || item.isCreator;
        const spotsLeft = item.maxParticipants - item.currentParticipants;

        return (
            <Animated.View entering={FadeInDown.delay(index * 40).duration(300)}>
                <TouchableOpacity
                    style={[styles.card, { backgroundColor: colors.surface, ...CampusLoopShadows.sm }]}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('ActivityChat', {
                        activityId: item.id,
                        activityTitle: item.title,
                        activityType: item.type,
                    })}
                >
                    <View style={[styles.cardIconBox, { backgroundColor: color + '20' }]}>
                        <Text style={styles.cardIcon}>{emoji}</Text>
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <Text style={[styles.cardDesc, { color: colors.textSecondary }]} numberOfLines={1}>
                            {item.description}
                        </Text>
                        <View style={styles.cardMeta}>
                            <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                                👤 {item.creatorName}
                            </Text>
                            <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                                {item.currentParticipants}/{item.maxParticipants} joined
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.joinBtn,
                            item.isJoined
                                ? { backgroundColor: colors.success + '20', borderColor: colors.success }
                                : spotsLeft === 0
                                    ? { backgroundColor: colors.border, borderColor: colors.border }
                                    : { backgroundColor: color, borderColor: color }
                        ]}
                        onPress={() => !isAlreadyIn && spotsLeft > 0 && handleJoin(item.id)}
                        disabled={isAlreadyIn || spotsLeft === 0}
                    >
                        <Text style={[
                            styles.joinBtnText,
                            { color: isAlreadyIn ? colors.success : spotsLeft === 0 ? colors.textTertiary : '#FFFFFF' }
                        ]}>
                            {isAlreadyIn ? '✓' : spotsLeft === 0 ? 'Full' : 'Join'}
                        </Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <Text style={[styles.title, { color: colors.text }]}>Search</Text>
                <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Ionicons name="search" size={18} color={colors.textTertiary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search activities, topics…"
                        placeholderTextColor={colors.textTertiary}
                        value={query}
                        onChangeText={handleChangeText}
                        returnKeyType="search"
                        onSubmitEditing={() => { Keyboard.dismiss(); doSearch(query, selectedType); }}
                        autoCapitalize="none"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
                            <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Type filter */}
            <View style={styles.filterRow}>
                <FlatList
                    horizontal
                    data={filterTabs}
                    keyExtractor={i => i.key}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                selectedType === item.key
                                    ? { backgroundColor: colors.primary }
                                    : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }
                            ]}
                            onPress={() => handleTypeSelect(item.key)}
                        >
                            <Text style={styles.filterIcon}>{item.icon}</Text>
                            <Text style={[styles.filterLabel, { color: selectedType === item.key ? '#fff' : colors.text }]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Results */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color={colors.primary} size="large" />
                </View>
            ) : !searched ? (
                <View style={styles.center}>
                    <Text style={styles.promptEmoji}>🔍</Text>
                    <Text style={[styles.promptText, { color: colors.textSecondary }]}>
                        Search for activities{'\n'}or browse by category above
                    </Text>
                </View>
            ) : results.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.promptEmoji}>😕</Text>
                    <Text style={[styles.promptText, { color: colors.textSecondary }]}>
                        No results found.{'\n'}Try a different search.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={item => item.id}
                    renderItem={renderActivity}
                    contentContainerStyle={styles.resultsList}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <Text style={[styles.resultCount, { color: colors.textTertiary }]}>
                            {results.length} result{results.length !== 1 ? 's' : ''}
                        </Text>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container:   { flex: 1 },
    header:      { paddingHorizontal: CampusLoopSpacing.xl, paddingTop: CampusLoopSpacing.md, paddingBottom: CampusLoopSpacing.sm },
    title:       { fontSize: CampusLoopTypography.fontSize['2xl'], fontWeight: CampusLoopTypography.fontWeight.bold, marginBottom: CampusLoopSpacing.md },
    searchBar:   { flexDirection: 'row', alignItems: 'center', borderRadius: CampusLoopBorderRadius.xl, borderWidth: 1, paddingHorizontal: CampusLoopSpacing.md, paddingVertical: CampusLoopSpacing.sm, gap: CampusLoopSpacing.sm },
    searchInput: { flex: 1, fontSize: CampusLoopTypography.fontSize.base, paddingVertical: 4 },
    filterRow:   { paddingVertical: CampusLoopSpacing.sm },
    filterList:  { paddingHorizontal: CampusLoopSpacing.xl, gap: CampusLoopSpacing.sm },
    filterChip:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: CampusLoopSpacing.md, paddingVertical: CampusLoopSpacing.sm, borderRadius: CampusLoopBorderRadius.full, gap: 4 },
    filterIcon:  { fontSize: 14 },
    filterLabel: { fontSize: CampusLoopTypography.fontSize.sm, fontWeight: CampusLoopTypography.fontWeight.medium },
    center:      { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
    promptEmoji: { fontSize: 48, marginBottom: CampusLoopSpacing.md },
    promptText:  { fontSize: CampusLoopTypography.fontSize.base, textAlign: 'center', lineHeight: 24 },
    resultsList: { padding: CampusLoopSpacing.base, paddingBottom: 100 },
    resultCount: { fontSize: CampusLoopTypography.fontSize.sm, marginBottom: CampusLoopSpacing.md, paddingHorizontal: 4 },
    card:        { flexDirection: 'row', alignItems: 'center', borderRadius: CampusLoopBorderRadius.lg, padding: CampusLoopSpacing.md, marginBottom: CampusLoopSpacing.sm },
    cardIconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: CampusLoopSpacing.md },
    cardIcon:    { fontSize: 24 },
    cardBody:    { flex: 1, marginRight: CampusLoopSpacing.sm },
    cardTitle:   { fontSize: CampusLoopTypography.fontSize.base, fontWeight: CampusLoopTypography.fontWeight.semibold, marginBottom: 2 },
    cardDesc:    { fontSize: CampusLoopTypography.fontSize.sm, marginBottom: 4 },
    cardMeta:    { flexDirection: 'row', gap: CampusLoopSpacing.md },
    metaText:    { fontSize: CampusLoopTypography.fontSize.xs },
    joinBtn:     { paddingHorizontal: CampusLoopSpacing.md, paddingVertical: CampusLoopSpacing.sm, borderRadius: CampusLoopBorderRadius.full, borderWidth: 1, minWidth: 52, alignItems: 'center' },
    joinBtnText: { fontSize: CampusLoopTypography.fontSize.sm, fontWeight: CampusLoopTypography.fontWeight.semibold },
});

export default SearchScreen;
