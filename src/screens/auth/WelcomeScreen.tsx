/**
 * CampusLoop Welcome Screen
 * Beautiful onboarding with campus-focused illustrations
 */

import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    Image,
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
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';
import Svg, { Circle, Path, G, Ellipse, Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import {
    CampusLoopSpacing,
    CampusLoopTypography,
    CampusLoopBorderRadius,
    CampusLoopShadows,
} from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
    navigation: any;
}

// Campus Illustration Component
const CampusIllustration = () => {
    const floatAnim = useSharedValue(0);

    useEffect(() => {
        floatAnim.value = withRepeat(
            withSequence(
                withTiming(8, { duration: 2000 }),
                withTiming(0, { duration: 2000 })
            ),
            -1,
            true
        );
    }, []);

    const floatStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: floatAnim.value }],
    }));

    return (
        <Animated.View style={[styles.illustrationContainer, floatStyle]}>
            <Svg width={width * 0.85} height={280} viewBox="0 0 340 280">
                <Defs>
                    <RadialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
                        <Stop offset="0%" stopColor="#FCD34D" />
                        <Stop offset="100%" stopColor="#F59E0B" />
                    </RadialGradient>
                </Defs>

                {/* Sky Elements */}
                <Circle cx="290" cy="50" r="30" fill="url(#sunGrad)" />

                {/* Clouds */}
                <G opacity="0.8">
                    <Ellipse cx="60" cy="40" rx="25" ry="12" fill="#FFFFFF" />
                    <Ellipse cx="80" cy="35" rx="20" ry="10" fill="#FFFFFF" />
                    <Ellipse cx="45" cy="38" rx="15" ry="8" fill="#FFFFFF" />
                </G>
                <G opacity="0.6">
                    <Ellipse cx="220" cy="70" rx="20" ry="10" fill="#FFFFFF" />
                    <Ellipse cx="235" cy="65" rx="15" ry="8" fill="#FFFFFF" />
                </G>

                {/* Ground */}
                <Path d="M0 230 Q170 200 340 230 L340 280 L0 280 Z" fill="#10B981" opacity="0.3" />
                <Path d="M0 250 Q170 220 340 250 L340 280 L0 280 Z" fill="#10B981" opacity="0.5" />

                {/* University Building */}
                <G transform="translate(100, 90)">
                    {/* Main Building */}
                    <Rect x="0" y="50" width="140" height="100" fill="#F8FAFC" rx="4" />
                    <Rect x="10" y="50" width="120" height="8" fill="#0D9488" />

                    {/* Roof */}
                    <Path d="M-10 50 L70 10 L150 50 Z" fill="#1E293B" />
                    <Circle cx="70" cy="30" r="12" fill="#F59E0B" />

                    {/* Windows */}
                    <Rect x="20" y="70" width="25" height="30" fill="#0EA5E9" opacity="0.6" rx="2" />
                    <Rect x="58" y="70" width="25" height="30" fill="#0EA5E9" opacity="0.6" rx="2" />
                    <Rect x="96" y="70" width="25" height="30" fill="#0EA5E9" opacity="0.6" rx="2" />

                    {/* Door */}
                    <Rect x="55" y="115" width="30" height="35" fill="#1E293B" rx="2" />
                    <Circle cx="80" cy="132" r="2" fill="#F59E0B" />

                    {/* Pillars */}
                    <Rect x="25" y="105" width="8" height="45" fill="#E2E8F0" />
                    <Rect x="107" y="105" width="8" height="45" fill="#E2E8F0" />
                </G>

                {/* Students */}
                {/* Student 1 */}
                <G transform="translate(50, 200)">
                    <Circle cx="15" cy="10" r="12" fill="#FEF3C7" />
                    <Rect x="8" y="22" width="14" height="25" fill="#0D9488" rx="4" />
                    <Rect x="5" y="47" width="8" height="15" fill="#1E293B" rx="2" />
                    <Rect x="17" y="47" width="8" height="15" fill="#1E293B" rx="2" />
                    <Circle cx="12" cy="8" r="3" fill="#1E293B" />
                    <Circle cx="18" cy="8" r="3" fill="#1E293B" />
                    <Rect x="0" y="0" width="12" height="20" fill="#1E293B" rx="6" transform="rotate(-30, 6, 10)" />
                </G>

                {/* Student 2 */}
                <G transform="translate(270, 195)">
                    <Circle cx="15" cy="10" r="12" fill="#FECACA" />
                    <Rect x="8" y="22" width="14" height="25" fill="#F97316" rx="4" />
                    <Rect x="5" y="47" width="8" height="15" fill="#1E293B" rx="2" />
                    <Rect x="17" y="47" width="8" height="15" fill="#1E293B" rx="2" />
                    <Circle cx="12" cy="8" r="3" fill="#1E293B" />
                    <Circle cx="18" cy="8" r="3" fill="#1E293B" />
                </G>

                {/* Student 3 walking */}
                <G transform="translate(160, 210)">
                    <Circle cx="12" cy="8" r="10" fill="#E0E7FF" />
                    <Rect x="6" y="18" width="12" height="20" fill="#8B5CF6" rx="3" />
                    <Rect x="4" y="38" width="6" height="12" fill="#1E293B" rx="2" />
                    <Rect x="14" y="38" width="6" height="12" fill="#1E293B" rx="2" />
                </G>

                {/* Trees */}
                <G transform="translate(20, 160)">
                    <Rect x="12" y="40" width="8" height="30" fill="#92400E" />
                    <Circle cx="16" cy="30" r="22" fill="#10B981" />
                    <Circle cx="8" cy="38" r="15" fill="#059669" />
                    <Circle cx="24" cy="38" r="15" fill="#059669" />
                </G>

                <G transform="translate(295, 170)">
                    <Rect x="10" y="35" width="6" height="25" fill="#92400E" />
                    <Circle cx="13" cy="25" r="18" fill="#10B981" />
                    <Circle cx="6" cy="32" r="12" fill="#059669" />
                    <Circle cx="20" cy="32" r="12" fill="#059669" />
                </G>

                {/* Floating Elements - Books & Graduation Cap */}
                <G transform="translate(35, 100)" opacity="0.9">
                    <Rect x="0" y="0" width="20" height="25" fill="#0D9488" rx="2" />
                    <Rect x="2" y="2" width="16" height="2" fill="#FFFFFF" opacity="0.5" />
                </G>

                <G transform="translate(280, 120)" opacity="0.9">
                    <Path d="M0 10 L15 0 L30 10 L15 20 Z" fill="#1E293B" />
                    <Rect x="13" y="8" width="4" height="12" fill="#1E293B" />
                    <Circle cx="15" cy="22" r="3" fill="#F59E0B" />
                </G>
            </Svg>
        </Animated.View>
    );
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="dark-content" />

            {/* Background Decoration */}
            <View style={styles.bgDecoration}>
                <View style={[styles.bgCircle, styles.bgCircle1, { backgroundColor: colors.primary + '10' }]} />
                <View style={[styles.bgCircle, styles.bgCircle2, { backgroundColor: colors.accent + '08' }]} />
            </View>

            {/* Illustration */}
            <CampusIllustration />

            {/* Content */}
            <View style={styles.content}>
                <Animated.View entering={FadeInUp.delay(300).duration(600)}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        CampusLoop
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Connect with your campus community.{'\n'}
                        Create activities, find study groups,{'\n'}
                        and make university life awesome!
                    </Text>
                </Animated.View>

                {/* Features */}
                <Animated.View
                    entering={FadeInUp.delay(500).duration(600)}
                    style={styles.features}
                >
                    <View style={styles.featureRow}>
                        <View style={[styles.featureIcon, { backgroundColor: colors.primary + '15' }]}>
                            <Ionicons name="people" size={20} color={colors.primary} />
                        </View>
                        <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                            Find study partners & groups
                        </Text>
                    </View>
                    <View style={styles.featureRow}>
                        <View style={[styles.featureIcon, { backgroundColor: colors.secondary + '15' }]}>
                            <Ionicons name="calendar" size={20} color={colors.secondary} />
                        </View>
                        <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                            Create & join campus activities
                        </Text>
                    </View>
                    <View style={styles.featureRow}>
                        <View style={[styles.featureIcon, { backgroundColor: colors.accent + '15' }]}>
                            <Ionicons name="chatbubbles" size={20} color={colors.accent} />
                        </View>
                        <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                            Chat & plan together
                        </Text>
                    </View>
                </Animated.View>

                {/* Buttons */}
                <Animated.View
                    entering={FadeInUp.delay(700).duration(600)}
                    style={styles.buttonContainer}
                >
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('Signup')}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={[colors.gradientStart, colors.gradientEnd]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.primaryButtonText}>Get Started</Text>
                            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.secondaryButton, { borderColor: colors.border }]}
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                            I already have an account
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgDecoration: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    bgCircle: {
        position: 'absolute',
        borderRadius: 999,
    },
    bgCircle1: {
        width: width * 0.8,
        height: width * 0.8,
        top: -width * 0.3,
        right: -width * 0.2,
    },
    bgCircle2: {
        width: width * 0.6,
        height: width * 0.6,
        bottom: -width * 0.1,
        left: -width * 0.2,
    },
    illustrationContainer: {
        alignItems: 'center',
        marginTop: height * 0.08,
    },
    content: {
        flex: 1,
        paddingHorizontal: CampusLoopSpacing.xl,
        paddingBottom: CampusLoopSpacing['3xl'],
        justifyContent: 'flex-end',
    },
    title: {
        fontSize: CampusLoopTypography.fontSize['4xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        textAlign: 'center',
        marginBottom: CampusLoopSpacing.md,
    },
    subtitle: {
        fontSize: CampusLoopTypography.fontSize.base,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: CampusLoopSpacing.xl,
    },
    features: {
        marginBottom: CampusLoopSpacing.xl,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: CampusLoopSpacing.md,
    },
    featureIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: CampusLoopSpacing.md,
    },
    featureText: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    buttonContainer: {
        gap: CampusLoopSpacing.md,
    },
    primaryButton: {
        borderRadius: CampusLoopBorderRadius.lg,
        overflow: 'hidden',
        ...CampusLoopShadows.md,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: CampusLoopSpacing.base + 2,
        gap: CampusLoopSpacing.sm,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    secondaryButton: {
        paddingVertical: CampusLoopSpacing.base,
        borderRadius: CampusLoopBorderRadius.lg,
        borderWidth: 1.5,
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
});

export default WelcomeScreen;
