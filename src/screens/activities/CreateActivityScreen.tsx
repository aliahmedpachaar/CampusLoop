/**
 * CampusLoop Create Activity Screen
 * Beautiful form to create new activities
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeInDown,
    FadeInUp,
} from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopActivityService } from '../../services/activityService';
import {
    CampusLoopSpacing,
    CampusLoopTypography,
    CampusLoopBorderRadius,
    CampusLoopShadows,
} from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface CreateActivityScreenProps {
    navigation: any;
    route: any;
}

const activityTypes = [
    { key: 'study_group', icon: '📚', label: 'Study Group', color: '#0D9488', description: 'Form a study group or find study partners' },
    { key: 'assignment_help', icon: '🤝', label: 'Need Help', color: '#F59E0B', description: 'Get help with assignments or projects' },
    { key: 'sports', icon: '⚽', label: 'Sports', color: '#10B981', description: 'Play sports together' },
    { key: 'event', icon: '🎬', label: 'Movies/Events', color: '#EF4444', description: 'Watch movies or attend events together' },
    { key: 'trips', icon: '✈️', label: 'Trip', color: '#0EA5E9', description: 'Plan a trip or outing' },
    { key: 'food', icon: '🍕', label: 'Food', color: '#F97316', description: 'Grab food or coffee together' },
    { key: 'project_collab', icon: '💻', label: 'Project', color: '#8B5CF6', description: 'Collaborate on projects' },
];

const participantOptions = [2, 3, 4, 5, 6, 8, 10, 15, 20];

export const CreateActivityScreen: React.FC<CreateActivityScreenProps> = ({ navigation, route }) => {
    const { colors } = useCampusLoopTheme();
    const { state: authState } = useCampusLoopAuth();

    const preSelectedType = route?.params?.type;

    const [step, setStep] = useState(preSelectedType ? 2 : 1);
    const [selectedType, setSelectedType] = useState(preSelectedType || '');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [maxParticipants, setMaxParticipants] = useState(5);
    const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const selectedTypeInfo = activityTypes.find(t => t.key === selectedType);

    const handleSelectType = (type: string) => {
        setSelectedType(type);
        setStep(2);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigation.goBack();
        }
    };

    const validateForm = () => {
        if (!title.trim()) {
            Alert.alert('Missing Title', 'Please enter a title for your activity');
            return false;
        }
        if (!description.trim()) {
            Alert.alert('Missing Description', 'Please add a description to help others understand your activity');
            return false;
        }
        return true;
    };

    const handleCreate = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await CampusLoopActivityService.createActivity(
                authState.user!.id,
                authState.user!.fullName,
                authState.user!.university,
                {
                    type: selectedType as any,
                    title: title.trim(),
                    description: description.trim(),
                    maxParticipants,
                    location: location.trim() || undefined,
                    scheduledDate: scheduledDate || undefined,
                }
            );

            Alert.alert(
                'Activity Created! 🎉',
                'Your activity is now live. Others can join and connect with you!',
                [{ text: 'Great!', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to create activity. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (event: any, date?: Date) => {
        setShowDatePicker(false);
        if (date) {
            setScheduledDate(date);
            setShowTimePicker(true);
        }
    };

    const handleTimeChange = (event: any, date?: Date) => {
        setShowTimePicker(false);
        if (date && scheduledDate) {
            const newDate = new Date(scheduledDate);
            newDate.setHours(date.getHours());
            newDate.setMinutes(date.getMinutes());
            setScheduledDate(newDate);
        }
    };

    const renderTypeSelection = () => (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
                What kind of activity?
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Choose what you want to do
            </Text>

            <View style={styles.typeGrid}>
                {activityTypes.map((type, index) => (
                    <Animated.View
                        key={type.key}
                        entering={FadeInDown.delay(index * 50).duration(300)}
                    >
                        <TouchableOpacity
                            style={[
                                styles.typeCard,
                                { backgroundColor: colors.surface },
                                selectedType === type.key && { borderColor: type.color, borderWidth: 2 }
                            ]}
                            onPress={() => handleSelectType(type.key)}
                        >
                            <View style={[styles.typeIconContainer, { backgroundColor: type.color + '15' }]}>
                                <Text style={styles.typeIcon}>{type.icon}</Text>
                            </View>
                            <Text style={[styles.typeLabel, { color: colors.text }]}>
                                {type.label}
                            </Text>
                            <Text style={[styles.typeDescription, { color: colors.textTertiary }]} numberOfLines={2}>
                                {type.description}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </Animated.View>
    );

    const renderDetailsForm = () => (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            {/* Selected Type Badge */}
            {selectedTypeInfo && (
                <TouchableOpacity
                    style={[styles.selectedTypeBadge, { backgroundColor: selectedTypeInfo.color + '15' }]}
                    onPress={() => setStep(1)}
                >
                    <Text style={styles.selectedTypeIcon}>{selectedTypeInfo.icon}</Text>
                    <Text style={[styles.selectedTypeLabel, { color: selectedTypeInfo.color }]}>
                        {selectedTypeInfo.label}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={selectedTypeInfo.color} />
                </TouchableOpacity>
            )}

            <Text style={[styles.stepTitle, { color: colors.text }]}>
                Tell us more
            </Text>

            {/* Title Input */}
            <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Title *</Text>
                <TextInput
                    style={[
                        styles.textInput,
                        { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }
                    ]}
                    placeholder="e.g., Movie night this Saturday!"
                    placeholderTextColor={colors.textTertiary}
                    value={title}
                    onChangeText={setTitle}
                    maxLength={100}
                />
                <Text style={[styles.charCount, { color: colors.textTertiary }]}>
                    {title.length}/100
                </Text>
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Description *</Text>
                <TextInput
                    style={[
                        styles.textInput,
                        styles.textArea,
                        { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }
                    ]}
                    placeholder="Describe your activity, what you're planning, who should join..."
                    placeholderTextColor={colors.textTertiary}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    maxLength={500}
                />
                <Text style={[styles.charCount, { color: colors.textTertiary }]}>
                    {description.length}/500
                </Text>
            </View>

            {/* Location Input */}
            <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                    Location <Text style={{ color: colors.textTertiary }}>(optional)</Text>
                </Text>
                <View style={[styles.inputWithIcon, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Ionicons name="location-outline" size={20} color={colors.textTertiary} />
                    <TextInput
                        style={[styles.iconInput, { color: colors.text }]}
                        placeholder="Campus library, Room 101..."
                        placeholderTextColor={colors.textTertiary}
                        value={location}
                        onChangeText={setLocation}
                    />
                </View>
            </View>

            {/* Date & Time */}
            <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                    When? <Text style={{ color: colors.textTertiary }}>(optional)</Text>
                </Text>
                <TouchableOpacity
                    style={[styles.inputWithIcon, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Ionicons name="calendar-outline" size={20} color={colors.textTertiary} />
                    <Text style={[
                        styles.iconInput,
                        { color: scheduledDate ? colors.text : colors.textTertiary }
                    ]}>
                        {scheduledDate
                            ? scheduledDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                            : 'Select date and time'
                        }
                    </Text>
                    {scheduledDate && (
                        <TouchableOpacity onPress={() => setScheduledDate(null)}>
                            <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            </View>

            {/* Participants */}
            <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Max Participants</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.participantOptions}
                >
                    {participantOptions.map((num) => (
                        <TouchableOpacity
                            key={num}
                            style={[
                                styles.participantChip,
                                { borderColor: colors.border },
                                maxParticipants === num && { backgroundColor: colors.primary, borderColor: colors.primary }
                            ]}
                            onPress={() => setMaxParticipants(num)}
                        >
                            <Text style={[
                                styles.participantChipText,
                                { color: maxParticipants === num ? '#FFFFFF' : colors.text }
                            ]}>
                                {num}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Create Button */}
            <TouchableOpacity
                style={[styles.createButton, { opacity: loading ? 0.7 : 1 }]}
                onPress={handleCreate}
                disabled={loading}
            >
                <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.createButtonGradient}
                >
                    <Text style={styles.createButtonText}>
                        {loading ? 'Creating...' : 'Create Activity'}
                    </Text>
                    {!loading && <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />}
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    {step === 1 ? 'New Activity' : 'Activity Details'}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* Progress */}
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            { backgroundColor: colors.primary, width: step === 1 ? '50%' : '100%' }
                        ]}
                    />
                </View>
                <Text style={[styles.progressText, { color: colors.textTertiary }]}>
                    Step {step} of 2
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {step === 1 ? renderTypeSelection() : renderDetailsForm()}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Date Picker */}
            {showDatePicker && (
                <DateTimePicker
                    value={scheduledDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}

            {/* Time Picker */}
            {showTimePicker && (
                <DateTimePicker
                    value={scheduledDate || new Date()}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight! + 16,
        paddingHorizontal: CampusLoopSpacing.base,
        paddingBottom: CampusLoopSpacing.base,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    closeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressContainer: {
        paddingHorizontal: CampusLoopSpacing.xl,
        paddingVertical: CampusLoopSpacing.md,
    },
    progressBar: {
        height: 4,
        borderRadius: 2,
        marginBottom: CampusLoopSpacing.xs,
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    progressText: {
        fontSize: CampusLoopTypography.fontSize.xs,
        textAlign: 'right',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: CampusLoopSpacing['3xl'],
    },
    stepContent: {
        paddingHorizontal: CampusLoopSpacing.xl,
        paddingTop: CampusLoopSpacing.lg,
    },
    stepTitle: {
        fontSize: CampusLoopTypography.fontSize['2xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        marginBottom: CampusLoopSpacing.xs,
    },
    stepSubtitle: {
        fontSize: CampusLoopTypography.fontSize.base,
        marginBottom: CampusLoopSpacing.xl,
    },
    typeGrid: {
        gap: CampusLoopSpacing.md,
    },
    typeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: CampusLoopSpacing.base,
        borderRadius: CampusLoopBorderRadius.lg,
        ...CampusLoopShadows.sm,
    },
    typeIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: CampusLoopSpacing.md,
    },
    typeIcon: {
        fontSize: 24,
    },
    typeLabel: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
        flex: 1,
    },
    typeDescription: {
        fontSize: CampusLoopTypography.fontSize.xs,
        flex: 2,
        textAlign: 'right',
    },
    selectedTypeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: CampusLoopSpacing.md,
        paddingVertical: CampusLoopSpacing.sm,
        borderRadius: CampusLoopBorderRadius.full,
        marginBottom: CampusLoopSpacing.lg,
        gap: CampusLoopSpacing.xs,
    },
    selectedTypeIcon: {
        fontSize: 16,
    },
    selectedTypeLabel: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    inputGroup: {
        marginBottom: CampusLoopSpacing.lg,
    },
    inputLabel: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
        marginBottom: CampusLoopSpacing.sm,
    },
    textInput: {
        borderWidth: 1.5,
        borderRadius: CampusLoopBorderRadius.lg,
        paddingHorizontal: CampusLoopSpacing.base,
        paddingVertical: CampusLoopSpacing.md,
        fontSize: CampusLoopTypography.fontSize.base,
    },
    textArea: {
        minHeight: 100,
        paddingTop: CampusLoopSpacing.md,
    },
    charCount: {
        fontSize: CampusLoopTypography.fontSize.xs,
        textAlign: 'right',
        marginTop: 4,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: CampusLoopBorderRadius.lg,
        paddingHorizontal: CampusLoopSpacing.base,
        paddingVertical: CampusLoopSpacing.md,
        gap: CampusLoopSpacing.sm,
    },
    iconInput: {
        flex: 1,
        fontSize: CampusLoopTypography.fontSize.base,
    },
    participantOptions: {
        gap: CampusLoopSpacing.sm,
    },
    participantChip: {
        paddingHorizontal: CampusLoopSpacing.lg,
        paddingVertical: CampusLoopSpacing.sm,
        borderRadius: CampusLoopBorderRadius.full,
        borderWidth: 1.5,
    },
    participantChipText: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    createButton: {
        marginTop: CampusLoopSpacing.xl,
        borderRadius: CampusLoopBorderRadius.lg,
        overflow: 'hidden',
        ...CampusLoopShadows.md,
    },
    createButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: CampusLoopSpacing.base + 2,
        gap: CampusLoopSpacing.sm,
    },
    createButtonText: {
        color: '#FFFFFF',
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
});

export default CreateActivityScreen;
