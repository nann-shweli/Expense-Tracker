import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabBar from '../navigation/BottomTabBar';
import EditUser from '../screens/Home/Settings/EditUser';
import NavBarHeader from '../components/molecules/Header/NavBarHeader';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: props => <NavBarHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={BottomTabBar}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditUser"
        component={EditUser}
        options={{
          title: 'Edit Profile',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
