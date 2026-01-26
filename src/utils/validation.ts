/**
 * CampusLoop Validation Utilities
 * Input validation functions for forms
 */

export const CampusLoopValidation = {
    /**
     * Validate email format
     */
    isValidEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate password strength
     * Minimum 8 characters, at least one letter and one number
     */
    isValidPassword: (password: string): boolean => {
        if (password.length < 8) return false;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        return hasLetter && hasNumber;
    },

    /**
     * Get password strength message
     */
    getPasswordStrengthMessage: (password: string): string => {
        if (password.length === 0) return '';
        if (password.length < 8) return 'Password must be at least 8 characters';
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        if (!hasLetter) return 'Password must contain at least one letter';
        if (!hasNumber) return 'Password must contain at least one number';
        return '';
    },

    /**
     * Check if email is from a university domain
     * Placeholder for future SSO integration
     */
    isUniversityEmail: (email: string): boolean => {
        const universityDomains = ['.edu', '.ac.uk', '.edu.au', '.edu.sg'];
        return universityDomains.some(domain => email.toLowerCase().endsWith(domain));
    },

    /**
     * Validate required field
     */
    isRequired: (value: string): boolean => {
        return value.trim().length > 0;
    },

    /**
     * Validate minimum length
     */
    minLength: (value: string, min: number): boolean => {
        return value.trim().length >= min;
    },

    /**
     * Validate maximum length
     */
    maxLength: (value: string, max: number): boolean => {
        return value.trim().length <= max;
    },
};
