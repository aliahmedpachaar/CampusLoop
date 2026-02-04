/**
 * CampusLoop Input Component
 * Reusable text input with validation and icons
 */

import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TextInputProps,
    TouchableOpacity,
} from 'react-native';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import {
    CampusLoopSpacing,
    CampusLoopBorderRadius,
    CampusLoopTypography,
} from '../../constants/theme';

interface CampusLoopInputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconPress?: () => void;
    containerStyle?: any;
}

export const CampusLoopInput: React.FC<CampusLoopInputProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    onRightIconPress,
    style,
    containerStyle,
    ...props
}) => {
    const { colors } = useCampusLoopTheme();
    const [isFocused, setIsFocused] = useState(false);

    const getBorderColor = () => {
        if (error) return colors.error;
        if (isFocused) return colors.primary;
        return colors.border;
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text
                    style={[
                        styles.label,
                        {
                            color: colors.text,
                            fontSize: CampusLoopTypography.fontSize.sm,
                            fontWeight: CampusLoopTypography.fontWeight.medium,
                        },
                    ]}>
                    {label}
                </Text>
            )}

            <View
                style={[
                    styles.inputContainer,
                    {
                        borderColor: getBorderColor(),
                        backgroundColor: colors.surface,
                        borderRadius: CampusLoopBorderRadius.md,
                    },
                ]}
            >
                {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

                <TextInput
                    style={[
                        styles.input,
                        {
                            color: colors.text,
                            fontSize: CampusLoopTypography.fontSize.base,
                            backgroundColor: 'transparent',
                        },
                        leftIcon ? { paddingLeft: 0 } : undefined,
                        rightIcon ? { paddingRight: 0 } : undefined,
                        style,
                    ]}
                    placeholderTextColor={colors.textTertiary}
                    autoCorrect={false}
                    textContentType={props.secureTextEntry ? 'oneTimeCode' : props.textContentType}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    {...props}
                />

                {rightIcon && (
                    <View style={styles.rightIcon}>
                        {rightIcon}
                    </View>
                )}
            </View>

            {error && (
                <Text
                    style={[
                        styles.error,
                        {
                            color: colors.error,
                            fontSize: CampusLoopTypography.fontSize.sm,
                        },
                    ]}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: CampusLoopSpacing.base,
    },
    label: {
        marginBottom: CampusLoopSpacing.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        paddingHorizontal: CampusLoopSpacing.md,
    },
    input: {
        flex: 1,
        paddingVertical: CampusLoopSpacing.md,
    },
    leftIcon: {
        marginRight: CampusLoopSpacing.sm,
    },
    rightIcon: {
        marginLeft: CampusLoopSpacing.sm,
    },
    error: {
        marginTop: CampusLoopSpacing.xs,
    },
});
