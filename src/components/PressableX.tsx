import React, {useMemo} from 'react';
import {
  Platform,
  Pressable,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

interface PressableXProps extends PressableProps, ViewStyle {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  rippleColor?: string;
}

const PressableX: React.FC<PressableXProps> = ({
  children,
  style,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  testID,
  accessibilityLabel,
  rippleColor = 'rgba(0, 0, 0, 0.2)',
  borderRadius,
  ...rest
}) => {
  const styleProps = JSON.stringify(rest);

  const styles = useMemo(() => {
    return StyleSheet.create({
      pressable: {
        ...JSON.parse(styleProps),
      },
      wrapper: {
        borderRadius,
        overflow: 'hidden',
      },
    });
  }, [styleProps, borderRadius]);

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={({pressed}) => [
          styles.pressable,
          style,
          pressed && Platform.OS !== 'android' && {opacity: 0.7},
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        android_ripple={{
          color: rippleColor,
          borderless: false,
        }}>
        {children}
      </Pressable>
    </View>
  );
};

PressableX.displayName = 'PressableX';

export default React.memo(PressableX);
