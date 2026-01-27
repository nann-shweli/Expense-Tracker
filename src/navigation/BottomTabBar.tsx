import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Dashboard from '../screens/Home/Dashboard';
import Setting from '../screens/Home/Setting';
import Expenses from '../screens/Home/Expense';
import { useTheme } from '../hooks/useTheme';

const Tab = createBottomTabNavigator();

const AddButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.addButton}
    >
      <Icon name="add" size={30} color="#fff" />
    </TouchableOpacity>
  );
};

const BottomTabBar = () => {
  const { themeColors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.container.backgroundColor,
        },
        headerTintColor: themeColors.text.primary,
        headerShadowVisible: false,
        tabBarShowLabel: true,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: themeColors.container.backgroundColor
          },
        ],
        tabBarItemStyle: styles.item,
        tabBarActiveTintColor: '#3DA9FC',
        tabBarInactiveTintColor: '#323232',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <Icon name="home-outline" size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Expenses"
        component={Expenses}
        options={{
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <Icon name="receipt-outline" size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Add"
        component={View}
        options={{
          tabBarLabel: '',
          tabBarButton: () => (
            <AddButton onPress={() => console.log('Open Add Modal')} />
          ),
        }}
      />

      <Tab.Screen
        name="Subscriptions"
        component={Setting}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="card-outline" size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <Icon name="settings-outline" size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabBar;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Platform.OS === 'ios' ? 12 : 8,
    height: 72,
    borderRadius: 100,
    backgroundColor: '#0B1A2A',
    borderTopWidth: 0,
    elevation: 10,
    marginHorizontal: 12,
    marginBottom: 20,
  },
  item: {
    paddingTop: 8,
    alignItems: 'center',
  },
  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3DA9FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -28,
    elevation: 12,
  },
});
