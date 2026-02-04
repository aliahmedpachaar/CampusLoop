/**
 * CampusLoop Forgot Password Screen
 * Password reset functionality
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { CampusLoopInput } from '../../components/common/Input';
import { CampusLoopValidation } from '../../utils/validation';
import {
    CampusLoopSpacing,
    CampusLoopTypography,
    CampusLoopBorderRadius,
    CampusLoopShadows,
} from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface ForgotPasswordScreenProps {
    navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        if (!CampusLoopValidation.isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1500);
    };

    if (sent) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.successContainer}>
                    <View style={[styles.successIcon, { backgroundColor: colors.success + '20' }]}>
                        <Ionicons name="mail" size={48} color={colors.success} />
                    </View>
                    <Text style={[styles.successTitle, { color: colors.text }]}>
                        Check your email
                    </Text>
                    <Text style={[styles.successText, { color: colors.textSecondary }]}>
                        We've sent password reset instructions to {email}
                    </Text>
                    <TouchableOpacity
                        style={[styles.backToLoginButton, { backgroundColor: colors.primary }]}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.backToLoginText}>Back to Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

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
                        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                            <Ionicons name="lock-closed" size={32} color={colors.primary} />
                        </View>
                        <Text style={[styles.title, { color: colors.text }]}>
                            Forgot Password?
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            No worries! Enter your email and we'll send you reset instructions.
                        </Text>
                    </Animated.View>

                    {/* Form */}
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(600)}
                        style={[styles.formCard, { backgroundColor: colors.surface }]}
                    >
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.text }]}>
                                Email Address
                            </Text>
                            <View style={[
                                styles.inputContainer,
                                {
                                    backgroundColor: colors.background,
                                    borderColor: error ? colors.error : colors.border,
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
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        setError('');
                                    }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    containerStyle={styles.inputWrapper}
                                />
                            </View>
                            {error ? (
                                <Text style={[styles.errorText, { color: colors.error }]}>
                                    {error}
                                </Text>
                            ) : null}
                        </View>

                        {/* Reset Button */}
                        <TouchableOpacity
                            style={[styles.resetButton, { opacity: loading ? 0.7 : 1 }]}
                            onPress={handleResetPassword}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={[colors.gradientStart, colors.gradientEnd]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.resetGradient}
                            >
                                <Text style={styles.resetButtonText}>
                                    {loading ? 'Sending...' : 'Reset Password'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Back to Login */}
                    <View style={styles.loginContainer}>
                        <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                            Remember your password?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={[styles.loginLink, { color: colors.primary }]}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
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
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: CampusLoopSpacing.lg,
    },
    title: {
        fontSize: CampusLoopTypography.fontSize['2xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        marginBottom: CampusLoopSpacing.sm,
    },
    subtitle: {
        fontSize: CampusLoopTypography.fontSize.base,
        textAlign: 'center',
        lineHeight: 22,
    },
    formCard: {
        borderRadius: CampusLoopBorderRadius['2xl'],
        padding: CampusLoopSpacing.xl,
        ...CampusLoopShadows.lg,
    },
    inputGroup: {
        marginBottom: CampusLoopSpacing.lg,
    },
    inputLabel: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
        marginBottom: CampusLoopSpacing.sm,
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
    errorText: {
        fontSize: CampusLoopTypography.fontSize.xs,
        marginTop: CampusLoopSpacing.xs,
    },
    resetButton: {
        borderRadius: CampusLoopBorderRadius.lg,
        overflow: 'hidden',
    },
    resetGradient: {
        paddingVertical: CampusLoopSpacing.base,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resetButtonText: {
        color: '#FFFFFF',
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: CampusLoopSpacing.xl,
    },
    loginText: {
        fontSize: CampusLoopTypography.fontSize.base,
    },
    loginLink: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    successContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: CampusLoopSpacing.xl,
    },
    successIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: CampusLoopSpacing.xl,
    },
    successTitle: {
        fontSize: CampusLoopTypography.fontSize['2xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        marginBottom: CampusLoopSpacing.md,
    },
    successText: {
        fontSize: CampusLoopTypography.fontSize.base,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: CampusLoopSpacing.xl,
    },
    backToLoginButton: {
        paddingVertical: CampusLoopSpacing.base,
        paddingHorizontal: CampusLoopSpacing['2xl'],
        borderRadius: CampusLoopBorderRadius.lg,
    },
    backToLoginText: {
        color: '#FFFFFF',
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
});

export default ForgotPasswordScreen;
