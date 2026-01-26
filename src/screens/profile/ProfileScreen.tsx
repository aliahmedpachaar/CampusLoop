/**
 * CampusLoop Profile Screen
 * User profile display and settings
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopCard } from '../../components/common/Card';
import { CampusLoopAvatar } from '../../components/common/Avatar';
import { CampusLoopButton } from '../../components/common/Button';
import { CampusLoopCategoryChip } from '../../components/common/CategoryChip';
import { CampusLoopSpacing, CampusLoopTypography } from '../../constants/theme';

interface ProfileScreenProps {
    navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    const { colors, isDark, toggleTheme } = useCampusLoopTheme();
    const { state: authState, logout } = useCampusLoopAuth();

    const user = authState.user;

    if (!user) return null;

    const handleLogout = async () => {
        await logout();
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                style={styles.header}>
                <CampusLoopAvatar name={user.fullName} size="large" imageUri={user.profilePicture} />
                <Text style={styles.name}>{user.fullName}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </LinearGradient>

            <View style={styles.content}>
                <CampusLoopCard style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>University</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{user.university}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Course</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{user.course}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Semester</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{user.semester}</Text>
                    </View>
                </CampusLoopCard>

                {user.bio && (
                    <CampusLoopCard style={styles.bioCard}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Bio</Text>
                        <Text style={[styles.bioText, { color: colors.textSecondary }]}>{user.bio}</Text>
                    </CampusLoopCard>
                )}

                <CampusLoopCard style={styles.interestsCard}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Interests</Text>
                    <View style={styles.interestsContainer}>
                        {user.interests.map(interest => (
                            <CampusLoopCategoryChip key={interest} label={interest} selected style={styles.interestChip} />
                        ))}
                    </View>
                </CampusLoopCard>

                <CampusLoopCard style={styles.settingsCard}>
                    <TouchableOpacity style={styles.settingRow} onPress={toggleTheme}>
                        <Text style={[styles.settingText, { color: colors.text }]}>
                            {isDark ? '☀️' : '🌙'} {isDark ? 'Light Mode' : 'Dark Mode'}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('EditProfile')}>
                        <Text style={[styles.settingText, { color: colors.text }]}>✏️ Edit Profile</Text>
                    </TouchableOpacity>
                </CampusLoopCard>

                <CampusLoopButton
                    title="Logout"
                    onPress={handleLogout}
                    variant="outline"
                    fullWidth
                    style={styles.logoutButton}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingVertical: CampusLoopSpacing['3xl'],
        paddingHorizontal: CampusLoopSpacing.base,
    },
    name: {
        fontSize: CampusLoopTypography.fontSize['2xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        color: '#FFFFFF',
        marginTop: CampusLoopSpacing.base,
    },
    email: {
        fontSize: CampusLoopTypography.fontSize.base,
        color: '#FFFFFF',
        opacity: 0.9,
        marginTop: CampusLoopSpacing.xs,
    },
    content: {
        padding: CampusLoopSpacing.base,
    },
    infoCard: {
        marginBottom: CampusLoopSpacing.base,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: CampusLoopSpacing.sm,
    },
    infoLabel: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    infoValue: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    bioCard: {
        marginBottom: CampusLoopSpacing.base,
    },
    sectionTitle: {
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
        marginBottom: CampusLoopSpacing.sm,
    },
    bioText: {
        fontSize: CampusLoopTypography.fontSize.base,
        lineHeight: CampusLoopTypography.lineHeight.relaxed * CampusLoopTypography.fontSize.base,
    },
    interestsCard: {
        marginBottom: CampusLoopSpacing.base,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    interestChip: {
        marginBottom: CampusLoopSpacing.sm,
    },
    settingsCard: {
        marginBottom: CampusLoopSpacing.base,
    },
    settingRow: {
        paddingVertical: CampusLoopSpacing.md,
    },
    settingText: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    logoutButton: {
        marginTop: CampusLoopSpacing.base,
    },
});
