/**
 * CampusLoop Signup Screen
 * Multi-step user registration with clean design
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    TouchableOpacity,
    Dimensions,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopButton } from '../../components/common/Button';
import { CampusLoopInput } from '../../components/common/Input';
import { CampusLoopValidation } from '../../utils/validation';
import { CampusLoopUniversities, CampusLoopCourses, CampusLoopSemesters, CampusLoopInterests } from '../../constants/universities';
import { CampusLoopSpacing, CampusLoopTypography, CampusLoopBorderRadius, CampusLoopShadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface SignupScreenProps {
    navigation: any;
}

// Campus options for PJ/CJ
const campusOptions = ['PJ Campus', 'CJ Campus', 'Main Campus', 'City Campus', 'Online'];

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();
    const { signup } = useCampusLoopAuth();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [university, setUniversity] = useState('');
    const [campus, setCampus] = useState('');
    const [course, setCourse] = useState('');
    const [semester, setSemester] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const [errors, setErrors] = useState<any>({});

    const totalSteps = 4;

    const validateStep1 = (): boolean => {
        const newErrors: any = {};
        let isValid = true;

        if (!CampusLoopValidation.isValidEmail(email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        const passwordError = CampusLoopValidation.getPasswordStrengthMessage(password);
        if (passwordError) {
            newErrors.password = passwordError;
            isValid = false;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateStep2 = (): boolean => {
        const newErrors: any = {};
        let isValid = true;

        if (!fullName.trim()) {
            newErrors.fullName = 'Please enter your name';
            isValid = false;
        }

        if (!university) {
            newErrors.university = 'Please select your university';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateStep3 = (): boolean => {
        const newErrors: any = {};
        let isValid = true;

        if (!course) {
            newErrors.course = 'Please select your program';
            isValid = false;
        }

        if (!semester) {
            newErrors.semester = 'Please select your semester';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
            setErrors({});
        } else if (step === 2 && validateStep2()) {
            setStep(3);
            setErrors({});
        } else if (step === 3 && validateStep3()) {
            setStep(4);
            setErrors({});
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            setErrors({});
        } else {
            navigation.goBack();
        }
    };

    const handleSignup = async () => {
        if (selectedInterests.length < 1) {
            Alert.alert('Select Interests', 'Please select at least one interest to help us personalize your experience');
            return;
        }

        setLoading(true);
        try {
            await signup({
                email,
                password,
                fullName,
                university,
                campus,
                course,
                semester,
                interests: selectedInterests,
            });
        } catch (error: any) {
            Alert.alert('Signup Failed', error.message || 'Please try again');
        } finally {
            setLoading(false);
        }
    };

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else if (selectedInterests.length < 6) {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    // Selection Chip Component
    const SelectionChip = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
        <TouchableOpacity
            style={[
                styles.chip,
                { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.border }
            ]}
            onPress={onPress}
        >
            <Text style={[styles.chipText, { color: selected ? '#FFFFFF' : colors.text }]}>
                {label}
            </Text>
            {selected && <Ionicons name="checkmark" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />}
        </TouchableOpacity>
    );

    const renderProgressBar = () => (
        <View style={styles.progressContainer}>
            <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                <Animated.View
                    style={[
                        styles.progressFill,
                        { backgroundColor: colors.primary, width: `${(step / totalSteps) * 100}%` }
                    ]}
                />
            </View>
            <Text style={[styles.progressText, { color: colors.textTertiary }]}>
                Step {step} of {totalSteps}
            </Text>
        </View>
    );

    const renderStep1 = () => (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <View style={styles.stepHeader}>
                <Text style={styles.stepEmoji}>✉️</Text>
                <Text style={[styles.stepTitle, { color: colors.text }]}>Create Account</Text>
                <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                    Enter your credentials to get started
                </Text>
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: errors.email ? colors.error : colors.border }]}>
                    <Ionicons name="mail-outline" size={20} color={colors.textTertiary} />
                    <CampusLoopInput
                        placeholder="your.email@university.edu"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        containerStyle={styles.inputInner}
                    />
                </View>
                {errors.email && <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: errors.password ? colors.error : colors.border }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />
                    <CampusLoopInput
                        placeholder="Create a password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoComplete="off"
                        autoCorrect={false}
                        containerStyle={styles.inputInner}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                </View>
                {errors.password && <Text style={[styles.errorText, { color: colors.error }]}>{errors.password}</Text>}
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Confirm Password</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: errors.confirmPassword ? colors.error : colors.border }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />
                    <CampusLoopInput
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                        autoComplete="off"
                        autoCorrect={false}
                        containerStyle={styles.inputInner}
                    />
                </View>
                {errors.confirmPassword && <Text style={[styles.errorText, { color: colors.error }]}>{errors.confirmPassword}</Text>}
            </View>
        </Animated.View>
    );

    const renderStep2 = () => (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <View style={styles.stepHeader}>
                <Text style={styles.stepEmoji}>👤</Text>
                <Text style={[styles.stepTitle, { color: colors.text }]}>Personal Info</Text>
                <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                    Tell us a bit about yourself
                </Text>
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: errors.fullName ? colors.error : colors.border }]}>
                    <Ionicons name="person-outline" size={20} color={colors.textTertiary} />
                    <CampusLoopInput
                        placeholder="Your full name"
                        value={fullName}
                        onChangeText={setFullName}
                        containerStyle={styles.inputInner}
                    />
                </View>
                {errors.fullName && <Text style={[styles.errorText, { color: colors.error }]}>{errors.fullName}</Text>}
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>University</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                    {CampusLoopUniversities.slice(0, 8).map(uni => (
                        <SelectionChip key={uni} label={uni} selected={university === uni} onPress={() => setUniversity(uni)} />
                    ))}
                </ScrollView>
                {errors.university && <Text style={[styles.errorText, { color: colors.error }]}>{errors.university}</Text>}
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Campus <Text style={{ color: colors.textTertiary }}>(optional)</Text></Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                    {campusOptions.map(c => (
                        <SelectionChip key={c} label={c} selected={campus === c} onPress={() => setCampus(c)} />
                    ))}
                </ScrollView>
            </View>
        </Animated.View>
    );

    const renderStep3 = () => (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <View style={styles.stepHeader}>
                <Text style={styles.stepEmoji}>🎓</Text>
                <Text style={[styles.stepTitle, { color: colors.text }]}>Academic Info</Text>
                <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                    Your program details
                </Text>
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Program</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                    {CampusLoopCourses.slice(0, 12).map(c => (
                        <SelectionChip key={c} label={c} selected={course === c} onPress={() => setCourse(c)} />
                    ))}
                </ScrollView>
                {errors.course && <Text style={[styles.errorText, { color: colors.error }]}>{errors.course}</Text>}
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Semester</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                    {CampusLoopSemesters.map(sem => (
                        <SelectionChip key={sem} label={sem} selected={semester === sem} onPress={() => setSemester(sem)} />
                    ))}
                </ScrollView>
                {errors.semester && <Text style={[styles.errorText, { color: colors.error }]}>{errors.semester}</Text>}
            </View>
        </Animated.View>
    );

    const renderStep4 = () => (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.stepContent}>
            <View style={styles.stepHeader}>
                <Text style={styles.stepEmoji}>💡</Text>
                <Text style={[styles.stepTitle, { color: colors.text }]}>Your Interests</Text>
                <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                    Select up to 6 interests to personalize your feed
                </Text>
            </View>

            <View style={styles.interestsGrid}>
                {CampusLoopInterests.map(interest => (
                    <TouchableOpacity
                        key={interest}
                        style={[
                            styles.interestChip,
                            {
                                backgroundColor: selectedInterests.includes(interest) ? colors.primary + '15' : colors.surface,
                                borderColor: selectedInterests.includes(interest) ? colors.primary : colors.border,
                            }
                        ]}
                        onPress={() => toggleInterest(interest)}
                    >
                        <Text style={[
                            styles.interestText,
                            { color: selectedInterests.includes(interest) ? colors.primary : colors.text }
                        ]}>
                            {interest}
                        </Text>
                        {selectedInterests.includes(interest) && (
                            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={[styles.selectedCount, { color: colors.textSecondary }]}>
                {selectedInterests.length}/6 selected
            </Text>
        </Animated.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="dark-content" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>

                    {/* Progress */}
                    {renderProgressBar()}

                    {/* Form Card */}
                    <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                        {step === 4 && renderStep4()}

                        {/* Navigation Buttons */}
                        <View style={styles.buttonRow}>
                            {step < totalSteps ? (
                                <TouchableOpacity
                                    style={styles.primaryButton}
                                    onPress={handleNext}
                                >
                                    <LinearGradient
                                        colors={[colors.gradientStart, colors.gradientEnd]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.buttonGradient}
                                    >
                                        <Text style={styles.buttonText}>Continue</Text>
                                        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                                    </LinearGradient>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.primaryButton, { opacity: loading ? 0.7 : 1 }]}
                                    onPress={handleSignup}
                                    disabled={loading}
                                >
                                    <LinearGradient
                                        colors={[colors.gradientStart, colors.gradientEnd]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.buttonGradient}
                                    >
                                        <Text style={styles.buttonText}>
                                            {loading ? 'Creating Account...' : 'Complete Signup'}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Login Link */}
                    <View style={styles.loginRow}>
                        <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={[styles.loginLink, { color: colors.primary }]}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: CampusLoopSpacing.xl,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: CampusLoopSpacing['2xl'],
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: CampusLoopSpacing.lg,
    },
    progressContainer: {
        marginBottom: CampusLoopSpacing.lg,
    },
    progressTrack: {
        height: 6,
        borderRadius: 3,
        marginBottom: CampusLoopSpacing.sm,
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: CampusLoopTypography.fontSize.sm,
        textAlign: 'right',
    },
    formCard: {
        borderRadius: CampusLoopBorderRadius['2xl'],
        padding: CampusLoopSpacing.xl,
        ...CampusLoopShadows.lg,
    },
    stepContent: {},
    stepHeader: {
        alignItems: 'center',
        marginBottom: CampusLoopSpacing.xl,
    },
    stepEmoji: {
        fontSize: 48,
        marginBottom: CampusLoopSpacing.md,
    },
    stepTitle: {
        fontSize: CampusLoopTypography.fontSize['2xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        marginBottom: CampusLoopSpacing.xs,
    },
    stepSubtitle: {
        fontSize: CampusLoopTypography.fontSize.base,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: CampusLoopSpacing.lg,
    },
    inputLabel: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
        marginBottom: CampusLoopSpacing.sm,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: CampusLoopBorderRadius.lg,
        borderWidth: 1.5,
        paddingHorizontal: CampusLoopSpacing.base,
        gap: CampusLoopSpacing.sm,
    },
    inputInner: {
        flex: 1,
        marginBottom: 0,
        borderWidth: 0,
        backgroundColor: 'transparent',
    },
    errorText: {
        fontSize: CampusLoopTypography.fontSize.xs,
        marginTop: 4,
    },
    chipScroll: {
        marginTop: CampusLoopSpacing.sm,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: CampusLoopSpacing.md,
        paddingVertical: CampusLoopSpacing.sm,
        borderRadius: CampusLoopBorderRadius.full,
        borderWidth: 1.5,
        marginRight: CampusLoopSpacing.sm,
    },
    chipText: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    interestsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: CampusLoopSpacing.sm,
    },
    interestChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: CampusLoopSpacing.md,
        paddingVertical: CampusLoopSpacing.sm,
        borderRadius: CampusLoopBorderRadius.full,
        borderWidth: 1.5,
        gap: CampusLoopSpacing.xs,
    },
    interestText: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
    },
    selectedCount: {
        fontSize: CampusLoopTypography.fontSize.sm,
        textAlign: 'center',
        marginTop: CampusLoopSpacing.lg,
    },
    buttonRow: {
        marginTop: CampusLoopSpacing.xl,
    },
    primaryButton: {
        borderRadius: CampusLoopBorderRadius.lg,
        overflow: 'hidden',
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: CampusLoopSpacing.base + 2,
        gap: CampusLoopSpacing.sm,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: CampusLoopTypography.fontSize.lg,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: CampusLoopSpacing.xl,
    },
    loginText: {
        fontSize: CampusLoopTypography.fontSize.base,
    },
    loginLink: {
        fontSize: CampusLoopTypography.fontSize.base,
        fontWeight: CampusLoopTypography.fontWeight.semibold,
    },
});

export default SignupScreen;

