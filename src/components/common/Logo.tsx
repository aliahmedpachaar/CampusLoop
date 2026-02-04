/**
 * CampusLoop Logo Component
 * Displays the app logo image
 */

import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';

interface LogoProps {
    size?: number;
    style?: ViewStyle;
}

export const CampusLoopLogo: React.FC<LogoProps> = ({ size = 80, style }) => {
    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            <Image
                source={require('../../assets/images/logo.png')}
                style={{ width: size, height: size }}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default CampusLoopLogo;
