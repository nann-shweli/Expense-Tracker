import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Card from '../../atoms/Card';
import { useTheme } from '../../../hooks/useTheme';

const Profile = ({ user }: any) => {
  const { themeColors } = useTheme();

  return (
    <Card style={styles.container}>
      <View style={styles.icon}>
        <Icon name="person" size={24} color={'#FFFFFF'} />
      </View>

      <View style={styles.name}>
        <Text style={{ color: themeColors.text.primary }}>{user?.email}</Text>
        <Text style={{ color: themeColors.text.secondary }}>
          Edit Profile & personal details
        </Text>
      </View>

      <Icon name="pencil" size={22} color={themeColors.text.primary} />
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
