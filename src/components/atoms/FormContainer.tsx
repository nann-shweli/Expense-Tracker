import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTheme } from '../../hooks/useTheme';

type FormContainerProps = {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  full?: boolean;
};

const FormContainer = ({
  children,
  contentStyle,
  full = false,
}: FormContainerProps) => {
  const bottomOffset = 250;
  const { themeColors } = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: themeColors.container.backgroundColor }, 
      ]}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.contentContainer,
          full ? styles.fullPadding : styles.defaultPadding,
          contentStyle,
        ]}
        bottomOffset={bottomOffset}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  defaultPadding: {
    paddingHorizontal: 16,
  },
  fullPadding: {
    paddingHorizontal: 0,
  },
});

export default FormContainer;
