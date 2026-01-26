/**
 * CampusLoop Theme Context
 * Global theme state management (light/dark mode)
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { CampusLoopStorage } from '../utils/storage';
import { getThemeColors } from '../constants/theme';

interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
    colors: ReturnType<typeof getThemeColors>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const CampusLoopThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

    // Load saved theme preference
    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        const savedTheme = await CampusLoopStorage.getThemeMode();
        setIsDark(savedTheme);
    };

    const toggleTheme = async () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        await CampusLoopStorage.saveThemeMode(newTheme);
    };

    const colors = getThemeColors(isDark);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useCampusLoopTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useCampusLoopTheme must be used within CampusLoopThemeProvider');
    }
    return context;
};
