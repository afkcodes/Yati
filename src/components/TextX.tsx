import React, {useMemo} from 'react';
import {type StyleProp, StyleSheet, Text, type TextStyle} from 'react-native';

interface TextXProps extends TextStyle {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

const TextX: React.FC<TextXProps> = ({children, style, ...rest}) => {
  const styleProps = JSON.stringify(rest);

  const styles = useMemo(() => {
    return StyleSheet.create({
      text: {
        ...JSON.parse(styleProps),
      },
    });
  }, [styleProps]);

  return <Text style={[styles.text, style]}>{children}</Text>;
};

TextX.displayName = 'TextX';

export default React.memo(TextX);
