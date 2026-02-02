/**
 * Skeleton Loader Component
 * Shimmer loading effect for better perceived performance
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { CampusLoopSpacing, CampusLoopBorderRadius } from '../../constants/theme';

interface SkeletonLoaderProps {
    variant?: 'card' | 'text' | 'circle' | 'avatar';
    width?: number | string;
    height?: number;
    style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    variant = 'text',
    width = '100%',
    height = 20,
    style,
}) => {
    const { colors } = useCampusLoopTheme();
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    const getVariantStyle = () => {
        switch (variant) {
            case 'card':
                return {
                    width,
                    height: height || 200,
                    borderRadius: CampusLoopBorderRadius.lg,
                };
            case 'circle':
                return {
                    width: height,
                    height,
                    borderRadius: height / 2,
                };
            case 'avatar':
                return {
                    width: height,
                    height,
                    borderRadius: height / 2,
                };
            case 'text':
            default:
                return {
                    width,
                    height,
                    borderRadius: CampusLoopBorderRadius.sm,
                };
        }
    };

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    backgroundColor: colors.border,
                    opacity,
                },
                getVariantStyle(),
                style,
            ]}
        />
    );
};

export const PostCardSkeleton: React.FC = () => {
    const { colors } = useCampusLoopTheme();

    return (
        <View style={[styles.postCard, { backgroundColor: colors.surface }]}>
            <View style={styles.postHeader}>
                <SkeletonLoader variant="avatar" height={40} />
                <View style={styles.postAuthorInfo}>
                    <SkeletonLoader width={120} height={16} />
                    <SkeletonLoader width={80} height={12} style={{ marginTop: 4 }} />
                </View>
            </View>
            <SkeletonLoader width="100%" height={16} style={{ marginBottom: 8 }} />
            <SkeletonLoader width="90%" height={16} style={{ marginBottom: 8 }} />
            <SkeletonLoader width="70%" height={16} />
        </View>
    );
};

const styles = StyleSheet.create({
    skeleton: {},
    postCard: {
        padding: CampusLoopSpacing.base,
        borderRadius: CampusLoopBorderRadius.lg,
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
});
