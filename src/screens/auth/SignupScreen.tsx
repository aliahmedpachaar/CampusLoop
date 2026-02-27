/**
 * CampusLoop - Sign Up Screen
 * Collects: full name + email + date of birth + password → OTP sent → VerifyOTP
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

const isValidEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v);

export const SignupScreen: React.FC<Props> = ({ navigation }) => {
    const { signup, googleAuth } = useCampusLoopAuth();

    const [fullName,    setFullName]    = useState('');
    const [email,       setEmail]       = useState('');
    const [dobDisplay,  setDobDisplay]  = useState('');   // shown as DD/MM/YYYY
    const [dob,         setDob]         = useState('');   // stored as YYYY-MM-DD
    const [password,    setPassword]    = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [showPass,    setShowPass]    = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading,     setLoading]     = useState(false);
    const [googleLoad,  setGoogleLoad]  = useState(false);
    const [errors,      setErrors]      = useState<Record<string, string>>({});

    const emailRef   = useRef<TextInput>(null);
    const dobRef     = useRef<TextInput>(null);
    const passRef    = useRef<TextInput>(null);
    const confirmRef = useRef<TextInput>(null);

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
            Alert.alert('Google Sign-In Not Configured', 'Use email sign-up below.');
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
                Alert.alert('Apple Sign-In', 'Could not get email. Please use email sign-up.');
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

    // ── DOB auto-format (DD/MM/YYYY) ──────────────────────────────────────────
    const handleDobChange = (text: string) => {
        const digits = text.replace(/\D/g, '').slice(0, 8);
        let formatted = digits;
        if (digits.length > 4) {
            formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
        } else if (digits.length > 2) {
            formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
        }
        setDobDisplay(formatted);
        setErrors(p => ({ ...p, dob: '' }));
        if (digits.length === 8) {
            setDob(`${digits.slice(4)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`);
        } else {
            setDob('');
        }
    };

    // ── Validation ─────────────────────────────────────────────────────────────
    const validate = () => {
        const e: Record<string, string> = {};
        if (!fullName.trim())          e.fullName    = 'Full name is required';
        if (!email.trim())             e.email       = 'Email is required';
        else if (!isValidEmail(email)) e.email       = 'Enter a valid email address';
        if (!dob)                      e.dob         = 'Date of birth is required (DD/MM/YYYY)';
        if (!password)                 e.password    = 'Password is required';
        else if (password.length < 6)  e.password    = 'Password must be at least 6 characters';
        if (password !== confirmPass)  e.confirmPass = 'Passwords do not match';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ── Submit ─────────────────────────────────────────────────────────────────
    const handleSignup = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await signup(fullName.trim(), email.trim().toLowerCase(), dob, password);
            navigation.navigate('VerifyOTP', { email: email.trim().toLowerCase() });
        } catch (e: any) {
            const msg: string = e.message || '';
            if (msg.includes('not verified') || msg.includes('EMAIL_UNVERIFIED')) {
                // Account exists but unverified — go to OTP screen
                navigation.navigate('VerifyOTP', { email: email.trim().toLowerCase() });
            } else {
                Alert.alert('Sign Up Failed', msg || 'Something went wrong. Please try again.');
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
                        <Text style={styles.cardTitle}>Create Account</Text>
                        <Text style={styles.cardSubtitle}>Join your campus community today</Text>

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
                                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
                                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                                cornerRadius={12}
                                style={styles.appleBtn}
                                onPress={handleApple}
                            />
                        )}

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or sign up with email</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Full Name */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Full Name <Text style={styles.req}>*</Text></Text>
                            <View style={[styles.inputRow, errors.fullName ? styles.inputError : null]}>
                                <Ionicons name="person-outline" size={18} color="#9ca3af" style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Ahmad Syahrizal"
                                    placeholderTextColor="#d1d5db"
                                    value={fullName}
                                    onChangeText={v => { setFullName(v); setErrors(p => ({ ...p, fullName: '' })); }}
                                    autoCapitalize="words"
                                    returnKeyType="next"
                                    onSubmitEditing={() => emailRef.current?.focus()}
                                />
                            </View>
                            {!!errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
                        </View>

                        {/* Email */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Email Address <Text style={styles.req}>*</Text></Text>
                            <View style={[styles.inputRow, errors.email ? styles.inputError : null]}>
                                <Ionicons name="mail-outline" size={18} color="#9ca3af" style={styles.icon} />
                                <TextInput
                                    ref={emailRef}
                                    style={styles.input}
                                    placeholder="your@email.com"
                                    placeholderTextColor="#d1d5db"
                                    value={email}
                                    onChangeText={v => { setEmail(v); setErrors(p => ({ ...p, email: '' })); }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="next"
                                    onSubmitEditing={() => dobRef.current?.focus()}
                                />
                            </View>
                            {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        </View>

                        {/* Date of Birth */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Date of Birth <Text style={styles.req}>*</Text></Text>
                            <View style={[styles.inputRow, errors.dob ? styles.inputError : null]}>
                                <Ionicons name="calendar-outline" size={18} color="#9ca3af" style={styles.icon} />
                                <TextInput
                                    ref={dobRef}
                                    style={styles.input}
                                    placeholder="DD/MM/YYYY"
                                    placeholderTextColor="#d1d5db"
                                    value={dobDisplay}
                                    onChangeText={handleDobChange}
                                    keyboardType="number-pad"
                                    returnKeyType="next"
                                    onSubmitEditing={() => passRef.current?.focus()}
                                />
                            </View>
                            {!!errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
                        </View>

                        {/* Password */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Password <Text style={styles.req}>*</Text></Text>
                            <View style={[styles.inputRow, errors.password ? styles.inputError : null]}>
                                <Ionicons name="lock-closed-outline" size={18} color="#9ca3af" style={styles.icon} />
                                <TextInput
                                    ref={passRef}
                                    style={styles.input}
                                    placeholder="At least 6 characters"
                                    placeholderTextColor="#d1d5db"
                                    value={password}
                                    onChangeText={v => { setPassword(v); setErrors(p => ({ ...p, password: '' })); }}
                                    secureTextEntry={!showPass}
                                    returnKeyType="next"
                                    onSubmitEditing={() => confirmRef.current?.focus()}
                                />
                                <TouchableOpacity onPress={() => setShowPass(p => !p)} style={{ padding: 4 }}>
                                    <Ionicons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9ca3af" />
                                </TouchableOpacity>
                            </View>
                            {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Confirm Password <Text style={styles.req}>*</Text></Text>
                            <View style={[styles.inputRow, errors.confirmPass ? styles.inputError : null]}>
                                <Ionicons name="lock-closed-outline" size={18} color="#9ca3af" style={styles.icon} />
                                <TextInput
                                    ref={confirmRef}
                                    style={styles.input}
                                    placeholder="Re-enter your password"
                                    placeholderTextColor="#d1d5db"
                                    value={confirmPass}
                                    onChangeText={v => { setConfirmPass(v); setErrors(p => ({ ...p, confirmPass: '' })); }}
                                    secureTextEntry={!showConfirm}
                                    returnKeyType="done"
                                    onSubmitEditing={handleSignup}
                                />
                                <TouchableOpacity onPress={() => setShowConfirm(p => !p)} style={{ padding: 4 }}>
                                    <Ionicons name={showConfirm ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9ca3af" />
                                </TouchableOpacity>
                            </View>
                            {!!errors.confirmPass && <Text style={styles.errorText}>{errors.confirmPass}</Text>}
                        </View>

                        {/* Submit */}
                        <TouchableOpacity
                            style={[styles.signupBtn, loading && styles.btnDisabled]}
                            onPress={handleSignup}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading
                                ? <ActivityIndicator color="#fff" />
                                : <>
                                    <Text style={styles.signupBtnText}>Create Account</Text>
                                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                                </>}
                        </TouchableOpacity>

                        {/* Login link */}
                        <TouchableOpacity
                            style={styles.loginRow}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <Text style={styles.loginLink}>Sign In</Text>
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
    label:         { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
    req:           { color: '#ef4444' },
    inputRow:      { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb',
                     borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 14, height: 52 },
    inputError:    { borderColor: '#ef4444' },
    icon:          { marginRight: 10 },
    input:         { flex: 1, fontSize: 15, color: '#111827' },
    errorText:     { fontSize: 12, color: '#ef4444', marginTop: 4 },
    signupBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                     backgroundColor: '#10B981', borderRadius: 12, height: 52, marginTop: 4 },
    btnDisabled:   { opacity: 0.6 },
    signupBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    loginRow:      { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    loginText:     { fontSize: 14, color: '#6b7280' },
    loginLink:     { fontSize: 14, color: '#10B981', fontWeight: '700' },
});

export default SignupScreen;
