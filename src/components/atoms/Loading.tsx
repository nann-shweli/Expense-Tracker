import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

type LoadingProps = {
    size?: 'small' | 'large';
    color?: string;
    fullscreen?: boolean;
};

const Loading = ({
    size = 'small',
    color = '#ffffff',
    fullscreen = false,
}: LoadingProps) => {
    if (fullscreen) {
        return (
            <View style={styles.fullscreen}>
                <ActivityIndicator size="large" color={color} />
            </View>
        );
    }

    return <ActivityIndicator size={size} color={color} />;
};

export default Loading;

const styles = StyleSheet.create({
    fullscreen: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
});
