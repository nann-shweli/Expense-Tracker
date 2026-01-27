import React, { ReactNode } from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type TextColorKey = 'primary' | 'secondary';

export type TypographyProps = TextProps & {
  size?: number | string;
  color?: TextColorKey | string;
  uppercase?: boolean;
  style?: StyleProp<TextStyle>;
  children?: ReactNode;
};

const Typography = ({
  size = 15,
  color = 'primary',
  style,
  children,
  ...props
}: TypographyProps) => {
  const { themeColors } = useTheme();

  const fontSize = typeof size === 'string' ? Number(size) : size;

  const textColor =
    (themeColors?.text as keyof TypographyProps['color'])[color] || color;

  return (
    <Text
      allowFontScaling={false}
      style={[{ fontSize, color: textColor }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default Typography;
