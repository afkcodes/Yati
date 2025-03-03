import {SquircleButton} from 'expo-squircle-view';
import React, {useMemo} from 'react';
import {
  type StyleProp,
  StyleSheet,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor} from '~/styles/theme';

// Reuse the same background variant type for consistency
type BackgroundVariant =
  | 'base'
  | 'surface'
  | 'elevated'
  | 'field'
  | 'highlight'
  | 'accent'
  | 'transparent'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

interface TouchableXProps extends TouchableOpacityProps, ViewStyle {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: BackgroundVariant;
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
  variant,
  ...rest
}) => {
  const {theme} = useTheme();
  const styleProps = JSON.stringify(rest);

  // If variant is provided, get the background color from theme
  const styleWithBg = useMemo(() => {
    const parsedProps = JSON.parse(styleProps);

    // If variant is provided and backgroundColor is not explicitly set
    if (variant && !parsedProps.backgroundColor) {
      return {
        ...parsedProps,
        backgroundColor:
          variant === 'transparent'
            ? 'transparent'
            : getThemeColor(theme, 'background', variant),
      };
    }
    return parsedProps;
  }, [styleProps, theme, variant]);

  const styles = useMemo(() => {
    return StyleSheet.create({
      touchable: styleWithBg,
    });
  }, [styleWithBg]);

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

export default React.memo(TouchableX);
