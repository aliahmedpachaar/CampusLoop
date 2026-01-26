/**
 * CampusLoop Design System
 * Modern, vibrant theme with dark mode support
 */


export const CampusLoopColors = {
    // Light Mode
    light: {
        primary: '#6366F1', // Vibrant indigo
        primaryDark: '#4F46E5',
        primaryLight: '#818CF8',
        secondary: '#EC4899', // Pink accent
        secondaryDark: '#DB2777',
        secondaryLight: '#F472B6',

        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceElevated: '#FFFFFF',
        surfaceHighlight: '#EFF6FF',

        text: '#0F172A',
        textSecondary: '#64748B',
        textTertiary: '#94A3B8',

        border: '#E2E8F0',
        borderLight: '#F1F5F9',

        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        // Gradient colors
        gradientStart: '#6366F1',
        gradientEnd: '#EC4899',
    },

    // Dark Mode
    dark: {
        primary: '#818CF8',
        primaryDark: '#6366F1',
        primaryLight: '#A5B4FC',
        secondary: '#F472B6',
        secondaryDark: '#EC4899',
        secondaryLight: '#F9A8D4',

        background: '#0F172A',
        surface: '#1E293B',
        surfaceElevated: '#334155',
        surfaceHighlight: '#1E3A8A',

        text: '#F1F5F9',
        textSecondary: '#CBD5E1',
        textTertiary: '#94A3B8',

        border: '#334155',
        borderLight: '#475569',

        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
        info: '#60A5FA',

        // Gradient colors
        gradientStart: '#6366F1',
        gradientEnd: '#EC4899',
    },
};

export const CampusLoopTypography = {
    // Font families - using system fonts for cross-platform compatibility
    fontFamily: {
        regular: 'System',
        medium: 'System',
        semibold: 'System',
        bold: 'System',
    },

    // Font sizes
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
    },

    // Font weights
    fontWeight: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },

    // Line heights
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
};

export const CampusLoopSpacing = {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
};

export const CampusLoopBorderRadius = {
    sm: 8,
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
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 8,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        elevation: 12,
    },
};

export const CampusLoopAnimations = {
    duration: {
        fast: 150,
        normal: 250,
        slow: 350,
    },
    easing: {
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
    },
};

// Helper function to get current theme colors
export const getThemeColors = (isDark: boolean) => {
    return isDark ? CampusLoopColors.dark : CampusLoopColors.light;
};
