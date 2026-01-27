import React from 'react';
import auth from '@react-native-firebase/auth';

import FormContainer from '../../components/atoms/FormContainer';
import { useTheme } from '../../hooks/useTheme';
import Profile from '../../components/molecules/Setting/Profile';
import ThemeCard from '../../components/molecules/Setting/ThemeCard';

const Setting = () => {
  const user = auth().currentUser;

  const { currentTheme, setTheme } = useTheme();

  const isDarkMode = currentTheme === 'dark';

  const handleToggleTheme = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  return (
    <FormContainer>
      <Profile user={user} />
      <ThemeCard value={isDarkMode} onValueChange={handleToggleTheme} />
      
    </FormContainer>
  );
};

export default Setting;
