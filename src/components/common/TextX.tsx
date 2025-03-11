import React, {useMemo} from 'react';
import {StyleProp, StyleSheet, Text, TextProps, TextStyle} from 'react-native';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, themes} from '~/styles/theme';
import type {FontSize, FontWeight} from '~/types/common.types';

// Define specific text color variants to avoid type errors
export type TextColorVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'accent'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

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

  // Get the appropriate text color from theme
  const textColor = getThemeColor(theme, 'text', color);
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
