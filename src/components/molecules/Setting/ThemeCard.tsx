import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../../atoms/Card';
import { useTheme } from '../../../hooks/useTheme';
import SwitchCom from '../../atoms/Switch';

const ThemeCard = ({ value, onValueChange }: any) => {
  const { themeColors } = useTheme();

  return (
    <Card style={styles.container}>
      <View>
        <Text style={{ color: themeColors.text.primary }}>Appearance</Text>
        <Text style={{ color: themeColors.text.secondary }}>
          Light / Dark mode
        </Text>
      </View>

      <SwitchCom value={value} onValueChange={onValueChange} />
    </Card>
  );
};

export default ThemeCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 32,
    marginTop: 24,
  },
});
