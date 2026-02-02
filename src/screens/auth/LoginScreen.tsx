/**
 * CampusLoop Enhanced Login Screen
 * Beautiful animated login with mascot character
 */

import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Animated,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopButton } from '../../components/common/Button';
import { CampusLoopInput } from '../../components/common/Input';
import { AnimatedMascot } from '../../components/common/AnimatedMascot';
import { CampusLoopValidation } from '../../utils/validation';
import {
    CampusLoopSpacing,
    CampusLoopTypography,
    CampusLoopBorderRadius,
    CampusLoopShadows,
    CampusLoopGradients,
} from '../../constants/theme';

const { width } = Dimensions.get('window');

interface LoginScreenProps {
    navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();
    const { login } = useCampusLoopAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    // Animation values
    const shakeAnimation = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // Entrance animation
    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const validate = (): boolean => {
        const newErrors = { email: '', password: '' };
        let isValid = true;

        if (!CampusLoopValidation.isRequired(email)) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!CampusLoopValidation.isValidEmail(email)) {
            newErrors.email = 'Invalid email format';
            isValid = false;
        }

        if (!CampusLoopValidation.isRequired(password)) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const triggerShakeAnimation = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: -10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleLogin = async () => {
        if (!validate()) {
            triggerShakeAnimation();
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            // Navigation handled by auth state change
        } catch (error: any) {
            triggerShakeAnimation();
            Alert.alert('Login Failed', error.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {/* Floating particles effect */}
                <View style={styles.particlesContainer}>
                    {[...Array(6)].map((_, i) => (
                        <FloatingParticle key={i} delay={i * 200} />
                    ))}
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View
                        style={[
                            styles.content,
                            {
                                opacity: fadeAnim,
                                transform: [
                                    { translateY: slideAnim },
                                    { translateX: shakeAnimation },
                                ],
                            },
                        ]}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.appName}>CampusLoop</Text>
                            <Text style={styles.tagline}>
                                Connect. Collaborate. Succeed.
                            </Text>
                        </View>

                        {/* Animated Mascot */}
                        <AnimatedMascot
                            isPasswordFocused={isPasswordFocused}
                            showPassword={showPassword}
                        />

                        {/* Login Form Card */}
                        <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
                            <Text style={[styles.welcomeText, { color: colors.text }]}>
                                Welcome Back! 👋
                            </Text>
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                Login to continue your journey
                            </Text>

                            <View style={styles.form}>
                                <CampusLoopInput
                                    label="Email"
                                    placeholder="your.email@university.edu"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    error={errors.email}
                                />

                                <CampusLoopInput
                                    label="Password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    error={errors.password}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                    rightIcon={
                                        <TouchableOpacity
                                            onPress={() => setShowPassword(!showPassword)}
                                        >
                                            <Text style={styles.eyeIcon}>
                                                {showPassword ? '👁️' : '👁️‍🗨️'}
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                />

                                <TouchableOpacity style={styles.forgotPassword}>
                                    <Text style={[styles.forgotText, { color: colors.primary }]}>
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>

                                <CampusLoopButton
                                    title="Login"
                                    onPress={handleLogin}
                                    loading={loading}
                                    fullWidth
                                    style={styles.loginButton}
                                />

                                <View style={styles.dividerContainer}>
                                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                                    <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
                                        OR
                                    </Text>
                                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                                </View>

                                <View style={styles.signupContainer}>
                                    <Text style={[styles.signupText, { color: colors.textSecondary }]}>
                                        Don't have an account?{' '}
                                    </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                        <Text style={[styles.signupLink, { color: colors.primary }]}>
                                            Sign Up
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Demo Hint */}
                        <View style={styles.demoHint}>
                            <Text style={styles.demoText}>
                                💡 Demo: demo@university.edu / password123
                            </Text>
                        </View>
                    </Animated.View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

// Floating Particle Component
const FloatingParticle: React.FC<{ delay: number }> = ({ delay }) => {
    const animValue = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        setTimeout(() => {
            Animated.loop(
                Animated.parallel([
                    Animated.sequence([
                        Animated.timing(animValue, {
                            toValue: 1,
                            duration: 3000 + Math.random() * 2000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(animValue, {
                            toValue: 0,
                            duration: 0,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.sequence([
                        Animated.timing(opacity, {
                            toValue: 0.6,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacity, {
                            toValue: 0,
                            duration: 2000,
                            useNativeDriver: true,
                        }),
                    ]),
                ])
            ).start();
        }, delay);
    }, []);

    const translateY = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [600, -100],
    });

    const translateX = animValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 50, -30],
    });

    return (
        <Animated.View
            style={[
                styles.particle,
                {
                    left: Math.random() * width,
                    opacity,
                    transform: [{ translateY }, { translateX }],
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    particlesContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    particle: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: CampusLoopSpacing.base,
    },
    content: {
        width: '100%',
    },
    header: {
        alignItems: 'center',
        marginBottom: CampusLoopSpacing.base,
    },
    appName: {
        fontSize: CampusLoopTypography.fontSize['4xl'],
        fontWeight: CampusLoopTypography.fontWeight.extrabold,
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    tagline: {
        fontSize: CampusLoopTypography.fontSize.base,
        color: '#FFFFFF',
        opacity: 0.9,
        marginTop: CampusLoopSpacing.xs,
    },
    formCard: {
        borderRadius: CampusLoopBorderRadius.xl,
        padding: CampusLoopSpacing.xl,
        ...CampusLoopShadows.xl,
    },
    welcomeText: {
        fontSize: CampusLoopTypography.fontSize['2xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: CampusLoopTypography.fontSize.base,
        textAlign: 'center',
        marginTop: CampusLoopSpacing.xs,
        marginBottom: CampusLoopSpacing.xl,
    },
    form: {
        width: '100%',
    },
    eyeIcon: {
        fontSize: 20,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: CampusLoopSpacing.sm,
    },
    forgotText: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    loginButton: {
        marginTop: CampusLoopSpacing.xl,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: CampusLoopSpacing.xl,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: CampusLoopSpacing.base,
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        fontSize: CampusLoopTypography.fontSize.base,
    },
    signupLink: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.bold,
    },
    demoHint: {
        marginTop: CampusLoopSpacing.xl,
        padding: CampusLoopSpacing.base,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: CampusLoopBorderRadius.base,
        alignItems: 'center',
    },
    demoText: {
        color: '#FFFFFF',
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
});
