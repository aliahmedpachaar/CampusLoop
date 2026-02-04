/**
 * CampusLoop Button Component
 * Reusable button with variants and animations
 */

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import {
    CampusLoopSpacing,
    CampusLoopBorderRadius,
    CampusLoopTypography,
    CampusLoopShadows,
} from '../../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface CampusLoopButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
}

export const CampusLoopButton: React.FC<CampusLoopButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon,
    style,
}) => {
    const { colors } = useCampusLoopTheme();

    const isDisabled = disabled || loading;

    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            paddingVertical: CampusLoopSpacing.md,
            paddingHorizontal: CampusLoopSpacing.xl,
            borderRadius: CampusLoopBorderRadius.md,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isDisabled ? 0.5 : 1,
        };

        if (fullWidth) {
            baseStyle.width = '100%';
        }

        switch (variant) {
            case 'outline':
                return {
                    ...baseStyle,
                    borderWidth: 2,
                    borderColor: colors.primary,
                    backgroundColor: 'transparent',
                };
            case 'ghost':
                return {
                    ...baseStyle,
                    backgroundColor: 'transparent',
                };
            case 'secondary':
                return {
                    ...baseStyle,
                    backgroundColor: colors.secondary,
                    ...CampusLoopShadows.md,
                };
            default: // primary
                return {
                    ...baseStyle,
                    ...CampusLoopShadows.md,
                };
        }
    };

    const getTextStyle = (): TextStyle => {
        const baseStyle: TextStyle = {
            fontSize: CampusLoopTypography.fontSize.base,
            fontWeight: CampusLoopTypography.fontWeight.semibold,
        };

        switch (variant) {
            case 'outline':
            case 'ghost':
                return {
                    ...baseStyle,
                    color: colors.primary,
                };
            default:
                return {
                    ...baseStyle,
                    color: '#FFFFFF',
                };
        }
    };

    const renderContent = () => (
        <>
            {loading ? (
                <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#FFFFFF'} />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    <Text style={[getTextStyle(), icon ? { marginLeft: CampusLoopSpacing.sm } : undefined]}>
                        {title}
                    </Text>
                </>
            )}
        </>
    );

    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={isDisabled}
                activeOpacity={0.8}
                style={style}>
                <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={getButtonStyle()}>
                    {renderContent()}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[getButtonStyle(), style]}>
            {renderContent()}
        </TouchableOpacity>
    );
};
