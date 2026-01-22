import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';

const Dashboard = () => {
  const handleLogout = async () => {
    await auth().signOut();
  };

  return (
    <View>
      <Text>Dashboard Screen</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;
