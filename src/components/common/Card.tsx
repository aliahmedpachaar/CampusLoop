/**
 * CampusLoop Card Component
 * Reusable card container with elevation
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import {
    CampusLoopSpacing,
    CampusLoopBorderRadius,
    CampusLoopShadows,
} from '../../constants/theme';

interface CampusLoopCardProps {
    children: React.ReactNode;
    onPress?: () => void;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    style?: ViewStyle;
}

export const CampusLoopCard: React.FC<CampusLoopCardProps> = ({
    children,
    onPress,
    padding = 'md',
    style,
}) => {
    const { colors } = useCampusLoopTheme();

    const getPadding = () => {
        switch (padding) {
            case 'none':
                return 0;
            case 'sm':
                return CampusLoopSpacing.sm;
            case 'lg':
                return CampusLoopSpacing.lg;
            default:
                return CampusLoopSpacing.base;
        }
    };

    const cardStyle: ViewStyle = {
        backgroundColor: colors.surface,
        borderRadius: CampusLoopBorderRadius.lg,
        padding: getPadding(),
        ...CampusLoopShadows.md,
    };

    if (onPress) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                style={[cardStyle, style]}>
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={[cardStyle, style]}>{children}</View>;
};
