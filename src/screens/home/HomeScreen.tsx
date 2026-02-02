/**
 * CampusLoop Enhanced Home Screen
 * Modern feed with skeleton loading, animations, and enhanced interactions
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    Animated,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopCategoryChip } from '../../components/common/CategoryChip';
import { PostCard } from '../../components/posts/PostCard';
import { PostCardSkeleton } from '../../components/common/SkeletonLoader';
import { CampusLoopPostService } from '../../services/postService';
import {
    CampusLoopPost,
    CampusLoopPostCategory,
    CampusLoopPostCategoryLabels,
    CampusLoopPostCategoryColors,
} from '../../types/post';
import {
    CampusLoopSpacing,
    CampusLoopTypography,
    CampusLoopBorderRadius,
    CampusLoopShadows,
} from '../../constants/theme';

interface HomeScreenProps {
    navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();
    const { state: authState } = useCampusLoopAuth();

    const [posts, setPosts] = useState<CampusLoopPost[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CampusLoopPostCategory | undefined>();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Animations
    const fabScale = new Animated.Value(1);

    useEffect(() => {
        loadPosts();
    }, [selectedCategory]);

    const loadPosts = async () => {
        try {
            const data = await CampusLoopPostService.getPosts(
                selectedCategory,
                authState.user?.id
            );
            setPosts(data);
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadPosts();
    };

    const handleLike = async (postId: string) => {
        try {
            const updatedPost = await CampusLoopPostService.likePost(
                postId,
                authState.user!.id
            );
            setPosts(posts.map((p) => (p.id === postId ? updatedPost : p)));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleFabPress = () => {
        Animated.sequence([
            Animated.timing(fabScale, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(fabScale, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }),
        ]).start();

        navigation.navigate('CreatePost');
    };

    const categories: CampusLoopPostCategory[] = [
        'assignment',
        'coding',
        'activities',
        'sports',
        'events',
        'discussion',
    ];

    const renderPostCard = ({ item }: { item: CampusLoopPost }) => (
        <PostCard post={item} onLike={handleLike} />
    );

    const renderSkeletons = () => (
        <>
            {[...Array(3)].map((_, i) => (
                <PostCardSkeleton key={i} />
            ))}
        </>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.headerTitle}>CampusLoop</Text>
                        <Text style={styles.headerSubtitle}>
                            {authState.user?.university || 'Your Campus'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Notifications')}
                        style={styles.notificationButton}
                    >
                        <Text style={styles.notificationIcon}>🔔</Text>
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationBadgeText}>3</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={[styles.searchContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search posts, events, people..."
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </LinearGradient>

            {/* Category Filter */}
            <View style={styles.categoryFilter}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <CampusLoopCategoryChip
                            label={CampusLoopPostCategoryLabels[item]}
                            selected={selectedCategory === item}
                            onPress={() =>
                                setSelectedCategory(selectedCategory === item ? undefined : item)
                            }
                            color={CampusLoopPostCategoryColors[item]}
                        />
                    )}
                    contentContainerStyle={styles.categoryList}
                />
            </View>

            {/* Trending Section */}
            {!selectedCategory && (
                <View style={[styles.trendingSection, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.trendingTitle, { color: colors.text }]}>
                        🔥 Trending Now
                    </Text>
                    <Text style={[styles.trendingText, { color: colors.textSecondary }]}>
                        #MidtermPrep • #CampusEvent • #StudyGroup
                    </Text>
                </View>
            )}

            {/* Posts List */}
            {loading ? (
                <View style={styles.postList}>{renderSkeletons()}</View>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPostCard}
                    contentContainerStyle={styles.postList}
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
                            <Text style={styles.emptyIcon}>📭</Text>
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                No posts yet. Be the first to share!
                            </Text>
                        </View>
                    }
                />
            )}

            {/* Floating Action Button */}
            <Animated.View style={{ transform: [{ scale: fabScale }] }}>
                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: colors.primary }]}
                    onPress={handleFabPress}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={[colors.gradientStart, colors.gradientEnd]}
                        style={styles.fabGradient}
                    >
                        <Text style={styles.fabIcon}>✏️</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingBottom: CampusLoopSpacing.base,
        paddingHorizontal: CampusLoopSpacing.base,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: CampusLoopSpacing.base,
    },
    headerTitle: {
        fontSize: CampusLoopTypography.fontSize['2xl'],
        fontWeight: CampusLoopTypography.fontWeight.extrabold,
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: CampusLoopTypography.fontSize.sm,
        color: '#FFFFFF',
        opacity: 0.9,
        marginTop: 2,
    },
    notificationButton: {
        position: 'relative',
    },
    notificationIcon: {
        fontSize: 28,
    },
    notificationBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: CampusLoopTypography.fontWeight.bold,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: CampusLoopBorderRadius.lg,
        paddingHorizontal: CampusLoopSpacing.base,
        paddingVertical: CampusLoopSpacing.sm,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: CampusLoopSpacing.sm,
    },
    searchInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: CampusLoopTypography.fontSize.base,
    },
    categoryFilter: {
        paddingVertical: CampusLoopSpacing.md,
    },
    categoryList: {
        paddingHorizontal: CampusLoopSpacing.base,
    },
    trendingSection: {
        marginHorizontal: CampusLoopSpacing.base,
        marginBottom: CampusLoopSpacing.base,
        padding: CampusLoopSpacing.base,
        borderRadius: CampusLoopBorderRadius.lg,
        ...CampusLoopShadows.sm,
    },
    trendingTitle: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.bold,
        marginBottom: CampusLoopSpacing.xs,
    },
    trendingText: {
        fontSize: CampusLoopTypography.fontSize.sm,
    },
    postList: {
        padding: CampusLoopSpacing.base,
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
