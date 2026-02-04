/**
 * CampusLoop Edit Profile Screen
 * Screen for editing user profile
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopButton } from '../../components/common/Button';
import { CampusLoopInput } from '../../components/common/Input';
import { CampusLoopUserService } from '../../services/userService';
import { CampusLoopSpacing, CampusLoopTypography } from '../../constants/theme';

export const EditProfileScreen: React.FC<any> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();
    const { state: authState, updateUser } = useCampusLoopAuth();
    const user = authState.user!;

    const [bio, setBio] = useState(user.bio || '');
    const [semester, setSemester] = useState(user.semester || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const updatedUser = await CampusLoopUserService.updateProfile({
                bio,
                semester,
            });
            if (updatedUser) {
                updateUser(updatedUser);
                Alert.alert('Success', 'Profile updated successfully');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Failed to update profile');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={[styles.backText, { color: colors.primary }]}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading}>
                    <Text style={[styles.saveText, { color: loading ? colors.textTertiary : colors.primary }]}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.formGroup}>
                    <CampusLoopInput
                        label="Bio"
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Tell us about yourself"
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.formGroup}>
                    <CampusLoopInput
                        label="Semester"
                        value={semester}
                        onChangeText={setSemester}
                        placeholder="e.g. Semester 4"
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: CampusLoopSpacing.base,
        paddingVertical: CampusLoopSpacing.md,
        borderBottomWidth: 1,
    },
    backText: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    headerTitle: {
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    saveText: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.bold,
    },
    content: {
        flex: 1,
        padding: CampusLoopSpacing.base,
    },
    formGroup: {
        marginBottom: CampusLoopSpacing.lg,
    },
});
