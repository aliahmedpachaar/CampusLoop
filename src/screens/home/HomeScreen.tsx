/**
 * CampusLoop Home Screen
 * Main feed with posts and category filtering
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
import { CampusLoopCategoryChip } from '../../components/common/CategoryChip';
import { CampusLoopPostService } from '../../services/postService';
import { CampusLoopPost, CampusLoopPostCategory, CampusLoopPostCategoryLabels, CampusLoopPostCategoryColors } from '../../types/post';
import { formatRelativeTime } from '../../utils/formatting';
import { CampusLoopSpacing, CampusLoopTypography } from '../../constants/theme';

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

    useEffect(() => {
        loadPosts();
    }, [selectedCategory]);

    const loadPosts = async () => {
        try {
            const data = await CampusLoopPostService.getPosts(selectedCategory, authState.user?.id);
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
            const updatedPost = await CampusLoopPostService.likePost(postId, authState.user!.id);
            setPosts(posts.map(p => (p.id === postId ? updatedPost : p)));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const categories: CampusLoopPostCategory[] = ['assignment', 'coding', 'activities', 'sports', 'events', 'discussion'];

    const renderPostCard = ({ item }: { item: CampusLoopPost }) => (
        <CampusLoopCard style={styles.postCard}>
            <View style={styles.postHeader}>
                <CampusLoopAvatar name={item.authorName} size="small" imageUri={item.authorAvatar} />
                <View style={styles.postAuthorInfo}>
                    <Text style={[styles.authorName, { color: colors.text }]}>{item.authorName}</Text>
                    <Text style={[styles.postTime, { color: colors.textSecondary }]}>
                        {formatRelativeTime(item.createdAt)}
                    </Text>
                </View>
                <View style={[styles.categoryBadge, { backgroundColor: CampusLoopPostCategoryColors[item.category] }]}>
                    <Text style={styles.categoryBadgeText}>{CampusLoopPostCategoryLabels[item.category]}</Text>
                </View>
            </View>

            <Text style={[styles.postContent, { color: colors.text }]}>{item.content}</Text>

            <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item.id)}>
                    <Text style={[styles.actionText, { color: item.isLiked ? colors.error : colors.textSecondary }]}>
                        {item.isLiked ? '❤️' : '🤍'} {item.likesCount}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                        💬 {item.commentsCount}
                    </Text>
                </TouchableOpacity>
            </View>
        </CampusLoopCard>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>CampusLoop</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                    <Text style={styles.notificationIcon}>🔔</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.categoryFilter}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <CampusLoopCategoryChip
                            label={CampusLoopPostCategoryLabels[item]}
                            selected={selectedCategory === item}
                            onPress={() => setSelectedCategory(selectedCategory === item ? undefined : item)}
                            color={CampusLoopPostCategoryColors[item]}
                        />
                    )}
                    contentContainerStyle={styles.categoryList}
                />
            </View>

            <FlatList
                data={posts}
                keyExtractor={item => item.id}
                renderItem={renderPostCard}
                contentContainerStyle={styles.postList}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            {loading ? 'Loading posts...' : 'No posts yet. Be the first to share!'}
                        </Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('CreatePost')}>
                <Text style={styles.fabIcon}>✏️</Text>
            </TouchableOpacity>
        </View>
    );
};

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
    headerTitle: {
        fontSize: CampusLoopTypography.fontSize.xl,
        fontWeight: CampusLoopTypography.fontWeight.bold,
    },
    notificationIcon: {
        fontSize: 24,
    },
    categoryFilter: {
        paddingVertical: CampusLoopSpacing.md,
    },
    categoryList: {
        paddingHorizontal: CampusLoopSpacing.base,
    },
    postList: {
        padding: CampusLoopSpacing.base,
    },
    postCard: {
        marginBottom: CampusLoopSpacing.base,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: CampusLoopSpacing.md,
    },
    postAuthorInfo: {
        flex: 1,
        marginLeft: CampusLoopSpacing.sm,
    },
    authorName: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    postTime: {
        fontSize: CampusLoopTypography.fontSize.sm,
    },
    categoryBadge: {
        paddingHorizontal: CampusLoopSpacing.sm,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryBadgeText: {
        fontSize: CampusLoopTypography.fontSize.xs,
        fontWeight: CampusLoopTypography.fontWeight.medium,
        color: '#FFFFFF',
    },
    postContent: {
        fontSize: CampusLoopTypography.fontSize.base,
        lineHeight: CampusLoopTypography.lineHeight.relaxed * CampusLoopTypography.fontSize.base,
        marginBottom: CampusLoopSpacing.md,
    },
    postActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        paddingTop: CampusLoopSpacing.sm,
    },
    actionButton: {
        marginRight: CampusLoopSpacing.lg,
    },
    actionText: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
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
