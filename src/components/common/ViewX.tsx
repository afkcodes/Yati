import React, {useMemo} from 'react';
import {
  type LayoutChangeEvent,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor} from '~/styles/theme';

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

interface ViewXProps extends ViewStyle {
  children?: React.ReactNode | undefined;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
  testID?: string;
  accessibilityLabel?: string;
  variant?: BackgroundVariant;
}

const ViewX: React.FC<ViewXProps> = ({
  children,
  style,
  onLayout,
  testID,
  accessibilityLabel,
  variant = 'transparent',
  ...rest
}) => {
  const styleProps = JSON.stringify(rest);
  const {theme} = useTheme();

  // Get the background color based on variant
  const bgColor =
    variant === 'transparent'
      ? 'transparent'
      : getThemeColor(theme, 'background', variant);

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        ...JSON.parse(styleProps),
        backgroundColor: rest.backgroundColor || bgColor,
      },
    });
  }, [styleProps, rest.backgroundColor, bgColor]);

  return (
    <View
      collapsable={false}
      style={[styles.container, style]}
      onLayout={onLayout}
      testID={testID}
      accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  );
};

ViewX.displayName = 'ViewX';

export default React.memo(ViewX);
