/**
 * CampusLoop - Forgot Password Screen
 * Requires email + date of birth to match → sends OTP reset code
 */

import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    Alert, Platform, StatusBar, ActivityIndicator,
    KeyboardAvoidingView, ScrollView,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useCampusLoopAuth } from '../../context/AuthContext';

interface Props { navigation: any }

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
    const { forgotPassword } = useCampusLoopAuth();

    const [email,      setEmail]      = useState('');
    const [dobDisplay, setDobDisplay] = useState('');   // DD/MM/YYYY
    const [dob,        setDob]        = useState('');   // YYYY-MM-DD for backend
    const [loading,    setLoading]    = useState(false);
    const [sent,       setSent]       = useState(false);
    const [errors,     setErrors]     = useState<Record<string, string>>({});

    // DOB auto-format (same as SignupScreen)
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

    const validate = () => {
        const e: Record<string, string> = {};
        if (!email.trim())                    e.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email address';
        if (!dob) e.dob = 'Date of birth is required (DD/MM/YYYY)';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSend = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await forgotPassword(email.trim().toLowerCase(), dob);
            setSent(true);
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

                    {sent ? (
                        <Animated.View entering={FadeInDown.duration(500)} style={{ alignItems: 'center' }}>
                            <View style={styles.iconCircle}>
                                <Text style={{ fontSize: 48 }}>✅</Text>
                            </View>
                            <Text style={styles.title}>Code Sent!</Text>
                            <Text style={styles.subtitle}>
                                A password reset code has been sent to{'\n'}
                                <Text style={styles.highlight}>{email}</Text>
                            </Text>
                            <TouchableOpacity
                                style={styles.primaryBtn}
                                onPress={() => navigation.navigate('ResetPassword', { email: email.trim().toLowerCase() })}
                            >
                                <Text style={styles.primaryBtnText}>Enter Reset Code</Text>
                                <Ionicons name="arrow-forward" size={18} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.secondaryBtnText}>Back to Sign In</Text>
                            </TouchableOpacity>
                            <Text style={styles.spamNote}>
                                Check your spam folder if you don't see it.
                            </Text>
                        </Animated.View>
                    ) : (
                        <Animated.View entering={FadeInDown.duration(500)} style={{ alignItems: 'center', width: '100%' }}>
                            <View style={styles.iconCircle}>
                                <Text style={{ fontSize: 48 }}>🔑</Text>
                            </View>
                            <Text style={styles.title}>Forgot Password?</Text>
                            <Text style={styles.subtitle}>
                                Enter your email and date of birth to verify your identity. We'll send you a reset code.
                            </Text>

                            {/* Email */}
                            <View style={[styles.fieldGroup, { width: '100%' }]}>
                                <Text style={styles.label}>Email Address</Text>
                                <View style={[styles.inputRow, errors.email ? styles.inputError : null]}>
                                    <Ionicons name="mail-outline" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
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
                                    />
                                </View>
                                {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                            </View>

                            {/* Date of Birth */}
                            <View style={[styles.fieldGroup, { width: '100%' }]}>
                                <Text style={styles.label}>Date of Birth</Text>
                                <View style={[styles.inputRow, errors.dob ? styles.inputError : null]}>
                                    <Ionicons name="calendar-outline" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="DD/MM/YYYY"
                                        placeholderTextColor="#d1d5db"
                                        value={dobDisplay}
                                        onChangeText={handleDobChange}
                                        keyboardType="number-pad"
                                        returnKeyType="done"
                                        onSubmitEditing={handleSend}
                                    />
                                </View>
                                {!!errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
                                <Text style={styles.fieldHint}>Must match the date you used when signing up</Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.primaryBtn, loading && styles.btnDisabled]}
                                onPress={handleSend}
                                disabled={loading}
                            >
                                {loading
                                    ? <ActivityIndicator color="#fff" />
                                    : <Text style={styles.primaryBtnText}>Send Reset Code</Text>}
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={styles.backLink}>← Back to Sign In</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    root:            { flex: 1, backgroundColor: '#f9fafb' },
    header:          { paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 30, paddingHorizontal: 20 },
    backBtn:         { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    body:            { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
    iconCircle:      { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    title:           { fontSize: 26, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 10 },
    subtitle:        { fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 22, marginBottom: 28, paddingHorizontal: 10 },
    highlight:       { color: '#10B981', fontWeight: '700' },
    fieldGroup:      { marginBottom: 16 },
    label:           { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
    inputRow:        { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 14, height: 52 },
    inputError:      { borderColor: '#ef4444' },
    input:           { flex: 1, fontSize: 15, color: '#111827' },
    errorText:       { fontSize: 12, color: '#ef4444', marginTop: 4 },
    fieldHint:       { fontSize: 12, color: '#9ca3af', marginTop: 6 },
    primaryBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#10B981', borderRadius: 12, height: 52, width: '100%', marginTop: 8 },
    btnDisabled:     { opacity: 0.6 },
    primaryBtnText:  { color: '#fff', fontSize: 16, fontWeight: '700' },
    secondaryBtn:    { height: 48, alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 12 },
    secondaryBtnText:{ fontSize: 15, color: '#6b7280', fontWeight: '600' },
    backLink:        { marginTop: 24, fontSize: 14, color: '#10B981', fontWeight: '600' },
    spamNote:        { textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 20, lineHeight: 18 },
});

export default ForgotPasswordScreen;
