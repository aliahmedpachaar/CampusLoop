/**
 * Enhanced Theme Configuration
 * Extended color palette, animations, and design tokens
 */

export const CampusLoopColors = {
    light: {
        // Primary Brand Colors
        primary: '#6366F1',
        primaryLight: '#818CF8',
        primaryDark: '#4F46E5',

        // Secondary Colors
        secondary: '#EC4899',
        secondaryLight: '#F472B6',
        secondaryDark: '#DB2777',

        // Accent Colors
        accent: '#8B5CF6',
        accentLight: '#A78BFA',

        // Background Colors
        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceElevated: '#FFFFFF',

        // Text Colors
        text: '#1E293B',
        textSecondary: '#64748B',
        textTertiary: '#94A3B8',
        textInverse: '#FFFFFF',

        // Semantic Colors
        success: '#10B981',
        successLight: '#34D399',
        warning: '#F59E0B',
        warningLight: '#FBBF24',
        error: '#EF4444',
        errorLight: '#F87171',
        info: '#3B82F6',
        infoLight: '#60A5FA',

        // UI Colors
        border: '#E2E8F0',
        borderLight: '#F1F5F9',
        divider: '#E2E8F0',
        overlay: 'rgba(0, 0, 0, 0.5)',

        // Gradient Colors
        gradientStart: '#6366F1',
        gradientEnd: '#EC4899',
        gradientAccent: '#8B5CF6',

        // Category Colors
        categoryAssignment: '#F59E0B',
        categoryCoding: '#8B5CF6',
        categoryActivities: '#EC4899',
        categorySports: '#10B981',
        categoryEvents: '#3B82F6',
        categoryDiscussion: '#6366F1',
        categoryMovies: '#EF4444',
        categoryTrips: '#14B8A6',
        categoryExams: '#F97316',
    },
    dark: {
        // Primary Brand Colors
        primary: '#818CF8',
        primaryLight: '#A5B4FC',
        primaryDark: '#6366F1',

        // Secondary Colors
        secondary: '#F472B6',
        secondaryLight: '#F9A8D4',
        secondaryDark: '#EC4899',

        // Accent Colors
        accent: '#A78BFA',
        accentLight: '#C4B5FD',

        // Background Colors
        background: '#0F172A',
        surface: '#1E293B',
        surfaceElevated: '#334155',

        // Text Colors
        text: '#F1F5F9',
        textSecondary: '#CBD5E1',
        textTertiary: '#94A3B8',
        textInverse: '#0F172A',

        // Semantic Colors
        success: '#34D399',
        successLight: '#6EE7B7',
        warning: '#FBBF24',
        warningLight: '#FCD34D',
        error: '#F87171',
        errorLight: '#FCA5A5',
        info: '#60A5FA',
        infoLight: '#93C5FD',

        // UI Colors
        border: '#334155',
        borderLight: '#475569',
        divider: '#334155',
        overlay: 'rgba(0, 0, 0, 0.7)',

        // Gradient Colors
        gradientStart: '#6366F1',
        gradientEnd: '#EC4899',
        gradientAccent: '#8B5CF6',

        // Category Colors
        categoryAssignment: '#FBBF24',
        categoryCoding: '#A78BFA',
        categoryActivities: '#F472B6',
        categorySports: '#34D399',
        categoryEvents: '#60A5FA',
        categoryDiscussion: '#818CF8',
        categoryMovies: '#F87171',
        categoryTrips: '#2DD4BF',
        categoryExams: '#FB923C',
    },
};

export const CampusLoopSpacing = {
    xs: 4,
    sm: 8,
    base: 16,
    md: 12,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
    '4xl': 64,
};

export const CampusLoopTypography = {
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
    },
    fontWeight: {
        regular: '400' as const,
        normal: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
        extrabold: '800' as const,
    },
    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },
};

export const CampusLoopBorderRadius = {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
};

export const CampusLoopShadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    base: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 12,
    },
};

export const CampusLoopAnimations = {
    timing: {
        fast: 150,
        normal: 250,
        slow: 350,
        verySlow: 500,
    },
    easing: {
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
        spring: 'spring',
    },
};

export const CampusLoopGradients = {
    primary: ['#6366F1', '#EC4899'],
    secondary: ['#8B5CF6', '#EC4899'],
    success: ['#10B981', '#34D399'],
    sunset: ['#F59E0B', '#EF4444'],
    ocean: ['#3B82F6', '#8B5CF6'],
    forest: ['#10B981', '#14B8A6'],
};

// Helper function to get theme colors based on dark mode
export const getThemeColors = (isDark: boolean) => {
    return isDark ? CampusLoopColors.dark : CampusLoopColors.light;
};

