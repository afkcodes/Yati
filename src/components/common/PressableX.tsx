/* eslint-disable react-native/no-inline-styles */
import {SquircleView} from 'expo-squircle-view';
import React, {useMemo} from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  StyleSheet,
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
  borderRadius = 10,
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
    <SquircleView
      style={[styles.pressable, styles.wrapper]}
      cornerSmoothing={100}
      preserveSmoothing>
      <Pressable
        style={[
          {
            flex: 1,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          },
          style,
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
    </SquircleView>
  );
};

PressableX.displayName = 'PressableX';

export default React.memo(PressableX);
