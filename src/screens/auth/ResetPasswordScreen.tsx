/**
 * CampusLoop - Reset Password Screen
 * Enter reset code + new password
 */

import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    Alert, Platform, StatusBar, ActivityIndicator,
    KeyboardAvoidingView, ScrollView,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CampusLoopAuthService } from '../../services/authService';

interface Props { navigation: any; route: any }

const OTP_LENGTH = 6;

export const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
    const { email } = route.params as { email: string };

    const [otp,         setOtp]         = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [showPass,    setShowPass]    = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading,     setLoading]     = useState(false);
    const [done,        setDone]        = useState(false);
    const [errors,      setErrors]      = useState<Record<string, string>>({});

    const inputRefs = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));
    const passRef   = useRef<TextInput>(null);

    const handleOtpChange = (text: string, index: number) => {
        const digit = text.replace(/[^0-9]/g, '').slice(-1);
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
        if (digit && index === OTP_LENGTH - 1) passRef.current?.focus();
    };

    const handleOtpKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (otp.join('').length < OTP_LENGTH) e.otp = 'Enter the 6-digit reset code';
        if (!newPassword)                      e.newPassword = 'New password is required';
        else if (newPassword.length < 6)       e.newPassword = 'Password must be at least 6 characters';
        if (newPassword !== confirmPass)        e.confirmPass = 'Passwords do not match';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleReset = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await CampusLoopAuthService.resetPassword(email, otp.join(''), newPassword);
            setDone(true);
        } catch (e: any) {
            Alert.alert('Reset Failed', e.message || 'Invalid or expired code. Please try again.');
            setOtp(Array(OTP_LENGTH).fill(''));
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <View style={styles.root}>
                <StatusBar barStyle="light-content" />
                <LinearGradient colors={['#059669', '#10B981']} style={styles.header}>
                    <View style={{ height: 40 }} />
                </LinearGradient>
                <View style={styles.body}>
                    <Animated.View entering={FadeInDown.duration(500)} style={{ alignItems: 'center' }}>
                        <View style={styles.iconCircle}>
                            <Text style={{ fontSize: 52 }}>🎉</Text>
                        </View>
                        <Text style={styles.title}>Password Reset!</Text>
                        <Text style={styles.subtitle}>Your password has been updated successfully. You can now sign in with your new password.</Text>
                        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.primaryBtnText}>Sign In Now</Text>
                            <Ionicons name="arrow-forward" size={18} color="#fff" />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={['#059669', '#10B981']} style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>

            <KeyboardAvoidingView style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined}>
                <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <Animated.View entering={FadeInDown.duration(500)} style={{ alignItems: 'center', width: '100%' }}>
                        <View style={styles.iconCircle}>
                            <Text style={{ fontSize: 48 }}>🔒</Text>
                        </View>
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>Enter the 6-digit code from your email and choose a new password.</Text>

                        {/* OTP */}
                        <View style={{ width: '100%', marginBottom: 4 }}>
                            <Text style={styles.label}>Reset Code</Text>
                            <View style={styles.otpRow}>
                                {otp.map((digit, i) => (
                                    <TextInput
                                        key={i}
                                        ref={r => { inputRefs.current[i] = r; }}
                                        style={[styles.otpBox, digit && styles.otpBoxFilled]}
                                        value={digit}
                                        onChangeText={t => handleOtpChange(t, i)}
                                        onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, i)}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        selectTextOnFocus
                                        autoFocus={i === 0}
                                    />
                                ))}
                            </View>
                            {!!errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}
                        </View>

                        {/* New Password */}
                        <View style={[styles.fieldGroup, { width: '100%' }]}>
                            <Text style={styles.label}>New Password</Text>
                            <View style={[styles.inputRow, errors.newPassword ? styles.inputError : null]}>
                                <Ionicons name="lock-closed-outline" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
                                <TextInput
                                    ref={passRef}
                                    style={styles.input}
                                    placeholder="At least 6 characters"
                                    placeholderTextColor="#d1d5db"
                                    value={newPassword}
                                    onChangeText={v => { setNewPassword(v); setErrors(p => ({ ...p, newPassword: '' })); }}
                                    secureTextEntry={!showPass}
                                    returnKeyType="next"
                                />
                                <TouchableOpacity onPress={() => setShowPass(p => !p)} style={{ padding: 4 }}>
                                    <Ionicons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9ca3af" />
                                </TouchableOpacity>
                            </View>
                            {!!errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
                        </View>

                        {/* Confirm Password */}
                        <View style={[styles.fieldGroup, { width: '100%' }]}>
                            <Text style={styles.label}>Confirm New Password</Text>
                            <View style={[styles.inputRow, errors.confirmPass ? styles.inputError : null]}>
                                <Ionicons name="lock-closed-outline" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Re-enter new password"
                                    placeholderTextColor="#d1d5db"
                                    value={confirmPass}
                                    onChangeText={v => { setConfirmPass(v); setErrors(p => ({ ...p, confirmPass: '' })); }}
                                    secureTextEntry={!showConfirm}
                                    returnKeyType="done"
                                    onSubmitEditing={handleReset}
                                />
                                <TouchableOpacity onPress={() => setShowConfirm(p => !p)} style={{ padding: 4 }}>
                                    <Ionicons name={showConfirm ? 'eye-outline' : 'eye-off-outline'} size={20} color="#9ca3af" />
                                </TouchableOpacity>
                            </View>
                            {!!errors.confirmPass && <Text style={styles.errorText}>{errors.confirmPass}</Text>}
                        </View>

                        <TouchableOpacity style={[styles.primaryBtn, loading && styles.btnDisabled]} onPress={handleReset} disabled={loading}>
                            {loading
                                ? <ActivityIndicator color="#fff" />
                                : <><Text style={styles.primaryBtnText}>Reset Password</Text><Ionicons name="checkmark" size={18} color="#fff" /></>}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.resendRow} onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={styles.resendText}>Didn't get a code? </Text>
                            <Text style={styles.resendLink}>Send again</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    root:           { flex: 1, backgroundColor: '#f9fafb' },
    header:         { paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 30, paddingHorizontal: 20 },
    backBtn:        { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    body:           { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
    iconCircle:     { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    title:          { fontSize: 26, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 10 },
    subtitle:       { fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 22, marginBottom: 28, paddingHorizontal: 8 },
    label:          { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
    otpRow:         { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 6 },
    otpBox:         { width: 44, height: 54, borderRadius: 12, borderWidth: 2, borderColor: '#e5e7eb', backgroundColor: '#fff', textAlign: 'center', fontSize: 22, fontWeight: '700', color: '#111827' },
    otpBoxFilled:   { borderColor: '#f59e0b', backgroundColor: '#fffbeb' },
    fieldGroup:     { marginBottom: 16 },
    inputRow:       { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 14, height: 52 },
    inputError:     { borderColor: '#ef4444' },
    input:          { flex: 1, fontSize: 15, color: '#111827' },
    errorText:      { fontSize: 12, color: '#ef4444', marginTop: 4 },
    primaryBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#10B981', borderRadius: 12, height: 52, width: '100%', marginTop: 8 },
    btnDisabled:    { opacity: 0.6 },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    resendRow:      { flexDirection: 'row', marginTop: 24 },
    resendText:     { fontSize: 14, color: '#6b7280' },
    resendLink:     { fontSize: 14, color: '#10B981', fontWeight: '700' },
});

export default ResetPasswordScreen;
