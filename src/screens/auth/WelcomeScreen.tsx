/**
 * CampusLoop Welcome Screen
 * Hero landing page
 */

import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withDelay,
    withSequence,
    withRepeat,
} from 'react-native-reanimated';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { CampusLoopSpacing, CampusLoopTypography, CampusLoopBorderRadius } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
    navigation: any;
}

const features = [
    { icon: '📚', label: 'Study Together' },
    { icon: '⚽', label: 'Sports & Fun' },
    { icon: '🍕', label: 'Food & Hangouts' },
    { icon: '💬', label: 'Group Chats' },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();

    // Animated values — these use useSharedValue so they work on web
    const logoScale   = useSharedValue(0.7);
    const logoOpacity = useSharedValue(0);
    const textOpacity = useSharedValue(0);
    const textY       = useSharedValue(30);
    const featureOpacity = useSharedValue(0);
    const btnOpacity  = useSharedValue(0);
    const btnY        = useSharedValue(20);
    const pulse       = useSharedValue(1);

    useEffect(() => {
        // Logo pop-in
        logoScale.value   = withSpring(1, { damping: 12, stiffness: 120 });
        logoOpacity.value = withTiming(1, { duration: 500 });
        // Text slide-up
        textOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
        textY.value       = withDelay(300, withSpring(0, { damping: 14 }));
        // Features fade
        featureOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
        // Buttons slide-up
        btnOpacity.value  = withDelay(800, withTiming(1, { duration: 400 }));
        btnY.value        = withDelay(800, withSpring(0, { damping: 14 }));
        // Subtle pulse on logo ring
        pulse.value = withDelay(1200, withRepeat(
            withSequence(
                withTiming(1.08, { duration: 1800 }),
                withTiming(1,    { duration: 1800 })
            ), -1, true
        ));
    }, []);

    const logoStyle    = useAnimatedStyle(() => ({ opacity: logoOpacity.value, transform: [{ scale: logoScale.value }] }));
    const textStyle    = useAnimatedStyle(() => ({ opacity: textOpacity.value, transform: [{ translateY: textY.value }] }));
    const featureStyle = useAnimatedStyle(() => ({ opacity: featureOpacity.value }));
    const btnStyle     = useAnimatedStyle(() => ({ opacity: btnOpacity.value, transform: [{ translateY: btnY.value }] }));
    const pulseStyle   = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Full-bleed gradient background */}
            <LinearGradient
                colors={['#0D9488', '#0EA5E9', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.6, y: 1 }}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Decorative blobs */}
            <View style={[styles.blob, styles.blobTop]} />
            <View style={[styles.blob, styles.blobBottom]} />

            {/* ── Top section: logo + branding ── */}
            <View style={styles.topSection}>
                <Animated.View style={[styles.logoRingWrap, pulseStyle]}>
                    <View style={styles.logoRing}>
                        <Animated.View style={[styles.logoWrap, logoStyle]}>
                            <Image
                                source={require('../../assets/images/logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </Animated.View>
                    </View>
                </Animated.View>

                <Animated.View style={[styles.brandWrap, textStyle]}>
                    <Text style={styles.appName}>CampusLoop</Text>
                    <Text style={styles.tagline}>
                        Where campus life{'\n'}comes together
                    </Text>
                </Animated.View>
            </View>

            {/* ── Feature chips ── */}
            <Animated.View style={[styles.featuresRow, featureStyle]}>
                {features.map(f => (
                    <View key={f.label} style={styles.chip}>
                        <Text style={styles.chipEmoji}>{f.icon}</Text>
                        <Text style={styles.chipLabel}>{f.label}</Text>
                    </View>
                ))}
            </Animated.View>

            {/* ── Stats strip ── */}
            <Animated.View style={[styles.statsStrip, featureStyle]}>
                <View style={styles.statItem}>
                    <Text style={styles.statNum}>500+</Text>
                    <Text style={styles.statLbl}>Students</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNum}>1,200+</Text>
                    <Text style={styles.statLbl}>Activities</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNum}>50+</Text>
                    <Text style={styles.statLbl}>Groups</Text>
                </View>
            </Animated.View>

            {/* ── Bottom card with buttons ── */}
            <Animated.View style={[styles.bottomCard, btnStyle]}>
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => navigation.navigate('Signup')}
                    activeOpacity={0.9}
                >
                    <Text style={styles.primaryBtnText}>Get Started</Text>
                    <Ionicons name="arrow-forward" size={20} color="#0D9488" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => navigation.navigate('Login')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.secondaryBtnText}>I already have an account</Text>
                </TouchableOpacity>

                <Text style={styles.legalText}>
                    By continuing you agree to our Terms & Privacy Policy
                </Text>
            </Animated.View>
        </View>
    );
};

