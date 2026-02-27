/**
 * CampusLoop - Verify OTP Screen
 * Works for both new and returning users.
 * After verify: new users go to ProfileSetup, returning users go straight to the app.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    Alert, Platform, StatusBar, ActivityIndicator, Keyboard,
} from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useCampusLoopAuth } from '../../context/AuthContext';

interface Props { navigation: any; route: any }

const OTP_LENGTH = 6;

export const VerifyEmailScreen: React.FC<Props> = ({ navigation, route }) => {
    const { email } = route.params as { email: string };
    const { verifyOTP, resendOTP } = useCampusLoopAuth();

    const [otp,       setOtp]       = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [loading,   setLoading]   = useState(false);
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));

    useEffect(() => {
        if (countdown <= 0) { setCanResend(true); return; }
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    const handleChange = (text: string, index: number) => {
        const digits = text.replace(/[^0-9]/g, '');
        // Handle paste of full code
        if (digits.length === OTP_LENGTH) {
            setOtp(digits.split(''));
            Keyboard.dismiss();
            return;
        }
        const digit = digits.slice(-1);
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
        if (digit && index === OTP_LENGTH - 1) Keyboard.dismiss();
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length < OTP_LENGTH) {
            Alert.alert('Enter the code', 'Please enter all 6 digits.');
            return;
        }
        setLoading(true);
        try {
            await verifyOTP(email, code);
            // AuthContext dispatches NEEDS_PROFILE_SETUP or SET_USER
            // → AppNavigator handles routing automatically in both cases
        } catch (e: any) {
            const msg: string = e.message || '';
            if (msg.includes('OTP_EXPIRED') || msg.toLowerCase().includes('expired')) {
                Alert.alert('Code Expired', 'Your code has expired.', [
                    { text: 'Resend', onPress: handleResend },
                    { text: 'Cancel', style: 'cancel' },
                ]);
            } else {
                Alert.alert('Wrong Code', msg || 'Check the code and try again.');
            }
            setOtp(Array(OTP_LENGTH).fill(''));
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await resendOTP(email);
            setOtp(Array(OTP_LENGTH).fill(''));
            setCountdown(60);
            setCanResend(false);
            inputRefs.current[0]?.focus();
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to resend code.');
        } finally {
            setResending(false);
        }
    };

    const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + b.replace(/./g, '*') + c);

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" />

            <LinearGradient colors={['#059669', '#10B981']} style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>

            <View style={styles.body}>
                <Animated.View entering={ZoomIn.duration(500)} style={styles.iconCircle}>
                    <Text style={styles.iconEmoji}>📧</Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ alignItems: 'center', width: '100%' }}>
                    <Text style={styles.title}>Check your email</Text>
                    <Text style={styles.subtitle}>
                        We sent a 6-digit code to{'\n'}
                        <Text style={styles.emailHighlight}>{maskedEmail}</Text>
                    </Text>

                    <View style={styles.otpRow}>
                        {otp.map((digit, i) => (
                            <TextInput
                                key={i}
                                ref={r => { inputRefs.current[i] = r; }}
                                style={[styles.otpBox, digit && styles.otpBoxFilled]}
                                value={digit}
                                onChangeText={t => handleChange(t, i)}
                                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                                keyboardType="number-pad"
                                maxLength={OTP_LENGTH}
                                selectTextOnFocus
                                autoFocus={i === 0}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.verifyBtn, (loading || otp.join('').length < OTP_LENGTH) && styles.btnDisabled]}
                        onPress={handleVerify}
                        disabled={loading || otp.join('').length < OTP_LENGTH}
                        activeOpacity={0.85}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.verifyBtnText}>Verify Code</Text>}
                    </TouchableOpacity>

                    <View style={styles.resendRow}>
                        <Text style={styles.resendLabel}>Didn't get the code? </Text>
                        {canResend
                            ? (
                                <TouchableOpacity onPress={handleResend} disabled={resending}>
                                    {resending
                                        ? <ActivityIndicator color="#10B981" size="small" />
                                        : <Text style={styles.resendLink}>Resend</Text>}
                                </TouchableOpacity>
                            )
                            : <Text style={styles.countdown}>Resend in {countdown}s</Text>}
                    </View>

                    <Text style={styles.hint}>
                        💡 Check your spam folder.{'\n'}
                        In dev mode, the code is printed in the backend terminal.
                    </Text>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root:            { flex: 1, backgroundColor: '#f9fafb' },
    header:          { paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 30, paddingHorizontal: 20 },
    backBtn:         { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    body:            { flex: 1, paddingHorizontal: 28, paddingTop: 20, alignItems: 'center' },
    iconCircle:      { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center', marginBottom: 24, marginTop: 8 },
    iconEmoji:       { fontSize: 48 },
    title:           { fontSize: 26, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 10 },
    subtitle:        { fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
    emailHighlight:  { color: '#10B981', fontWeight: '700' },
    otpRow:          { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 28 },
    otpBox:          { width: 48, height: 58, borderRadius: 12, borderWidth: 2, borderColor: '#e5e7eb', backgroundColor: '#fff', textAlign: 'center', fontSize: 24, fontWeight: '700', color: '#111827' },
    otpBoxFilled:    { borderColor: '#10B981', backgroundColor: '#f0fdf4' },
    verifyBtn:       { backgroundColor: '#10B981', borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center', width: '100%' },
    btnDisabled:     { opacity: 0.5 },
    verifyBtnText:   { color: '#fff', fontSize: 16, fontWeight: '700' },
    resendRow:       { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    resendLabel:     { fontSize: 14, color: '#6b7280' },
    resendLink:      { fontSize: 14, color: '#10B981', fontWeight: '700' },
    countdown:       { fontSize: 14, color: '#9ca3af', fontWeight: '600' },
    hint:            { textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 24, lineHeight: 18 },
});

export default VerifyEmailScreen;
