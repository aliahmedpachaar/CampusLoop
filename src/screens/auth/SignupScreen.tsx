/**
 * CampusLoop Signup Screen
 * Multi-step user registration
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
} from 'react-native';
import { useCampusLoopTheme } from '../../context/ThemeContext';
import { useCampusLoopAuth } from '../../context/AuthContext';
import { CampusLoopButton } from '../../components/common/Button';
import { CampusLoopInput } from '../../components/common/Input';
import { CampusLoopCategoryChip } from '../../components/common/CategoryChip';
import { CampusLoopValidation } from '../../utils/validation';
import { CampusLoopUniversities, CampusLoopCourses, CampusLoopSemesters, CampusLoopInterests } from '../../constants/universities';
import { CampusLoopSpacing, CampusLoopTypography } from '../../constants/theme';

interface SignupScreenProps {
    navigation: any;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
    const { colors } = useCampusLoopTheme();
    const { signup } = useCampusLoopAuth();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [university, setUniversity] = useState('');
    const [course, setCourse] = useState('');
    const [semester, setSemester] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const [errors, setErrors] = useState<any>({});

    const validateStep1 = (): boolean => {
        const newErrors: any = {};
        let isValid = true;

        if (!CampusLoopValidation.isValidEmail(email)) {
            newErrors.email = 'Invalid email format';
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
            newErrors.fullName = 'Full name is required';
            isValid = false;
        }

        if (!university) {
            newErrors.university = 'Please select a university';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateStep3 = (): boolean => {
        const newErrors: any = {};
        let isValid = true;

        if (!course) {
            newErrors.course = 'Please select a course';
            isValid = false;
        }

        if (!semester) {
            newErrors.semester = 'Please select a semester';
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
        }
    };

    const handleSignup = async () => {
        if (selectedInterests.length === 0) {
            Alert.alert('Select Interests', 'Please select at least one interest');
            return;
        }

        setLoading(true);
        try {
            await signup({
                email,
                password,
                fullName,
                university,
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
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const renderProgressBar = () => (
        <View style={styles.progressContainer}>
            {[1, 2, 3, 4].map(i => (
                <View
                    key={i}
                    style={[
                        styles.progressDot,
                        {
                            backgroundColor: i <= step ? colors.primary : colors.border,
                        },
                    ]}
                />
            ))}
        </View>
    );

    const renderStep1 = () => (
        <>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
                Create Account
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Step 1 of 4: Account Details
            </Text>

            <CampusLoopInput
                label="Email"
                placeholder="your.email@university.edu"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
            />

            <CampusLoopInput
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={errors.password}
            />

            <CampusLoopInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                error={errors.confirmPassword}
            />
        </>
    );

    const renderStep2 = () => (
        <>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
                Personal Info
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Step 2 of 4: Tell us about yourself
            </Text>

            <CampusLoopInput
                label="Full Name"
                placeholder="John Doe"
                value={fullName}
                onChangeText={setFullName}
                error={errors.fullName}
            />

            <Text style={[styles.label, { color: colors.text }]}>University</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {CampusLoopUniversities.slice(0, 10).map(uni => (
                    <CampusLoopCategoryChip
                        key={uni}
                        label={uni}
                        selected={university === uni}
                        onPress={() => setUniversity(uni)}
                    />
                ))}
            </ScrollView>
            {errors.university && <Text style={[styles.error, { color: colors.error }]}>{errors.university}</Text>}
        </>
    );

    const renderStep3 = () => (
        <>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
                Academic Info
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Step 3 of 4: Your studies
            </Text>

            <Text style={[styles.label, { color: colors.text }]}>Course/Program</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {CampusLoopCourses.slice(0, 15).map(c => (
                    <CampusLoopCategoryChip
                        key={c}
                        label={c}
                        selected={course === c}
                        onPress={() => setCourse(c)}
                    />
                ))}
            </ScrollView>
            {errors.course && <Text style={[styles.error, { color: colors.error }]}>{errors.course}</Text>}

            <Text style={[styles.label, { color: colors.text }]}>Semester/Year</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {CampusLoopSemesters.map(sem => (
                    <CampusLoopCategoryChip
                        key={sem}
                        label={sem}
                        selected={semester === sem}
                        onPress={() => setSemester(sem)}
                    />
                ))}
            </ScrollView>
            {errors.semester && <Text style={[styles.error, { color: colors.error }]}>{errors.semester}</Text>}
        </>
    );

    const renderStep4 = () => (
        <>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
                Your Interests
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Step 4 of 4: Select at least 3 interests
            </Text>

            <View style={styles.interestsContainer}>
                {CampusLoopInterests.map(interest => (
                    <CampusLoopCategoryChip
                        key={interest}
                        label={interest}
                        selected={selectedInterests.includes(interest)}
                        onPress={() => toggleInterest(interest)}
                        style={styles.interestChip}
                    />
                ))}
            </View>
        </>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled">
                {renderProgressBar()}

                <View style={styles.form}>
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}

                    <View style={styles.buttonContainer}>
                        {step > 1 && (
                            <CampusLoopButton
                                title="Back"
                                onPress={handleBack}
                                variant="outline"
                                style={styles.backButton}
                            />
                        )}

                        {step < 4 ? (
                            <CampusLoopButton
                                title="Next"
                                onPress={handleNext}
                                fullWidth={step === 1}
                                style={step > 1 && styles.nextButton}
                            />
                        ) : (
                            <CampusLoopButton
                                title="Complete Signup"
                                onPress={handleSignup}
                                loading={loading}
                                style={styles.nextButton}
                            />
                        )}
                    </View>

                    <View style={styles.loginContainer}>
                        <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                            Already have an account?{' '}
                        </Text>
                        <Text
                            style={[styles.loginLink, { color: colors.primary }]}
                            onPress={() => navigation.navigate('Login')}>
                            Login
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: CampusLoopSpacing['2xl'],
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: CampusLoopSpacing.xl,
    },
    progressDot: {
        width: 40,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 4,
    },
    form: {
        flex: 1,
    },
    stepTitle: {
        fontSize: CampusLoopTypography.fontSize['2xl'],
        fontWeight: CampusLoopTypography.fontWeight.bold,
        marginBottom: CampusLoopSpacing.sm,
    },
    stepSubtitle: {
        fontSize: CampusLoopTypography.fontSize.base,
        marginBottom: CampusLoopSpacing.xl,
    },
    label: {
        fontSize: CampusLoopTypography.fontSize.sm,
        fontWeight: CampusLoopTypography.fontWeight.medium,
        marginBottom: CampusLoopSpacing.sm,
        marginTop: CampusLoopSpacing.base,
    },
    chipScroll: {
        marginBottom: CampusLoopSpacing.base,
    },
    error: {
        fontSize: CampusLoopTypography.fontSize.sm,
        marginTop: -CampusLoopSpacing.sm,
        marginBottom: CampusLoopSpacing.sm,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: CampusLoopSpacing.xl,
    },
    interestChip: {
        marginBottom: CampusLoopSpacing.sm,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: CampusLoopSpacing.xl,
    },
    backButton: {
        flex: 1,
        marginRight: CampusLoopSpacing.sm,
    },
    nextButton: {
        flex: 1,
        marginLeft: CampusLoopSpacing.sm,
    },
    loginContainer: {
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
