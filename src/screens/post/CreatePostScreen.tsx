/**
 * CampusLoop Create Post Screen
 * Screen for creating new posts
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopButton } from '../../components/common/Button';
import { CampusLoopCategoryChip } from '../../components/common/CategoryChip';
import { CampusLoopPostService } from '../../services/postService';
import { CampusLoopPostCategory, CampusLoopPostCategoryLabels, CampusLoopPostCategoryColors } from '../../types/post';
import { CampusLoopSpacing, CampusLoopTypography } from '../../constants/theme';

export const CreatePostScreen: React.FC<any> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();
    const { state: authState } = useCampusLoopAuth();

    const [content, setContent] = useState('');
    const [category, setCategory] = useState<CampusLoopPostCategory>('discussion');
    const [loading, setLoading] = useState(false);

    const categories: CampusLoopPostCategory[] = ['assignment', 'coding', 'activities', 'sports', 'events', 'discussion'];

    const handleCreate = async () => {
        if (!content.trim()) {
            Alert.alert('Error', 'Please enter some content');
            return;
        }

        setLoading(true);
        try {
            await CampusLoopPostService.createPost(
                authState.user!.id,
                authState.user!.fullName,
                authState.user!.university,
                {
                    content,
                    category,
                }
            );
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to create post');
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Create Post</Text>
                <TouchableOpacity onPress={handleCreate} disabled={loading}>
                    <Text style={[styles.postText, { color: loading ? colors.textTertiary : colors.primary }]}>Post</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="What's on your mind?"
                        placeholderTextColor={colors.textTertiary}
                        multiline
                        value={content}
                        onChangeText={setContent}
                        autoFocus
                    />
                </View>

                <View style={styles.categoryContainer}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Select Category</Text>
                    <View style={styles.chipsContainer}>
                        {categories.map(cat => (
                            <CampusLoopCategoryChip
                                key={cat}
                                label={CampusLoopPostCategoryLabels[cat]}
                                selected={category === cat}
                                onPress={() => setCategory(cat)}
                                color={CampusLoopPostCategoryColors[cat]}
                                style={styles.chip}
                            />
                        ))}
                    </View>
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
    postText: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.bold,
    },
    content: {
        flex: 1,
        padding: CampusLoopSpacing.base,
    },
    inputContainer: {
        marginBottom: CampusLoopSpacing.lg,
    },
    input: {
        fontSize: CampusLoopTypography.fontSize.lg,
        minHeight: 150,
        textAlignVertical: 'top',
    },
    categoryContainer: {
        marginTop: CampusLoopSpacing.md,
    },
    sectionLabel: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.medium,
        marginBottom: CampusLoopSpacing.sm,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chip: {
        marginBottom: CampusLoopSpacing.sm,
    },
});
