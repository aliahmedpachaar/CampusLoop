/**
 * CampusLoop Profile Screen
 * Clean profile design with campus info and activities
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopAvatar } from '../../components/common/Avatar';
import {
    CampusLoopSpacing,
    CampusLoopTypography,
    CampusLoopBorderRadius,
    CampusLoopShadows,
} from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ProfileScreenProps {
    navigation: any;
}

interface MenuItemProps {
    icon: string;
    iconColor: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    colors: any;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, iconColor, title, subtitle, onPress, colors }) => (
    <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.surface }]} onPress={onPress}>
        <View style={[styles.menuIconContainer, { backgroundColor: iconColor + '15' }]}>
            <Ionicons name={icon as any} size={22} color={iconColor} />
        </View>
        <View style={styles.menuContent}>
            <Text style={[styles.menuTitle, { color: colors.text }]}>{title}</Text>
            {subtitle && <Text style={[styles.menuSubtitle, { color: colors.textTertiary }]}>{subtitle}</Text>}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
);

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    const { colors, isDark, toggleTheme } = useCampusLoopTheme();
    const { state: authState, logout } = useCampusLoopAuth();

    const user = authState.user;

    if (!user) return null;

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: logout },
            ]
        );
    };

    // Mock stats
    const stats = {
        activities: 12,
        created: 5,
        connections: 48,
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.header}
                >
                    {/* Settings Button */}
                    <TouchableOpacity style={styles.settingsBtn}>
                        <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    {/* Profile Info */}
                    <Animated.View entering={FadeIn.duration(500)} style={styles.profileInfo}>
                        <View style={[styles.avatarWrapper, { borderColor: 'rgba(255,255,255,0.3)' }]}>
                            <CampusLoopAvatar
                                name={user.fullName}
                                size="large"
                                imageUri={user.profilePicture}
                            />
                        </View>
                        <Text style={styles.userName}>{user.fullName}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>

                        {/* Campus Badge */}
                        <View style={styles.campusBadge}>
                            <Ionicons name="school-outline" size={14} color="rgba(255,255,255,0.9)" />
                            <Text style={styles.campusText}>{user.university}</Text>
                        </View>
                    </Animated.View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.activities}</Text>
                            <Text style={styles.statLabel}>Joined</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.created}</Text>
                            <Text style={styles.statLabel}>Created</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.connections}</Text>
                            <Text style={styles.statLabel}>Friends</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Edit Profile Button */}
                <View style={styles.editButtonContainer}>
                    <TouchableOpacity
                        style={[styles.editButton, { backgroundColor: colors.surface }]}
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <Ionicons name="pencil" size={18} color={colors.primary} />
                        <Text style={[styles.editButtonText, { color: colors.primary }]}>
                            Edit Profile
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Academic Info Card */}
                <Animated.View
                    entering={FadeInDown.delay(100).duration(400)}
                    style={styles.section}
                >
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        🎓 Academic Info
                    </Text>
                    <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                        <View style={styles.infoRow}>
                            <View style={[styles.infoIcon, { backgroundColor: colors.primary + '15' }]}>
                                <Ionicons name="school" size={18} color={colors.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Course</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>{user.course}</Text>
                            </View>
                        </View>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <View style={styles.infoRow}>
                            <View style={[styles.infoIcon, { backgroundColor: colors.secondary + '15' }]}>
                                <Ionicons name="calendar" size={18} color={colors.secondary} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Semester</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>{user.semester}</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Interests */}
                <Animated.View
                    entering={FadeInDown.delay(200).duration(400)}
                    style={styles.section}
                >
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        💡 Interests
                    </Text>
                    <View style={styles.interestTags}>
                        {user.interests.map((interest, index) => (
                            <View
                                key={interest}
                                style={[styles.interestTag, { backgroundColor: colors.primary + '15' }]}
                            >
                                <Text style={[styles.interestText, { color: colors.primary }]}>
                                    {interest}
                                </Text>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* Menu Items */}
                <Animated.View
                    entering={FadeInDown.delay(300).duration(400)}
                    style={styles.section}
                >
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        ⚙️ Settings
                    </Text>
                    <View style={styles.menuList}>
                        <MenuItem
                            icon={isDark ? 'sunny' : 'moon'}
                            iconColor="#F59E0B"
                            title={isDark ? 'Light Mode' : 'Dark Mode'}
                            subtitle="Change app appearance"
                            onPress={toggleTheme}
                            colors={colors}
                        />
                        <MenuItem
                            icon="notifications-outline"
                            iconColor="#0EA5E9"
                            title="Notifications"
                            subtitle="Manage your alerts"
                            onPress={() => navigation.navigate('Notifications')}
                            colors={colors}
                        />
                        <MenuItem
                            icon="shield-checkmark-outline"
                            iconColor="#10B981"
                            title="Privacy"
                            subtitle="Control your data"
                            onPress={() => {}}
                            colors={colors}
                        />
                        <MenuItem
                            icon="help-circle-outline"
                            iconColor="#8B5CF6"
                            title="Help & Support"
                            subtitle="Get assistance"
                            onPress={() => {}}
                            colors={colors}
                        />
                    </View>
                </Animated.View>

                {/* Logout */}
                <TouchableOpacity
                    style={[styles.logoutButton, { borderColor: colors.error }]}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={20} color={colors.error} />
                    <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
                </TouchableOpacity>

                {/* App Version */}
                <Text style={[styles.versionText, { color: colors.textTertiary }]}>
                    CampusLoop v1.0.0
                </Text>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 60,
        paddingBottom: CampusLoopSpacing.xl,
        borderBottomLeftRadius: CampusLoopBorderRadius['3xl'],
        borderBottomRightRadius: CampusLoopBorderRadius['3xl'],
    },
    settingsBtn: {
        position: 'absolute',
        top: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 60,
        right: CampusLoopSpacing.xl,
        zIndex: 10,
    },
    profileInfo: {
        alignItems: 'center',
        paddingHorizontal: CampusLoopSpacing.xl,
    },
    avatarWrapper: {
        padding: 4,
        borderRadius: 60,
        borderWidth: 3,
        marginBottom: CampusLoopSpacing.md,
    },
    userName: {
        fontSize: CampusLoopTypography.fontSize['2xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: CampusLoopTypography.fontSize.sm,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: CampusLoopSpacing.md,
    },
    campusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: CampusLoopSpacing.md,
        paddingVertical: CampusLoopSpacing.xs,
        borderRadius: CampusLoopBorderRadius.full,
        gap: 6,
    },
    campusText: {
        fontSize: CampusLoopTypography.fontSize.sm,
        color: '#FFFFFF',
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    statsRow: {
        flexDirection: 'row',
        marginTop: CampusLoopSpacing.xl,
        marginHorizontal: CampusLoopSpacing.xl,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: CampusLoopBorderRadius.lg,
        padding: CampusLoopSpacing.base,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: CampusLoopTypography.fontSize.xl,
        fontWeight: CampusLoopTypography.fontWeight.bold,
        color: '#FFFFFF',
    },
    statLabel: {
        fontSize: CampusLoopTypography.fontSize.xs,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    editButtonContainer: {
        paddingHorizontal: CampusLoopSpacing.xl,
        marginTop: -CampusLoopSpacing.lg,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: CampusLoopSpacing.md,
        borderRadius: CampusLoopBorderRadius.lg,
        gap: CampusLoopSpacing.sm,
        ...CampusLoopShadows.md,
    },
    editButtonText: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    section: {
        paddingHorizontal: CampusLoopSpacing.xl,
        marginTop: CampusLoopSpacing.xl,
    },
    sectionTitle: {
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.bold,
        marginBottom: CampusLoopSpacing.md,
    },
    infoCard: {
        borderRadius: CampusLoopBorderRadius.lg,
        padding: CampusLoopSpacing.base,
        ...CampusLoopShadows.sm,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: CampusLoopSpacing.sm,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: CampusLoopSpacing.md,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: CampusLoopTypography.fontSize.xs,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    divider: {
        height: 1,
        marginVertical: CampusLoopSpacing.xs,
    },
    interestTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: CampusLoopSpacing.sm,
    },
    interestTag: {
        paddingHorizontal: CampusLoopSpacing.md,
        paddingVertical: CampusLoopSpacing.sm,
        borderRadius: CampusLoopBorderRadius.full,
    },
    interestText: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    menuList: {
        gap: CampusLoopSpacing.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: CampusLoopSpacing.md,
        borderRadius: CampusLoopBorderRadius.lg,
        ...CampusLoopShadows.sm,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: CampusLoopSpacing.md,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    menuSubtitle: {
        fontSize: CampusLoopTypography.fontSize.xs,
        marginTop: 2,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: CampusLoopSpacing.xl,
        marginTop: CampusLoopSpacing.xl,
        paddingVertical: CampusLoopSpacing.md,
        borderRadius: CampusLoopBorderRadius.lg,
        borderWidth: 1.5,
        gap: CampusLoopSpacing.sm,
    },
    logoutText: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    versionText: {
        textAlign: 'center',
        marginTop: CampusLoopSpacing.xl,
        fontSize: CampusLoopTypography.fontSize.xs,
    },
});

export default ProfileScreen;
