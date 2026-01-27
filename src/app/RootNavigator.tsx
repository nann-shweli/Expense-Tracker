import React from 'react';
import {
  DefaultTheme,
  DarkTheme,
  NavigationContainer,
} from '@react-navigation/native';

import AppNavigator from './AppNavigator';

import { useTheme } from '../hooks/useTheme';

const RootNavigator = () => {
  const { currentTheme } = useTheme();
  const theme = currentTheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default RootNavigator;
