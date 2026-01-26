/**
 * CampusLoop Avatar Component
 * User avatar with fallback to initials
 */

import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { CampusLoopTypography } from '../../constants/theme';
import { getInitials } from '../../utils/formatting';

type AvatarSize = 'small' | 'medium' | 'large';

interface CampusLoopAvatarProps {
    imageUri?: string;
    name: string;
    size?: AvatarSize;
    showOnlineStatus?: boolean;
    style?: ViewStyle;
}

export const CampusLoopAvatar: React.FC<CampusLoopAvatarProps> = ({
    imageUri,
    name,
    size = 'medium',
    showOnlineStatus = false,
    style,
}) => {
    const { colors } = useCampusLoopTheme();

    const getSize = () => {
        switch (size) {
            case 'small':
                return 40;
            case 'large':
                return 80;
            default:
                return 56;
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'small':
                return CampusLoopTypography.fontSize.sm;
            case 'large':
                return CampusLoopTypography.fontSize['2xl'];
            default:
                return CampusLoopTypography.fontSize.lg;
        }
    };

    const avatarSize = getSize();
    const initials = getInitials(name);

    return (
        <View style={[styles.container, style]}>
            {imageUri ? (
                <Image
                    source={{ uri: imageUri }}
                    style={[
                        styles.image,
                        {
                            width: avatarSize,
                            height: avatarSize,
                            borderRadius: avatarSize / 2,
                        },
                    ]}
                />
            ) : (
                <View
                    style={[
                        styles.placeholder,
                        {
                            width: avatarSize,
                            height: avatarSize,
                            borderRadius: avatarSize / 2,
                            backgroundColor: colors.primary,
                        },
                    ]}>
                    <Text
                        style={[
                            styles.initials,
                            {
                                fontSize: getFontSize(),
                                fontWeight: CampusLoopTypography.fontWeight.semibold,
                                color: '#FFFFFF',
                            },
                        ]}>
                        {initials}
                    </Text>
                </View>
            )}

            {showOnlineStatus && (
                <View
                    style={[
                        styles.onlineIndicator,
                        {
                            backgroundColor: colors.success,
                            borderColor: colors.surface,
                        },
                    ]}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    image: {
        resizeMode: 'cover',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        textAlign: 'center',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
    },
});
