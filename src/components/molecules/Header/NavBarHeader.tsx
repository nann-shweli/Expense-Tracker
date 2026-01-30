import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import Typography from '../../atoms/Typography';
import { useTheme } from '../../../hooks/useTheme';

const NavBarHeader = ({ navigation, options, back }: any) => {
  const { themeColors } = useTheme();
  const title = options.title ?? '';

  return (
    <SafeAreaView
      edges={['top']}
      style={{ backgroundColor: themeColors.container.backgroundColor }}
    >
      <View style={styles.container}>
        {back ? (
          <TouchableOpacity onPress={navigation.goBack} style={styles.backBtn}>
            <Icon
              name="chevron-back"
              size={24}
              color={themeColors.text.primary}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.backPlaceholder} />
        )}

        <Typography style={styles.title}>{title}</Typography>
        <View style={styles.rightPlaceholder} />
      </View>
    </SafeAreaView>
  );
};

export default NavBarHeader;

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  backBtn: {
    padding: 8,
  },
  backPlaceholder: {
    width: 40,
  },
  rightPlaceholder: {
    width: 40,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  safeArea: {
    backgroundColor: '#fff',
  },
});
