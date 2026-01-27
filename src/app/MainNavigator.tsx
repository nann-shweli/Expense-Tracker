import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabBar from '../navigation/BottomTabBar';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabBar} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