const CARD_RADIUS = 32;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D9488',
    },

    // Decorative blobs
    blob: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    blobTop: {
        width: width * 0.9,
        height: width * 0.9,
        top: -width * 0.35,
        right: -width * 0.25,
    },
    blobBottom: {
        width: width * 0.7,
        height: width * 0.7,
        bottom: height * 0.25,
        left: -width * 0.3,
    },

    // Top section
    topSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === 'web' ? 60 : 80,
        paddingHorizontal: CampusLoopSpacing.xl,
    },
    logoRingWrap: {
        marginBottom: CampusLoopSpacing.xl,
    },
    logoRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    logoWrap: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    logo: {
        width: 72,
        height: 72,
    },
    brandWrap: {
        alignItems: 'center',
    },
    appName: {
        fontSize: 38,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
        marginBottom: CampusLoopSpacing.sm,
    },
    tagline: {
        fontSize: CampusLoopTypography.fontSize.lg,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        lineHeight: 28,
        fontWeight: '400',
    },

    // Feature chips
    featuresRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: CampusLoopSpacing.sm,
        paddingHorizontal: CampusLoopSpacing.xl,
        marginBottom: CampusLoopSpacing.xl,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.18)',
        paddingHorizontal: CampusLoopSpacing.md,
        paddingVertical: CampusLoopSpacing.xs + 2,
        borderRadius: CampusLoopBorderRadius.full,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    chipEmoji: {
        fontSize: 15,
    },
    chipLabel: {
        fontSize: CampusLoopTypography.fontSize.sm,
        color: '#FFFFFF',
        fontWeight: '600',
    },

    // Stats strip
    statsStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: CampusLoopSpacing.xl,
        marginBottom: CampusLoopSpacing.xl,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: CampusLoopBorderRadius.xl,
        paddingVertical: CampusLoopSpacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNum: {
        fontSize: CampusLoopTypography.fontSize.xl,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    statLbl: {
        fontSize: CampusLoopTypography.fontSize.xs,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 32,
        backgroundColor: 'rgba(255,255,255,0.25)',
    },

    // Bottom card
    bottomCard: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: CARD_RADIUS,
        borderTopRightRadius: CARD_RADIUS,
        paddingHorizontal: CampusLoopSpacing.xl,
        paddingTop: CampusLoopSpacing.xl,
        paddingBottom: Platform.OS === 'web' ? CampusLoopSpacing.xl : 40,
        gap: CampusLoopSpacing.md,
    },
    primaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: CampusLoopSpacing.sm,
        backgroundColor: '#F0FFFE',
        borderWidth: 2,
        borderColor: '#0D9488',
        paddingVertical: CampusLoopSpacing.base + 2,
        borderRadius: CampusLoopBorderRadius.lg,
    },
    primaryBtnText: {
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: '700',
        color: '#0D9488',
    },
    secondaryBtn: {
        backgroundColor: '#0D9488',
        paddingVertical: CampusLoopSpacing.base + 2,
        borderRadius: CampusLoopBorderRadius.lg,
        alignItems: 'center',
    },
    secondaryBtnText: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    legalText: {
        fontSize: 11,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 16,
    },
});

export default WelcomeScreen;
