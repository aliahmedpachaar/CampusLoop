/**
 * CampusLoop Login Screen
 * Clean and simple login design
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
        formScale.value = withSpring(1, { damping: 15, stiffness: 100 });
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

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="dark-content" />

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
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>

                    {/* Header */}
                    <Animated.View
                        entering={FadeInDown.delay(100).duration(600)}
                        style={styles.header}
                    >
                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={[styles.appName, { color: colors.primary }]}>
                            CampusLoop
                        </Text>
                        <Text style={[styles.welcomeText, { color: colors.text }]}>
                            Welcome back!
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Sign in to continue connecting with your campus
                        </Text>
                    </Animated.View>

                    {/* Form Card */}
                    <Animated.View
                        entering={FadeInUp.delay(200).duration(600)}
                        style={[
                            styles.formCard,
                            { backgroundColor: colors.surface },
                            shakeStyle,
                            formAnimatedStyle,
                        ]}
                    >
                        <View style={styles.form}>
                            {/* Email Input */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.text }]}>
                                    Email
                                </Text>
                                <View style={[
                                    styles.inputContainer,
                                    {
                                        backgroundColor: colors.background,
                                        borderColor: errors.email ? colors.error : colors.border,
                                    }
                                ]}>
                                    <Ionicons
                                        name="mail-outline"
                                        size={20}
                                        color={colors.textTertiary}
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
                                    />
                                </View>
                                {errors.email ? (
                                    <Text style={[styles.errorText, { color: colors.error }]}>
                                        {errors.email}
                                    </Text>
                                ) : null}
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.text }]}>
                                    Password
                                </Text>
                                <View style={[
                                    styles.inputContainer,
                                    {
                                        backgroundColor: colors.background,
                                        borderColor: errors.password ? colors.error : colors.border,
                                    }
                                ]}>
                                    <Ionicons
                                        name="lock-closed-outline"
                                        size={20}
                                        color={colors.textTertiary}
                                        style={styles.inputIcon}
                                    />
                                    <CampusLoopInput
                                        placeholder="Enter your password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        style={styles.input}
                                        containerStyle={styles.inputWrapper}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.eyeButton}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Ionicons
                                            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                            size={22}
                                            color={colors.textTertiary}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {errors.password ? (
                                    <Text style={[styles.errorText, { color: colors.error }]}>
                                        {errors.password}
                                    </Text>
                                ) : null}
                            </View>

                            {/* Forgot Password */}
                            <TouchableOpacity
                                style={styles.forgotPassword}
                                onPress={() => navigation.navigate('ForgotPassword')}
                            >
                                <Text style={[styles.forgotText, { color: colors.primary }]}>
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>

                            {/* Login Button */}
                            <TouchableOpacity
                                style={[styles.loginButton, { opacity: loading ? 0.7 : 1 }]}
                                onPress={handleLogin}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[colors.gradientStart, colors.gradientEnd]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.loginGradient}
                                >
                                    <Text style={styles.loginButtonText}>
                                        {loading ? 'Signing in...' : 'Sign In'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <Text style={[styles.dividerText, { color: colors.textTertiary }]}>
                            or
                        </Text>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    </View>

                    {/* Sign Up Link */}
                    <View style={styles.signupContainer}>
                        <Text style={[styles.signupText, { color: colors.textSecondary }]}>
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={[styles.signupLink, { color: colors.primary }]}>
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Demo Credentials */}
                    <Animated.View
                        entering={FadeInUp.delay(400).duration(400)}
                        style={[styles.demoCard, { backgroundColor: colors.primary + '10' }]}
                    >
                        <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
                        <Text style={[styles.demoText, { color: colors.primary }]}>
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
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: CampusLoopSpacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: CampusLoopSpacing.xl,
    },
    logo: {
        width: 80,
        height: 80,
    },
    appName: {
        fontSize: CampusLoopTypography.fontSize['2xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        marginTop: CampusLoopSpacing.md,
        marginBottom: CampusLoopSpacing.md,
    },
    welcomeText: {
        fontSize: CampusLoopTypography.fontSize.xl,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
        marginBottom: CampusLoopSpacing.xs,
    },
    subtitle: {
        fontSize: CampusLoopTypography.fontSize.base,
        textAlign: 'center',
    },
    formCard: {
        borderRadius: CampusLoopBorderRadius['2xl'],
        padding: CampusLoopSpacing.xl,
        ...CampusLoopShadows.lg,
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
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: CampusLoopBorderRadius.lg,
        borderWidth: 1.5,
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
    },
    eyeButton: {
        padding: CampusLoopSpacing.xs,
    },
    errorText: {
        fontSize: CampusLoopTypography.fontSize.xs,
        marginTop: 2,
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
    },
    loginGradient: {
        paddingVertical: CampusLoopSpacing.base,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
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
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    demoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: CampusLoopSpacing.sm,
        marginTop: CampusLoopSpacing.xl,
        padding: CampusLoopSpacing.base,
        borderRadius: CampusLoopBorderRadius.lg,
    },
    demoText: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
});

export default LoginScreen;
