import React from 'react';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { useAuth } from '../hooks/useAuth';

const AppNavigator = () => {
  const { user } = useAuth();
  return user ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;
