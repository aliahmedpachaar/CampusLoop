/**
 * CampusLoop Theme Configuration
 * Clean, Modern, Minimal Design System
 * Primary: Teal/Mint | Accent: Warm Coral | Neutrals: Slate
 */

export const CampusLoopColors = {
    light: {
        // Primary Brand Colors - Clean Teal
        primary: '#0D9488',
        primaryLight: '#14B8A6',
        primaryDark: '#0F766E',

        // Secondary Colors - Warm Coral
        secondary: '#F97316',
        secondaryLight: '#FB923C',
        secondaryDark: '#EA580C',

        // Accent Colors - Soft Blue
        accent: '#0EA5E9',
        accentLight: '#38BDF8',

        // Background Colors
        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceElevated: '#FFFFFF',

        // Text Colors
        text: '#0F172A',
        textSecondary: '#475569',
        textTertiary: '#94A3B8',
        textInverse: '#FFFFFF',

        // Semantic Colors
        success: '#10B981',
        successLight: '#34D399',
        warning: '#F59E0B',
        warningLight: '#FBBF24',
        error: '#EF4444',
        errorLight: '#F87171',
        info: '#0EA5E9',
        infoLight: '#38BDF8',

        // UI Colors
        border: '#E2E8F0',
        borderLight: '#F1F5F9',
        divider: '#E2E8F0',
        overlay: 'rgba(15, 23, 42, 0.5)',

        // Gradient Colors
        gradientStart: '#0D9488',
        gradientEnd: '#0EA5E9',
        gradientAccent: '#14B8A6',

        // Category Colors - Harmonious Palette
        categoryStudy: '#0D9488',
        categoryHelp: '#F59E0B',
        categorySports: '#10B981',
        categoryMovies: '#EF4444',
        categoryTrips: '#0EA5E9',
        categoryEvents: '#8B5CF6',
        categoryFood: '#F97316',
        categoryOther: '#64748B',

        // Mascot Colors
        mascotBody: '#FEFEFE',
        mascotDark: '#1E293B',
        mascotCheeks: '#FECACA',
    },
    dark: {
        // Primary Brand Colors
        primary: '#14B8A6',
        primaryLight: '#2DD4BF',
        primaryDark: '#0D9488',

        // Secondary Colors
        secondary: '#FB923C',
        secondaryLight: '#FDBA74',
        secondaryDark: '#F97316',

        // Accent Colors
        accent: '#38BDF8',
        accentLight: '#7DD3FC',

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
        info: '#38BDF8',
        infoLight: '#7DD3FC',

        // UI Colors
        border: '#334155',
        borderLight: '#475569',
        divider: '#334155',
        overlay: 'rgba(0, 0, 0, 0.7)',

        // Gradient Colors
        gradientStart: '#0D9488',
        gradientEnd: '#0EA5E9',
        gradientAccent: '#14B8A6',

        // Category Colors
        categoryStudy: '#14B8A6',
        categoryHelp: '#FBBF24',
        categorySports: '#34D399',
        categoryMovies: '#F87171',
        categoryTrips: '#38BDF8',
        categoryEvents: '#A78BFA',
        categoryFood: '#FB923C',
        categoryOther: '#94A3B8',

        // Mascot Colors
        mascotBody: '#F8FAFC',
        mascotDark: '#1E293B',
        mascotCheeks: '#FECACA',
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
    '3xl': 32,
    full: 9999,
};

export const CampusLoopShadows = {
    sm: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
    },
    base: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
    },
    xl: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.16,
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
    spring: {
        gentle: { damping: 15, stiffness: 100 },
        bouncy: { damping: 10, stiffness: 150 },
        snappy: { damping: 20, stiffness: 200 },
    },
};

export const CampusLoopGradients = {
    primary: ['#0D9488', '#0EA5E9'],
    secondary: ['#F97316', '#F59E0B'],
    success: ['#10B981', '#34D399'],
    cool: ['#0EA5E9', '#8B5CF6'],
    warm: ['#F97316', '#EF4444'],
    nature: ['#10B981', '#0D9488'],
    subtle: ['#F8FAFC', '#E2E8F0'],
};

// Activity Category Configuration
export const ActivityCategories = {
    study: { icon: '📚', label: 'Study', color: '#0D9488' },
    help: { icon: '🤝', label: 'Help', color: '#F59E0B' },
    sports: { icon: '⚽', label: 'Sports', color: '#10B981' },
    movies: { icon: '🎬', label: 'Movies', color: '#EF4444' },
    trips: { icon: '✈️', label: 'Trips', color: '#0EA5E9' },
    events: { icon: '🎉', label: 'Events', color: '#8B5CF6' },
    food: { icon: '🍕', label: 'Food', color: '#F97316' },
    other: { icon: '💡', label: 'Other', color: '#64748B' },
};

// Helper function to get theme colors based on dark mode
export const getThemeColors = (isDark: boolean) => {
    return isDark ? CampusLoopColors.dark : CampusLoopColors.light;
};
