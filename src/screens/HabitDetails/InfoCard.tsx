// screens/HabitDetails/InfoCard.tsx
import {LucideIcon} from 'lucide-react-native';
import React from 'react';
import {DimensionValue, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {TextX} from '~/components/common';
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';

interface InfoCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  iconColor: string;
  width?: string | number;
  theme: 'dark' | 'light';
}

const InfoCard: React.FC<InfoCardProps> = React.memo(
  ({icon: Icon, value, label, iconColor, width = '48%', theme}) => {
    const surfaceColor = getThemeColor(theme, 'background', 'surface');
    const borderColor = getThemeColor(theme, 'border', 'subtle');

    // Animation values for hover effect
    const scale = useSharedValue(1);
    const brightness = useSharedValue(0);

    // Pre-compute the color values to avoid using withAlpha in the worklet
    const baseColor = surfaceColor;
    const hoverColor = withAlpha(surfaceColor, 1.05);
    const pressedColor = withAlpha(surfaceColor, 0.95);

    // Animated style for subtle hover effect
    const animatedStyle = useAnimatedStyle(() => {
      // Interpolate between the pre-computed colors
      const backgroundColor =
        brightness.value <= 0
          ? brightness.value === 0
            ? baseColor
            : pressedColor
          : hoverColor;

      return {
        transform: [{scale: scale.value}],
        backgroundColor: withTiming(backgroundColor, {duration: 200}),
      };
    });

    // Handle press in/out for subtle animation
    const handlePressIn = () => {
      scale.value = withSpring(0.98, {damping: 15});
      brightness.value = withTiming(-1, {duration: 150});
    };

    const handlePressOut = () => {
      scale.value = withSpring(1);
      brightness.value = withTiming(0, {duration: 250});
    };

    return (
      <Animated.View
        style={[
          {
            backgroundColor: surfaceColor,
            borderRadius: 16,
            padding: styleUtils.spacing.md,
            width: width as DimensionValue,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: borderColor,
          },
          styles.cardShadow,
          animatedStyle,
        ]}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
        onTouchCancel={handlePressOut}>
        <Icon size={18} color={iconColor} strokeWidth={1.5} />
        <TextX
          fontSize="2xl"
          fontWeight="bold"
          color="primary"
          marginTop={styleUtils.spacing.xs}>
          {value}
        </TextX>
        <TextX fontSize="xs" color="secondary">
          {label}
        </TextX>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
  },
});

export default InfoCard;
