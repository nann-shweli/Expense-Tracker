import React from 'react';

import FormContainer from '../../components/atoms/FormContainer';
import Profile from '../../components/molecules/Setting/Profile';
import ThemeCard from '../../components/molecules/Setting/ThemeCard';
import Info from '../../components/molecules/Setting/Info';

const Setting = () => {
  return (
    <FormContainer>
      <Profile />
      <ThemeCard />
      <Info />
    </FormContainer>
  );
};

export default Setting;
