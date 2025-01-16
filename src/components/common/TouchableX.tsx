import {SquircleButton} from 'expo-squircle-view';
import React, {useMemo} from 'react';
import {
  type StyleProp,
  StyleSheet,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native';

interface TouchableXProps extends TouchableOpacityProps, ViewStyle {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const TouchableX: React.FC<TouchableXProps> = ({
  children,
  style,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  activeOpacity = 0.7,
  testID,
  accessibilityLabel,
  ...rest
}) => {
  const styleProps = JSON.stringify(rest);

  const styles = useMemo(() => {
    return StyleSheet.create({
      touchable: {
        ...JSON.parse(styleProps),
      },
    });
  }, [styleProps]);

  return (
    <SquircleButton
      style={[styles.touchable, style]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={activeOpacity}
      testID={testID}
      accessibilityLabel={accessibilityLabel}>
      {children}
    </SquircleButton>
  );
};

TouchableX.displayName = 'TouchableX';

// Memoize the component to prevent unnecessary re-renders
export default React.memo(TouchableX);
