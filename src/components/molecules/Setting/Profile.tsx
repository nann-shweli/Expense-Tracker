import React from 'react';
import { useNavigation as useRNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';

import Card from '../../atoms/Card';
import { useTheme } from '../../../hooks/useTheme';

const Profile = () => {
  const { themeColors } = useTheme();
  const [user, setUser] = React.useState(auth().currentUser);
  const { navigate } = useRNavigation<any>();

  useFocusEffect(
    React.useCallback(() => {
      setUser(auth().currentUser);
    }, [])
  );

  const handleEdit = () => {
    navigate('EditUser');
  };

  return (
    <Card style={styles.container}>
      <View style={styles.icon}>
        <Icon name="person" size={24} color={'#FFFFFF'} />
      </View>

      <View style={styles.name}>
        <Text style={{ color: themeColors.text.primary }}>{user?.displayName || user?.email}</Text>
        <Text style={{ color: themeColors.text.secondary }}>
          Edit Profile & personal details
        </Text>
      </View>

      <TouchableOpacity onPress={handleEdit}>
        <Icon name="pencil" size={22} color={themeColors.text.primary} />
      </TouchableOpacity>
    </Card>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    paddingVertical: 36,
    marginTop: 24,
  },
  icon: {
    borderRadius: 100,
    padding: 12,
    backgroundColor: '#6C8792',
  },
  name: { gap: 12, flex: 1 },
});
