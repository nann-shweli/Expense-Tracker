import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';

import Card from '../../atoms/Card';
import Typography from '../../atoms/Typography';
import { useTheme } from '../../../hooks/useTheme';

type InfoItem = {
  icon: string;
  title: string;
  subtitle?: string;
};

const INFO_LIST: InfoItem[] = [
  {
    icon: 'information-circle-outline',
    title: 'About Expense Tracker',
    subtitle: 'Version 1.0',
  },
  {
    icon: 'help-circle-outline',
    title: 'Help & Feedback',
  },
  {
    icon: 'document-text-outline',
    title: 'Legal',
  },
];

const Info = () => {
  const { themeColors } = useTheme();

  const handleLogout = async () => {
    await auth().signOut();
  };

  return (
    <View style={styles.wrapper}>
      <Card style={styles.card}>
        {INFO_LIST.map((item, index) => (
          <View key={item.title}>
            <InfoRow
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              color={themeColors.text.primary}
            />

            {index < INFO_LIST.length - 1 && (
              <View
                style={[
                  styles.divider,
                  { backgroundColor: themeColors.text.primary },
                ]}
              />
            )}
          </View>
        ))}
      </Card>
      <Card onPress={handleLogout} style={styles.logoutCard}>
        <Icon name="log-out-outline" size={28} color="red" />
        <Typography color="red">Logout</Typography>
      </Card>
    </View>
  );
};

type InfoRowProps = {
  icon: string;
  title: string;
  subtitle?: string;
  color: string;
};

const InfoRow = ({ icon, title, subtitle, color }: InfoRowProps) => {
  return (
    <View style={styles.row}>
      <Icon name={icon} size={28} color={color} />
      <View style={styles.textContainer}>
        <Typography>{title}</Typography>
        {subtitle && <Typography>{subtitle}</Typography>}
      </View>
    </View>
  );
};

export default Info;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 24,
    marginBottom: 100,
  },
  card: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    marginBottom: 12,
  },
  textContainer: {
    gap: 12,
  },
  divider: {
    height: 0.8,
    marginVertical: 12,
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    paddingVertical: 36,
    marginTop: 24,
  },
});
