/**
 * CampusLoop Enhanced Profile Screen
 * Professional profile with stats, cover photo, and achievements
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopCard } from '../../components/common/Card';
import { CampusLoopAvatar } from '../../components/common/Avatar';
import { CampusLoopButton } from '../../components/common/Button';
import { CampusLoopCategoryChip } from '../../components/common/CategoryChip';
import {
    CampusLoopSpacing,
    CampusLoopTypography,
    CampusLoopBorderRadius,
    CampusLoopShadows,
} from '../../constants/theme';

const { width } = Dimensions.get('window');

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

    // Mock stats - in real app, fetch from API
    const stats = {
        posts: 24,
        activities: 12,
        connections: 156,
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Cover Photo with Gradient */}
            <View style={styles.coverContainer}>
                <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.coverPhoto}
                >
                    <TouchableOpacity style={styles.settingsButton}>
                        <Text style={styles.settingsIcon}>⚙️</Text>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Profile Picture */}
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatarBorder, { backgroundColor: colors.background }]}>
                        <CampusLoopAvatar
                            name={user.fullName}
                            size="large"
                            imageUri={user.profilePicture}
                        />
                    </View>
                    <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: colors.primary }]}>
                        <Text style={styles.editAvatarIcon}>📷</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.content}>
                {/* User Info */}
                <View style={styles.userInfo}>
                    <Text style={[styles.name, { color: colors.text }]}>{user.fullName}</Text>
                    <Text style={[styles.email, { color: colors.textSecondary }]}>{user.email}</Text>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statValue, { color: colors.primary }]}>{stats.posts}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Posts</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statValue, { color: colors.secondary }]}>{stats.activities}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Activities</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statValue, { color: colors.accent }]}>{stats.connections}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Connections</Text>
                    </View>
                </View>

                {/* Edit Profile Button */}
                <TouchableOpacity
                    style={[styles.editProfileButton, { backgroundColor: colors.primary }]}
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    <LinearGradient
                        colors={[colors.gradientStart, colors.gradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.editProfileGradient}
                    >
                        <Text style={styles.editProfileText}>✏️ Edit Profile</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* University Info Card */}
                <CampusLoopCard style={styles.infoCard}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>🎓 Academic Info</Text>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>University</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{user.university}</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Course</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{user.course}</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Semester</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{user.semester}</Text>
                    </View>
                </CampusLoopCard>

                {/* Bio Card */}
                {user.bio && (
                    <CampusLoopCard style={styles.bioCard}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>📝 About Me</Text>
                        <Text style={[styles.bioText, { color: colors.textSecondary }]}>{user.bio}</Text>
                    </CampusLoopCard>
                )}

                {/* Interests Card */}
                <CampusLoopCard style={styles.interestsCard}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>💡 Interests</Text>
                    <View style={styles.interestsContainer}>
                        {user.interests.map((interest) => (
                            <CampusLoopCategoryChip
                                key={interest}
                                label={interest}
                                selected
                                style={styles.interestChip}
                            />
                        ))}
                    </View>
                </CampusLoopCard>

                {/* Achievements Card */}
                <CampusLoopCard style={styles.achievementsCard}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>🏆 Achievements</Text>
                    <View style={styles.achievementsGrid}>
                        <View style={styles.achievementBadge}>
                            <Text style={styles.achievementIcon}>🌟</Text>
                            <Text style={[styles.achievementText, { color: colors.textSecondary }]}>
                                Early Adopter
                            </Text>
                        </View>
                        <View style={styles.achievementBadge}>
                            <Text style={styles.achievementIcon}>🎯</Text>
                            <Text style={[styles.achievementText, { color: colors.textSecondary }]}>
                                Active Member
                            </Text>
                        </View>
                        <View style={styles.achievementBadge}>
                            <Text style={styles.achievementIcon}>💬</Text>
                            <Text style={[styles.achievementText, { color: colors.textSecondary }]}>
                                Social Butterfly
                            </Text>
                        </View>
                    </View>
                </CampusLoopCard>

                {/* Settings Card */}
                <CampusLoopCard style={styles.settingsCard}>
                    <TouchableOpacity style={styles.settingRow} onPress={toggleTheme}>
                        <Text style={[styles.settingText, { color: colors.text }]}>
                            {isDark ? '☀️' : '🌙'} {isDark ? 'Light Mode' : 'Dark Mode'}
                        </Text>
                        <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <TouchableOpacity style={styles.settingRow}>
                        <Text style={[styles.settingText, { color: colors.text }]}>🔔 Notifications</Text>
                        <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <TouchableOpacity style={styles.settingRow}>
                        <Text style={[styles.settingText, { color: colors.text }]}>🔒 Privacy</Text>
                        <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <TouchableOpacity style={styles.settingRow}>
                        <Text style={[styles.settingText, { color: colors.text }]}>❓ Help & Support</Text>
                        <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                </CampusLoopCard>

                {/* Logout Button */}
                <CampusLoopButton
                    title="Logout"
                    onPress={handleLogout}
                    variant="outline"
                    fullWidth
                    style={styles.logoutButton}
                />

                <View style={styles.bottomSpacer} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    coverContainer: {
        position: 'relative',
    },
    coverPhoto: {
        width: '100%',
        height: 200,
    },
    settingsButton: {
        position: 'absolute',
        top: 50,
        right: CampusLoopSpacing.base,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsIcon: {
        fontSize: 20,
    },
    avatarContainer: {
        position: 'absolute',
        bottom: -50,
        alignSelf: 'center',
    },
    avatarBorder: {
        padding: 4,
        borderRadius: 60,
        ...CampusLoopShadows.lg,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        ...CampusLoopShadows.md,
    },
    editAvatarIcon: {
        fontSize: 16,
    },
    content: {
        marginTop: 60,
        padding: CampusLoopSpacing.base,
    },
    userInfo: {
        alignItems: 'center',
        marginBottom: CampusLoopSpacing.xl,
    },
    name: {
        fontSize: CampusLoopTypography.fontSize['2xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        marginBottom: CampusLoopSpacing.xs,
    },
    email: {
        fontSize: CampusLoopTypography.fontSize.base,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: CampusLoopSpacing.xl,
    },
    statCard: {
        flex: 1,
        marginHorizontal: 4,
        padding: CampusLoopSpacing.base,
        borderRadius: CampusLoopBorderRadius.lg,
        alignItems: 'center',
        ...CampusLoopShadows.sm,
    },
    statValue: {
        fontSize: CampusLoopTypography.fontSize['2xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: CampusLoopTypography.fontSize.sm,
    },
    editProfileButton: {
        borderRadius: CampusLoopBorderRadius.lg,
        marginBottom: CampusLoopSpacing.xl,
        overflow: 'hidden',
    },
    editProfileGradient: {
        paddingVertical: CampusLoopSpacing.md,
        alignItems: 'center',
    },
    editProfileText: {
        color: '#FFFFFF',
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.bold,
    },
    infoCard: {
        marginBottom: CampusLoopSpacing.base,
    },
    cardTitle: {
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.bold,
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
    },
    bioCard: {
        marginBottom: CampusLoopSpacing.base,
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
    achievementsCard: {
        marginBottom: CampusLoopSpacing.base,
    },
    achievementsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    achievementBadge: {
        alignItems: 'center',
    },
    achievementIcon: {
        fontSize: 40,
        marginBottom: CampusLoopSpacing.xs,
    },
    achievementText: {
        fontSize: CampusLoopTypography.fontSize.xs,
        textAlign: 'center',
    },
    settingsCard: {
        marginBottom: CampusLoopSpacing.base,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: CampusLoopSpacing.md,
    },
    settingText: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    settingArrow: {
        fontSize: 24,
        color: '#94A3B8',
    },
    logoutButton: {
        marginTop: CampusLoopSpacing.base,
    },
    bottomSpacer: {
        height: CampusLoopSpacing['2xl'],
    },
});
