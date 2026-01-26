/**
 * CampusLoop Category Chip Component
 * Chip for categories and tags
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import {
    CampusLoopSpacing,
    CampusLoopBorderRadius,
    CampusLoopTypography,
} from '../../constants/theme';

interface CampusLoopCategoryChipProps {
    label: string;
    selected?: boolean;
    onPress?: () => void;
    color?: string;
    icon?: React.ReactNode;
    style?: ViewStyle;
}

export const CampusLoopCategoryChip: React.FC<CampusLoopCategoryChipProps> = ({
    label,
    selected = false,
    onPress,
    color,
    icon,
    style,
}) => {
    const { colors } = useCampusLoopTheme();

    const chipColor = color || colors.primary;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={0.7}
            style={[
                styles.chip,
                {
                    backgroundColor: selected ? chipColor : colors.surface,
                    borderColor: chipColor,
                    borderWidth: selected ? 0 : 1,
                    borderRadius: CampusLoopBorderRadius.full,
                },
                style,
            ]}>
            {icon && <>{icon}</>}
            <Text
                style={[
                    styles.label,
                    {
                        color: selected ? '#FFFFFF' : chipColor,
                        fontSize: CampusLoopTypography.fontSize.sm,
                        fontWeight: CampusLoopTypography.fontWeight.medium,
                    },
                    icon && { marginLeft: CampusLoopSpacing.xs },
                ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: CampusLoopSpacing.sm,
        paddingHorizontal: CampusLoopSpacing.base,
        marginRight: CampusLoopSpacing.sm,
    },
    label: {
        textAlign: 'center',
    },
});
