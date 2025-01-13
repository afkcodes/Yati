import React, {useMemo} from 'react';
import {type StyleProp, StyleSheet, Text, type TextStyle} from 'react-native';
import {useTheme} from '~hooks/ThemeContext';
import {themes} from '~styles/theme';
import type {FontSize, FontWeight} from '~types/common.types';

interface TextXProps
  extends Omit<TextStyle, 'fontSize' | 'fontWeight' | 'color'> {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent';
  fontSize?: FontSize;
  fontWeight?: FontWeight;
}

const TextX: React.FC<TextXProps> = ({
  children,
  style,
  color = 'primary',
  fontSize = 'md',
  fontWeight = 'regular',
  ...rest
}) => {
  const styleProps = JSON.stringify(rest);
  const {theme} = useTheme();
  const textColor = themes[theme].text[color];
  const textSize = themes[theme].typography.fontSizes[fontSize];
  const fontFamilyWeight = themes[theme].typography.fontFamily[fontWeight];

  const styles = useMemo(() => {
    return StyleSheet.create({
      text: {
        ...JSON.parse(styleProps),
        color: textColor,
        fontSize: textSize,
        fontFamily: fontFamilyWeight,
      },
    });
  }, [styleProps, textColor, textSize, fontFamilyWeight]);

  return <Text style={[styles.text, style]}>{children}</Text>;
};

TextX.displayName = 'TextX';

export default React.memo(TextX);
