import React, {useMemo} from 'react';
import {StyleProp, StyleSheet, Text, TextProps, TextStyle} from 'react-native';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, themes} from '~/styles/theme';
import type {FontSize, FontWeight} from '~/types/common.types';

// Define specific text color variants and allow custom colors
export type TextColorVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'accent'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | string; // Allow any string for custom colors

// Create a type that combines TextStyle with TextProps, but omits the specific props we handle
interface TextXProps
  extends Omit<TextStyle, 'fontSize' | 'fontWeight' | 'color'>,
    Omit<TextProps, 'style'> {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  color?: TextColorVariant;
  fontSize?: FontSize;
  fontWeight?: FontWeight;
}

const TextX: React.FC<TextXProps> = ({
  children,
  style,
  color = 'primary',
  fontSize = 'md',
  fontWeight = 'regular',
  numberOfLines,
  ellipsizeMode,
  selectable,
  allowFontScaling,
  maxFontSizeMultiplier,
  ...rest
}) => {
  const styleProps = JSON.stringify(rest);
  const {theme} = useTheme();

  // Determine if the color is a predefined variant or custom color
  const textColor = useMemo(() => {
    // Check if color is one of the predefined variants
    const predefinedVariants = [
      'primary',
      'secondary',
      'tertiary',
      'disabled',
      'accent',
      'success',
      'error',
      'warning',
      'info',
    ];

    return predefinedVariants.includes(color)
      ? getThemeColor(theme, 'text', color as Exclude<TextColorVariant, string>)
      : color; // Use the custom color directly
  }, [color, theme]);

  const textSize = themes[theme].typography.fontSizes[fontSize];
  const fontFamily = themes[theme].typography.fontFamily[fontWeight];
  const fontW = themes[theme].typography.fontWeight[fontWeight];

  const styles = useMemo(() => {
    return StyleSheet.create({
      text: {
        ...JSON.parse(styleProps),
        color: textColor,
        fontSize: textSize,
        fontFamily: fontFamily,
        fontWeight: fontW,
      },
    });
  }, [styleProps, textColor, textSize, fontFamily, fontW]);

  // Extract proper TextProps
  const textProps = {
    numberOfLines,
    ellipsizeMode,
    selectable,
    allowFontScaling,
    maxFontSizeMultiplier,
  };

  return (
    <Text style={[styles.text, style]} {...textProps}>
      {children}
    </Text>
  );
};

TextX.displayName = 'TextX';

export default React.memo(TextX);
