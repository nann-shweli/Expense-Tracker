import { ReactNode } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type CardProps = TouchableOpacityProps & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
};

const Card = ({
  children,
  onPress,
  backgroundColor,
  style,
  ...props
}: CardProps) => {
  const { themeColors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: backgroundColor || themeColors.card.fill1 },
        style,
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
  },
});
