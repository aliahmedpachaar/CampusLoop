/**
 * CampusLoop - Profile Setup Screen
 * Shown once for new users after their first sign-in (email OTP or Google).
 * Collects: full name + campus selection.
 */

import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Alert, Platform, StatusBar, ActivityIndicator,
    KeyboardAvoidingView, ScrollView,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopCampuses, CampusLoopCourses, CITY_UNIVERSITY } from '../../constants/universities';

interface Props { navigation: any; route?: any }

export const ProfileSetupScreen: React.FC<Props> = ({ navigation }) => {
    const { completeProfile } = useCampusLoopAuth();

    const [campus,         setCampus]         = useState('');
    const [course,         setCourse]         = useState('');
    const [showCourseList, setShowCourseList] = useState(false);
    const [loading,        setLoading]        = useState(false);
    const [errors,         setErrors]         = useState<Record<string, string>>({});

    const validate = () => {
        const e: Record<string, string> = {};
        if (!campus) e.campus = 'Please select your campus';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleComplete = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await completeProfile({ campus, course });
            // AuthContext dispatches SET_USER → AppNavigator navigates to MainTabs automatically
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
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Almost done! 🎉</Text>
                    <Text style={styles.headerSub}>Tell us a bit about yourself</Text>
                </View>
            </LinearGradient>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <Animated.View entering={FadeInDown.duration(500)} style={styles.card}>

                        {/* University (locked) */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>University</Text>
                            <View style={[styles.inputRow, { backgroundColor: '#f0fdf4', borderColor: '#10B981' }]}>
                                <Ionicons name="school-outline" size={18} color="#10B981" style={styles.inputIcon} />
                                <Text style={[styles.input, { color: '#059669', fontWeight: '600' }]}>{CITY_UNIVERSITY}</Text>
                                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                            </View>
                        </View>

                        {/* Campus */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Your Campus <Text style={styles.required}>*</Text></Text>
                            <View style={styles.campusGrid}>
                                {CampusLoopCampuses.map(c => (
                                    <TouchableOpacity
                                        key={c}
                                        style={[styles.campusChip, campus === c && styles.campusChipActive]}
                                        onPress={() => { setCampus(c); setErrors(p => ({ ...p, campus: '' })); }}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons
                                            name={campus === c ? 'location' : 'location-outline'}
                                            size={16}
                                            color={campus === c ? '#fff' : '#6b7280'}
                                        />
                                        <Text style={[styles.campusText, campus === c && styles.campusTextActive]}>{c}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {!!errors.campus && <Text style={styles.errorText}>{errors.campus}</Text>}
                        </View>

                        {/* Course (optional) */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Course <Text style={styles.optional}>(optional)</Text></Text>
                            <TouchableOpacity
                                style={styles.inputRow}
                                onPress={() => setShowCourseList(p => !p)}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="book-outline" size={18} color="#9ca3af" style={styles.inputIcon} />
                                <Text style={[styles.input, !course && { color: '#d1d5db' }]}>
                                    {course || 'Select your course'}
                                </Text>
                                <Ionicons name={showCourseList ? 'chevron-up' : 'chevron-down'} size={18} color="#9ca3af" />
                            </TouchableOpacity>
                            {showCourseList && (
                                <View style={styles.dropdown}>
                                    <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                                        {CampusLoopCourses.map(c => (
                                            <TouchableOpacity
                                                key={c}
                                                style={[styles.dropdownItem, course === c && styles.dropdownItemActive]}
                                                onPress={() => { setCourse(c); setShowCourseList(false); }}
                                            >
                                                <Text style={[styles.dropdownText, course === c && { color: '#10B981', fontWeight: '700' }]}>{c}</Text>
                                                {course === c && <Ionicons name="checkmark" size={16} color="#10B981" />}
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            style={[styles.doneBtn, loading && styles.btnDisabled]}
                            onPress={handleComplete}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading
                                ? <ActivityIndicator color="#fff" />
                                : <>
                                    <Text style={styles.doneBtnText}>Enter CampusLoop</Text>
                                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                                </>}
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    root:               { flex: 1, backgroundColor: '#f9fafb' },
    header:             { paddingTop: Platform.OS === 'ios' ? 60 : 48, paddingBottom: 40, paddingHorizontal: 24 },
    headerContent:      { alignItems: 'center' },
    headerTitle:        { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 6 },
    headerSub:          { fontSize: 15, color: 'rgba(255,255,255,0.85)' },
    scroll:             { paddingHorizontal: 20, paddingBottom: 40 },
    card:               { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginTop: -20,
                          shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 8 },
    fieldGroup:         { marginBottom: 18 },
    label:              { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
    required:           { color: '#ef4444' },
    optional:           { color: '#9ca3af', fontWeight: '400' },
    inputRow:           { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb',
                          borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 14, height: 52 },
    inputError:         { borderColor: '#ef4444' },
    inputIcon:          { marginRight: 10 },
    input:              { flex: 1, fontSize: 15, color: '#111827' },
    errorText:          { fontSize: 12, color: '#ef4444', marginTop: 4 },
    campusGrid:         { gap: 10 },
    campusChip:         { flexDirection: 'row', alignItems: 'center', gap: 10,
                          paddingVertical: 14, paddingHorizontal: 16, backgroundColor: '#f9fafb',
                          borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12 },
    campusChipActive:   { backgroundColor: '#10B981', borderColor: '#10B981' },
    campusText:         { fontSize: 15, fontWeight: '500', color: '#374151', flex: 1 },
    campusTextActive:   { color: '#fff', fontWeight: '700' },
    dropdown:           { borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, marginTop: 4, backgroundColor: '#fff', overflow: 'hidden' },
    dropdownItem:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                          paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
    dropdownItemActive: { backgroundColor: '#f0fdf4' },
    dropdownText:       { fontSize: 14, color: '#374151' },
    doneBtn:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                          backgroundColor: '#10B981', borderRadius: 12, height: 52, marginTop: 8 },
    btnDisabled:        { opacity: 0.6 },
    doneBtnText:        { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default ProfileSetupScreen;
