import React, {useMemo} from 'react';
import {
  type LayoutChangeEvent,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

interface ViewXProps extends ViewStyle {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
  testID?: string;
  accessibilityLabel?: string;
}

const ViewX: React.FC<ViewXProps> = ({
  children,
  style,
  onLayout,
  testID,
  accessibilityLabel,
  ...rest
}) => {
  const styleProps = JSON.stringify(rest);

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        ...JSON.parse(styleProps),
      },
    });
  }, [styleProps]);

  return (
    <View
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
