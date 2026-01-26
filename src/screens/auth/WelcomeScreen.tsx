/**
 * CampusLoop Welcome Screen
 * Initial landing screen with app branding
 */

import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { CampusLoopButton } from '../../components/common/Button';
import {
    CampusLoopSpacing,
    CampusLoopTypography,
} from '../../constants/theme';

const { height } = Dimensions.get('window');

interface WelcomeScreenProps {
    navigation: any;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();
    const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(50);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}>
                <View style={styles.header}>
                    <Text style={styles.logo}>🎓</Text>
                    <Text style={styles.title}>CampusLoop</Text>
                    <Text style={styles.tagline}>
                        Connect. Collaborate. Succeed Together.
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <CampusLoopButton
                        title="Get Started"
                        onPress={() => navigation.navigate('Signup')}
                        variant="secondary"
                        fullWidth
                        style={styles.button}
                    />
                    <CampusLoopButton
                        title="Login"
                        onPress={() => navigation.navigate('Login')}
                        variant="outline"
                        fullWidth
                        style={styles.button}
                    />
                </View>

                <Text style={styles.footer}>
                    Join your university community today
                </Text>
            </Animated.View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '100%',
        paddingHorizontal: CampusLoopSpacing['2xl'],
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: height * 0.1,
    },
    logo: {
        fontSize: 80,
        marginBottom: CampusLoopSpacing.lg,
    },
    title: {
        fontSize: CampusLoopTypography.fontSize['4xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        color: '#FFFFFF',
        marginBottom: CampusLoopSpacing.md,
    },
    tagline: {
        fontSize: CampusLoopTypography.fontSize.lg,
        color: '#FFFFFF',
        opacity: 0.9,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        marginBottom: CampusLoopSpacing.xl,
    },
    button: {
        marginBottom: CampusLoopSpacing.base,
    },
    footer: {
        fontSize: CampusLoopTypography.fontSize.sm,
        color: '#FFFFFF',
        opacity: 0.8,
    },
});
