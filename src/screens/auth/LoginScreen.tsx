/**
 * CampusLoop Login Screen
 * Redesigned with Green Theme and Animations
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withSequence,
    FadeInDown,
    FadeInUp,
    ZoomIn,
} from 'react-native-reanimated';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopInput } from '../../components/common/Input';
import { CampusLoopValidation } from '../../utils/validation';
import {
    CampusLoopSpacing,
    CampusLoopTypography,
    CampusLoopBorderRadius,
    CampusLoopShadows,
} from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

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

    // Animation values
    const shakeX = useSharedValue(0);
    const formScale = useSharedValue(0.95);

    useEffect(() => {
        formScale.value = withSpring(1, { damping: 12, stiffness: 90 });
    }, []);

    const validate = (): boolean => {
        const newErrors = { email: '', password: '' };
        let isValid = true;

        if (!CampusLoopValidation.isRequired(email)) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!CampusLoopValidation.isValidEmail(email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        if (!CampusLoopValidation.isRequired(password)) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const triggerShake = () => {
        shakeX.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(0, { duration: 50 })
        );
    };

    const handleLogin = async () => {
        if (!validate()) {
            triggerShake();
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
        } catch (error: any) {
            triggerShake();
            Alert.alert('Login Failed', error.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const shakeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shakeX.value }],
    }));

    const formAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: formScale.value }],
    }));

    // Green Theme Colors
    const greenTheme = {
        primary: '#10B981', // Emerald 500
        dark: '#059669',    // Emerald 600
        light: '#34D399',   // Emerald 400
        gradientStart: '#10B981',
        gradientEnd: '#059669',
        background: '#ECFDF5', // Emerald 50
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Green Gradient Background */}
            <LinearGradient
                colors={[greenTheme.gradientStart, greenTheme.gradientEnd]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Background Pattern/Design (Optional circles) */}
            <View style={styles.patternContainer}>
                <View style={[styles.circle, { top: -50, right: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)' }]} />
                <View style={[styles.circle, { bottom: 100, left: -50, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.05)' }]} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    {/* Header */}
                    <Animated.View
                        entering={FadeInDown.delay(100).duration(800).springify()}
                        style={styles.header}
                    >
                        <Animated.View entering={ZoomIn.delay(200).duration(500)}>
                            <View style={styles.logoContainer}>
                                <Image
                                    source={require('../../assets/images/logo.png')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>
                        </Animated.View>

                        <Text style={[styles.appName, { color: '#FFFFFF' }]}>
                            CampusLoop
                        </Text>
                        <Text style={[styles.welcomeText, { color: '#E0F2F1' }]}>
                            Welcome back!
                        </Text>
                        <Text style={[styles.subtitle, { color: '#D1FAE5' }]}>
                            Sign in to continue connecting with your campus
                        </Text>
                    </Animated.View>

                    {/* Form Card */}
                    <Animated.View
                        entering={FadeInUp.delay(300).duration(800).springify()}
                        style={[
                            styles.formCard,
                            { backgroundColor: '#FFFFFF' },
                            shakeStyle,
                            formAnimatedStyle,
                        ]}
                    >
                        <View style={styles.form}>
                            {/* Email Input */}
                            <Animated.View entering={FadeInUp.delay(400).duration(600)}>
                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: '#374151' }]}>
                                        Email
                                    </Text>
                                    <View style={[
                                        styles.inputContainer,
                                        {
                                            backgroundColor: '#F9FAFB',
                                            borderColor: errors.email ? colors.error : '#E5E7EB',
                                        }
                                    ]}>
                                        <Ionicons
                                            name="mail-outline"
                                            size={20}
                                            color="#9CA3AF"
                                            style={styles.inputIcon}
                                        />
                                        <CampusLoopInput
                                            placeholder="your.email@university.edu"
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            style={styles.input}
                                            containerStyle={styles.inputWrapper}
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>
                                    {errors.email ? (
                                        <Text style={[styles.errorText, { color: colors.error }]}>
                                            {errors.email}
                                        </Text>
                                    ) : null}
                                </View>
                            </Animated.View>

                            {/* Password Input */}
                            <Animated.View entering={FadeInUp.delay(500).duration(600)}>
                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: '#374151' }]}>
                                        Password
                                    </Text>
                                    <View style={[
                                        styles.inputContainer,
                                        {
                                            backgroundColor: '#F9FAFB',
                                            borderColor: errors.password ? colors.error : '#E5E7EB',
                                        }
                                    ]}>
                                        <Ionicons
                                            name="lock-closed-outline"
                                            size={20}
                                            color="#9CA3AF"
                                            style={styles.inputIcon}
                                        />
                                        <CampusLoopInput
                                            placeholder="Enter your password"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={!showPassword}
                                            autoComplete="off"
                                            autoCorrect={false}
                                            style={styles.input}
                                            containerStyle={styles.inputWrapper}
                                            placeholderTextColor="#9CA3AF"
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowPassword(!showPassword)}
                                            style={styles.eyeButton}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <Ionicons
                                                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                                size={22}
                                                color="#9CA3AF"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {errors.password ? (
                                        <Text style={[styles.errorText, { color: colors.error }]}>
                                            {errors.password}
                                        </Text>
                                    ) : null}
                                </View>
                            </Animated.View>

                            {/* Forgot Password */}
                            <Animated.View entering={FadeInUp.delay(600).duration(600)}>
                                <TouchableOpacity
                                    style={styles.forgotPassword}
                                    onPress={() => navigation.navigate('ForgotPassword')}
                                >
                                    <Text style={[styles.forgotText, { color: greenTheme.primary }]}>
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>

                            {/* Login Button */}
                            <Animated.View entering={FadeInUp.delay(700).duration(600)}>
                                <TouchableOpacity
                                    style={[styles.loginButton, { opacity: loading ? 0.7 : 1 }]}
                                    onPress={handleLogin}
                                    disabled={loading}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={[greenTheme.gradientStart, greenTheme.gradientEnd]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.loginGradient}
                                    >
                                        <Text style={styles.loginButtonText}>
                                            {loading ? 'Signing in...' : 'Sign In'}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </Animated.View>

                    {/* Divider */}
                    <Animated.View
                        entering={FadeInUp.delay(800).duration(600)}
                        style={styles.dividerContainer}
                    >
                        <View style={[styles.divider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                        <Text style={[styles.dividerText, { color: '#E0F2F1' }]}>
                            or
                        </Text>
                        <View style={[styles.divider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
                    </Animated.View>

                    {/* Sign Up Link */}
                    <Animated.View
                        entering={FadeInUp.delay(900).duration(600)}
                        style={styles.signupContainer}
                    >
                        <Text style={[styles.signupText, { color: '#E0F2F1' }]}>
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={[styles.signupLink, { color: '#FFFFFF' }]}>
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Demo Credentials */}
                    <Animated.View
                        entering={FadeInUp.delay(1000).duration(600)}
                        style={[styles.demoCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}
                    >
                        <Ionicons name="information-circle-outline" size={18} color="#FFFFFF" />
                        <Text style={[styles.demoText, { color: '#FFFFFF' }]}>
                            Demo: demo@university.edu / password123
                        </Text>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    patternContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    circle: {
        position: 'absolute',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: CampusLoopSpacing.xl,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: CampusLoopSpacing['2xl'],
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: CampusLoopSpacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: CampusLoopSpacing.xl,
    },
    logoContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 5,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    logo: {
        width: 70,
        height: 70,
    },
    appName: {
        fontSize: CampusLoopTypography.fontSize['3xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        marginTop: CampusLoopSpacing.md,
        marginBottom: CampusLoopSpacing.xs,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    welcomeText: {
        fontSize: CampusLoopTypography.fontSize.xl,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
        marginBottom: CampusLoopSpacing.xs,
    },
    subtitle: {
        fontSize: CampusLoopTypography.fontSize.base,
        textAlign: 'center',
        opacity: 0.9,
    },
    formCard: {
        borderRadius: CampusLoopBorderRadius['2xl'],
        padding: CampusLoopSpacing.xl,
        ...CampusLoopShadows.lg,
        shadowColor: '#065F46', // Dark emerald shadow
        shadowOpacity: 0.15,
        elevation: 8,
    },
    form: {
        gap: CampusLoopSpacing.lg,
    },
    inputGroup: {
        gap: CampusLoopSpacing.sm,
    },
    inputLabel: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: CampusLoopBorderRadius.lg,
        borderWidth: 1,
        paddingHorizontal: CampusLoopSpacing.base,
    },
    inputIcon: {
        marginRight: CampusLoopSpacing.sm,
    },
    inputWrapper: {
        flex: 1,
        marginBottom: 0,
        borderWidth: 0,
        backgroundColor: 'transparent',
    },
    input: {
        flex: 1,
        paddingVertical: CampusLoopSpacing.base,
        color: '#1F2937',
    },
    eyeButton: {
        padding: CampusLoopSpacing.xs,
    },
    errorText: {
        fontSize: CampusLoopTypography.fontSize.xs,
        marginTop: 4,
        marginLeft: 4,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: -CampusLoopSpacing.sm,
    },
    forgotText: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    loginButton: {
        borderRadius: CampusLoopBorderRadius.lg,
        overflow: 'hidden',
        marginTop: CampusLoopSpacing.sm,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginGradient: {
        paddingVertical: CampusLoopSpacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.bold,
        letterSpacing: 0.5,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: CampusLoopSpacing.xl,
        paddingHorizontal: CampusLoopSpacing.lg,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: CampusLoopSpacing.base,
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: '500',
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
        textDecorationLine: 'underline',
    },
    demoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: CampusLoopSpacing.sm,
        marginTop: CampusLoopSpacing.xl,
        padding: CampusLoopSpacing.sm,
        paddingHorizontal: CampusLoopSpacing.lg,
        borderRadius: CampusLoopBorderRadius.full,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    demoText: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
});

export default LoginScreen;
