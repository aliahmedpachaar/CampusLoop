/**
 * Animated Mascot Component
 * Cute owl mascot that responds to password input
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CampusLoopSpacing } from '../../constants/theme';

interface AnimatedMascotProps {
    isPasswordFocused: boolean;
    showPassword: boolean;
}

export const AnimatedMascot: React.FC<AnimatedMascotProps> = ({
    isPasswordFocused,
    showPassword,
}) => {
    const scaleAnim = new Animated.Value(1);
    const bounceAnim = new Animated.Value(0);

    useEffect(() => {
        // Gentle breathing animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.05,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Bounce when password is focused
        if (isPasswordFocused && !showPassword) {
            Animated.spring(bounceAnim, {
                toValue: -10,
                friction: 3,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(bounceAnim, {
                toValue: 0,
                friction: 3,
                useNativeDriver: true,
            }).start();
        }
    }, [isPasswordFocused, showPassword]);

    // Determine which eyes to show
    const getEyes = () => {
        if (isPasswordFocused && !showPassword) {
            // Eyes closed
            return '😌';
        } else if (showPassword) {
            // Eyes wide open
            return '😳';
        } else {
            // Normal happy eyes
            return '🦉';
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        { scale: scaleAnim },
                        { translateY: bounceAnim },
                    ],
                },
            ]}
        >
            <View style={styles.mascotContainer}>
                <Text style={styles.mascot}>{getEyes()}</Text>
                <View style={styles.hatContainer}>
                    <Text style={styles.hat}>🎓</Text>
                </View>
            </View>
            <Text style={styles.bubble}>
                {isPasswordFocused && !showPassword
                    ? "I won't peek! 🙈"
                    : showPassword
                        ? "Oh! I can see it! 👀"
                        : "Welcome back! 👋"}
            </Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: CampusLoopSpacing['2xl'],
    },
    mascotContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mascot: {
        fontSize: 120,
        textAlign: 'center',
    },
    hatContainer: {
        position: 'absolute',
        top: -20,
        right: 20,
        transform: [{ rotate: '15deg' }],
    },
    hat: {
        fontSize: 40,
    },
    bubble: {
        marginTop: CampusLoopSpacing.base,
        fontSize: 16,
        color: '#64748B',
        fontWeight: '500',
        textAlign: 'center',
    },
});
