import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../../atoms/Card';
import { useTheme } from '../../../hooks/useTheme';
import SwitchCom from '../../atoms/Switch';

const ThemeCard = () => {
  const { themeColors, currentTheme, setTheme } = useTheme();
  const isDarkMode = currentTheme === 'dark';

  const handleToggleTheme = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  return (
    <Card style={styles.container}>
      <View style={styles.text}>
        <Text style={{ color: themeColors.text.primary }}>Appearance</Text>
        <Text style={{ color: themeColors.text.secondary }}>
          Light / Dark mode
        </Text>
      </View>

      <SwitchCom value={isDarkMode} onValueChange={handleToggleTheme} />
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
  text: {
    gap: 8,
  },
});
