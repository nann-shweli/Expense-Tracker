import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';

const Expenses = () => {
  const handleLogout = async () => {
    await auth().signOut();
  };

  return (
    <View>
      <Text>Expense Screen</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Expenses;
