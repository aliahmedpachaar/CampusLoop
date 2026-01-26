/**
 * CampusLoop Login Screen
 * User login with email and password
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopButton } from '../../components/common/Button';
import { CampusLoopInput } from '../../components/common/Input';
import { CampusLoopValidation } from '../../utils/validation';
import {
    CampusLoopSpacing,
    CampusLoopTypography,
} from '../../constants/theme';

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

    const handleLogin = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await login(email, password);
            // Navigation handled by auth state change
        } catch (error: any) {
            Alert.alert('Login Failed', error.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Welcome Back!
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Login to continue
                    </Text>
                </View>

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
                    />

                    <CampusLoopButton
                        title="Login"
                        onPress={handleLogin}
                        loading={loading}
                        fullWidth
                        style={styles.loginButton}
                    />

                    <View style={styles.signupContainer}>
                        <Text style={[styles.signupText, { color: colors.textSecondary }]}>
                            Don't have an account?{' '}
                        </Text>
                        <Text
                            style={[styles.signupLink, { color: colors.primary }]}
                            onPress={() => navigation.navigate('Signup')}>
                            Sign Up
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: CampusLoopSpacing['2xl'],
        justifyContent: 'center',
    },
    header: {
        marginBottom: CampusLoopSpacing['2xl'],
    },
    title: {
        fontSize: CampusLoopTypography.fontSize['3xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        marginBottom: CampusLoopSpacing.sm,
    },
    subtitle: {
        fontSize: CampusLoopTypography.fontSize.lg,
    },
    form: {
        width: '100%',
    },
    loginButton: {
        marginTop: CampusLoopSpacing.lg,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: CampusLoopSpacing.xl,
    },
    signupText: {
        fontSize: CampusLoopTypography.fontSize.base,
    },
    signupLink: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
});
