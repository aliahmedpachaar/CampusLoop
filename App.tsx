/**
 * CampusLoop Main App Entry Point
 * Root component with providers
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { CampusLoopAuthProvider } from './src/context/AuthContext';
import { CampusLoopThemeProvider } from './src/context/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';

const App = () => {
    return (
        <CampusLoopThemeProvider>
            <CampusLoopAuthProvider>
                <StatusBar barStyle="light-content" />
                <AppNavigator />
            </CampusLoopAuthProvider>
        </CampusLoopThemeProvider>
    );
};

export default App;
