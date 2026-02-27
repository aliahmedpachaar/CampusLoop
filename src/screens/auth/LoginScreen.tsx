/**
 * CampusLoop - Login Screen
 * Email + password OR Google / Apple sign-in
 */

import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    Alert, Platform, StatusBar, ActivityIndicator,
    KeyboardAvoidingView, ScrollView, Image,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useCampusLoopAuth } from '../../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

interface Props { navigation: any }

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const { login, googleAuth } = useCampusLoopAuth();

    const [email,      setEmail]      = useState('');
    const [password,   setPassword]   = useState('');
    const [showPass,   setShowPass]   = useState(false);
    const [loading,    setLoading]    = useState(false);
    const [googleLoad, setGoogleLoad] = useState(false);
    const [errors,     setErrors]     = useState<Record<string, string>>({});

    const passRef = useRef<TextInput>(null);

    // ── Google OAuth ──────────────────────────────────────────────────────────
    const [, googleResponse, promptAsync] = Google.useAuthRequest({
        webClientId:     process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID     || 'not-configured',
        iosClientId:     process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID     || 'not-configured',
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'not-configured',
    });

    React.useEffect(() => {
        if (googleResponse?.type === 'success') {
            handleGoogleSuccess(googleResponse.authentication?.accessToken);
        }
    }, [googleResponse]);

    const handleGoogleSuccess = async (accessToken?: string | null) => {
        if (!accessToken) return;
        setGoogleLoad(true);
        try {
            const info = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            }).then(r => r.json());
            await googleAuth({ email: info.email, googleId: info.id, fullName: info.name, avatar: info.picture });
            // AuthContext dispatches NEEDS_PROFILE_SETUP or SET_USER → AppNavigator handles routing
        } catch (e: any) {
            Alert.alert('Google Sign-In Failed', e.message || 'Please try again.');
        } finally {
            setGoogleLoad(false);
        }
    };

    const handleGooglePress = () => {
        const hasCredentials =
            (Platform.OS === 'ios'     && !!process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID) ||
            (Platform.OS === 'android' && !!process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID) ||
            (Platform.OS === 'web'     && !!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);
        if (!hasCredentials) {
            Alert.alert('Google Sign-In Not Configured', 'Use email + password sign-in below.');
            return;
        }
        promptAsync();
    };

    // ── Apple Sign-In ─────────────────────────────────────────────────────────
    const handleApple = async () => {
        try {
            const cred = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            if (!cred.email) {
                Alert.alert('Apple Sign-In', 'Could not get email. Please use email sign-in.');
                return;
            }
            const name = [cred.fullName?.givenName, cred.fullName?.familyName].filter(Boolean).join(' ') || 'Apple User';
            setGoogleLoad(true);
            await googleAuth({ email: cred.email, googleId: cred.user, fullName: name });
        } catch (e: any) {
            if (e.code !== 'ERR_REQUEST_CANCELED') Alert.alert('Apple Sign-In Failed', e.message);
        } finally {
            setGoogleLoad(false);
        }
    };

    // ── Email + Password Login ────────────────────────────────────────────────
    const validate = () => {
        const e: Record<string, string> = {};
        if (!email.trim())    e.email    = 'Email is required';
        if (!password.trim()) e.password = 'Password is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const { needsProfile } = await login(email.trim().toLowerCase(), password);
            if (needsProfile) {
                // needsProfileSetup state → AppNavigator routes to ProfileSetup automatically
            }
            // else: isAuthenticated → AppNavigator navigates to main app automatically
        } catch (e: any) {
            const msg: string = e.message || '';
            if (msg.includes('EMAIL_NOT_VERIFIED') || msg.toLowerCase().includes('verify your email')) {
                Alert.alert(
                    'Email Not Verified',
                    'A new code has been sent to your email. Please verify to continue.',
                    [{ text: 'Enter Code', onPress: () => navigation.navigate('VerifyOTP', { email: email.trim().toLowerCase() }) },
                     { text: 'Cancel', style: 'cancel' }]
                );
            } else {
                Alert.alert('Sign In Failed', msg || 'Invalid email or password.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" />

            <LinearGradient colors={['#059669', '#10B981']} style={styles.header}>
                <Animated.View entering={FadeInDown.duration(600)} style={styles.logoRow}>
                    <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
                    <Text style={styles.appName}>CampusLoop</Text>
                    <Text style={styles.tagline}>City University Community</Text>
                </Animated.View>
            </LinearGradient>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.card}>
                        <Text style={styles.cardTitle}>Welcome Back</Text>
                        <Text style={styles.cardSubtitle}>Sign in to your account</Text>

                        {/* Google */}
                        <TouchableOpacity
                            style={styles.googleBtn}
                            onPress={handleGooglePress}
                            disabled={googleLoad}
                            activeOpacity={0.85}
                        >
                            {googleLoad
                                ? <ActivityIndicator color="#374151" size="small" />
                                : <>
                                    <Text style={styles.googleG}>G</Text>
                                    <Text style={styles.googleBtnText}>Continue with Google</Text>
                                </>}
                        </TouchableOpacity>

                        {/* Apple — iOS only */}
                        {Platform.OS === 'ios' && (
                            <AppleAuthentication.AppleAuthenticationButton
                                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                                cornerRadius={12}
                                style={styles.appleBtn}
                                onPress={handleApple}
                            />
                        )}

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or sign in with email</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Email */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={[styles.inputRow, errors.email ? styles.inputError : null]}>
                                <Ionicons name="mail-outline" size={18} color="#9ca3af" style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="your@email.com"
                                    placeholderTextColor="#d1d5db"
                                    value={email}
                                    onChangeText={v => { setEmail(v); setErrors(p => ({ ...p, email: '' })); }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="next"
                                    onSubmitEditing={() => passRef.current?.focus()}
                                />
                            </View>
                            {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        </View>

                        {/* Password */}
                        <View style={styles.fieldGroup}>
                            <View style={styles.labelRow}>
                                <Text style={styles.label}>Password</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                    <Text style={styles.forgotLink}>Forgot password?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.inputRow, errors.password ? styles.inputError : null]}>
                                <Ionicons name="lock-closed-outline" size={18} color="#9ca3af" style={styles.icon} />
                                <TextInput
                                    ref={passRef}
                                    style={styles.input}
                                    placeholder="Your password"
                                    placeholderTextColor="#d1d5db"
                                    value={password}
                                    onChangeText={v => { setPassword(v); setErrors(p => ({ ...p, password: '' })); }}
                                    secureTextEntry={!showPass}
                                    returnKeyType="done"
                                    onSubmitEditing={handleLogin}
                                />
                                <TouchableOpacity onPress={() => setShowPass(p => !p)} style={{ padding: 4 }}>
                                    <Ionicons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9ca3af" />
                                </TouchableOpacity>
                            </View>
                            {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            style={[styles.loginBtn, loading && styles.btnDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading
                                ? <ActivityIndicator color="#fff" />
                                : <>
                                    <Text style={styles.loginBtnText}>Sign In</Text>
                                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                                </>}
                        </TouchableOpacity>

                        {/* Sign Up link */}
                        <TouchableOpacity
                            style={styles.signupRow}
                            onPress={() => navigation.navigate('Signup')}
                        >
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <Text style={styles.signupLink}>Create Account</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    root:          { flex: 1, backgroundColor: '#f9fafb' },
    header:        { paddingTop: Platform.OS === 'ios' ? 60 : 48, paddingBottom: 40, alignItems: 'center' },
    logoRow:       { alignItems: 'center', gap: 8 },
    logo:          { width: 72, height: 72, borderRadius: 18, backgroundColor: '#fff' },
    appName:       { fontSize: 26, fontWeight: '800', color: '#fff' },
    tagline:       { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
    scroll:        { paddingHorizontal: 20, paddingBottom: 40 },
    card:          { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginTop: -20,
                     shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 8 },
    cardTitle:     { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 4 },
    cardSubtitle:  { fontSize: 14, color: '#6b7280', marginBottom: 24 },
    googleBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
                     backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12,
                     height: 52, marginBottom: 12 },
    googleG:       { fontSize: 20, fontWeight: '900', color: '#4285F4' },
    googleBtnText: { fontSize: 15, fontWeight: '600', color: '#374151' },
    appleBtn:      { height: 52, marginBottom: 12 },
    divider:       { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
    dividerLine:   { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
    dividerText:   { fontSize: 13, color: '#9ca3af', marginHorizontal: 12 },
    fieldGroup:    { marginBottom: 16 },
    labelRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    label:         { fontSize: 13, fontWeight: '600', color: '#374151' },
    forgotLink:    { fontSize: 13, color: '#10B981', fontWeight: '600' },
    inputRow:      { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb',
                     borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 14, height: 52 },
    inputError:    { borderColor: '#ef4444' },
    icon:          { marginRight: 10 },
    input:         { flex: 1, fontSize: 15, color: '#111827' },
    errorText:     { fontSize: 12, color: '#ef4444', marginTop: 4 },
    loginBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                     backgroundColor: '#10B981', borderRadius: 12, height: 52, marginTop: 4 },
    btnDisabled:   { opacity: 0.6 },
    loginBtnText:  { color: '#fff', fontSize: 16, fontWeight: '700' },
    signupRow:     { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    signupText:    { fontSize: 14, color: '#6b7280' },
    signupLink:    { fontSize: 14, color: '#10B981', fontWeight: '700' },
});

export default LoginScreen;
