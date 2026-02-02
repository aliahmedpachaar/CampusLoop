/**
 * Enhanced Post Card Component
 * Beautiful post card with like animation and interactions
 */

import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { CampusLoopCard } from '../common/Card';
import { CampusLoopAvatar } from '../common/Avatar';
import { CampusLoopPost, CampusLoopPostCategoryLabels, CampusLoopPostCategoryColors } from '../../types/post';
import { formatRelativeTime } from '../../utils/formatting';
import {
    CampusLoopSpacing,
    CampusLoopTypography,
    CampusLoopBorderRadius,
} from '../../constants/theme';

interface PostCardProps {
    post: CampusLoopPost;
    onLike: (postId: string) => void;
    onComment?: (postId: string) => void;
    onShare?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
    post,
    onLike,
    onComment,
    onShare,
}) => {
    const { colors } = useCampusLoopTheme();
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likesCount, setLikesCount] = useState(post.likesCount);

    // Animation values
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const heartScale = useRef(new Animated.Value(0)).current;
    const heartOpacity = useRef(new Animated.Value(0)).current;

    const handleLike = () => {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(newIsLiked ? likesCount + 1 : likesCount - 1);

        // Button scale animation
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }),
        ]).start();

        // Heart burst animation (only when liking)
        if (newIsLiked) {
            heartScale.setValue(0);
            heartOpacity.setValue(1);

            Animated.parallel([
                Animated.spring(heartScale, {
                    toValue: 1.5,
                    friction: 4,
                    useNativeDriver: true,
                }),
                Animated.timing(heartOpacity, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]).start();
        }

        onLike(post.id);
    };

    return (
        <CampusLoopCard style={styles.postCard}>
            {/* Header */}
            <View style={styles.postHeader}>
                <CampusLoopAvatar
                    name={post.authorName}
                    size="small"
                    imageUri={post.authorAvatar}
                />
                <View style={styles.postAuthorInfo}>
                    <Text style={[styles.authorName, { color: colors.text }]}>
                        {post.authorName}
                    </Text>
                    <Text style={[styles.postTime, { color: colors.textSecondary }]}>
                        {formatRelativeTime(post.createdAt)}
                    </Text>
                </View>
                <View
                    style={[
                        styles.categoryBadge,
                        { backgroundColor: CampusLoopPostCategoryColors[post.category] },
                    ]}
                >
                    <Text style={styles.categoryBadgeText}>
                        {CampusLoopPostCategoryLabels[post.category]}
                    </Text>
                </View>
            </View>

            {/* Content */}
            <Text style={[styles.postContent, { color: colors.text }]}>
                {post.content}
            </Text>

            {/* Actions */}
            <View style={[styles.postActions, { borderTopColor: colors.border }]}>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleLike}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.actionText,
                                { color: isLiked ? colors.error : colors.textSecondary },
                            ]}
                        >
                            {isLiked ? '❤️' : '🤍'} {likesCount}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onComment?.(post.id)}
                >
                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                        💬 {post.commentsCount}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onShare?.(post.id)}
                >
                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                        🔗 Share
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Heart burst animation overlay */}
            <Animated.Text
                style={[
                    styles.heartBurst,
                    {
                        opacity: heartOpacity,
                        transform: [{ scale: heartScale }],
                    },
                ]}
            >
                ❤️
            </Animated.Text>
        </CampusLoopCard>
    );
};

const styles = StyleSheet.create({
    postCard: {
        marginBottom: CampusLoopSpacing.base,
        overflow: 'visible',
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
        marginTop: 2,
    },
    categoryBadge: {
        paddingHorizontal: CampusLoopSpacing.sm,
        paddingVertical: 4,
        borderRadius: CampusLoopBorderRadius.base,
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
        paddingTop: CampusLoopSpacing.sm,
    },
    actionButton: {
        marginRight: CampusLoopSpacing.lg,
        paddingVertical: CampusLoopSpacing.xs,
    },
    actionText: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    heartBurst: {
        position: 'absolute',
        fontSize: 80,
        alignSelf: 'center',
        top: '40%',
    },
});
