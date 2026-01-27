import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

import Typography from '../../components/atoms/Typography';

const Dashboard = () => {
  const handleLogout = async () => {
    await auth().signOut();
  };

  return (
    <View style={styles.container}>
      <Typography>Dashboard Screen</Typography>
      <TouchableOpacity onPress={handleLogout}>
        <Typography>Logout</Typography>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
