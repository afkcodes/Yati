/* eslint-disable react-native/no-inline-styles */
// screens/HabitDetails/ProgressCircle.tsx
import React, {useEffect} from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Circle} from 'react-native-svg';
import {ViewX} from '~/components/common';
import {getThemeColor, withAlpha} from '~styles/theme';

// Create animated components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressCircleProps {
  progress: Animated.SharedValue<number>;
  size: number;
  strokeWidth: number;
  color: string;
  theme: 'dark' | 'light';
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size,
  strokeWidth,
  color,
  theme,
}) => {
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const halfCircle = size / 2;

  // Create animated props for the stroke dash offset
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - circumference * progress.value;

    return {
      strokeDashoffset,
    };
  });

  // Value to display inside circle
  const displayValue = useSharedValue(0);

  // Update display value when progress changes
  useEffect(() => {
    displayValue.value = withTiming(progress.value * 100, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [displayValue, progress.value]);

  // Animated style for the text
  const textProps = useAnimatedProps(() => {
    return {
      text: `${Math.round(displayValue.value)}%`,
    };
  });

  // Theme colors
  const bgColor = withAlpha(color, 0.2);
  const textColor = getThemeColor(theme, 'text', 'primary');

  return (
    <ViewX
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Svg width={size} height={size} style={{transform: [{rotate: '-90deg'}]}}>
        {/* Background Circle */}
        <Circle
          cx={halfCircle}
          cy={halfCircle}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress Circle */}
        <AnimatedCircle
          cx={halfCircle}
          cy={halfCircle}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          fill="transparent"
        />
      </Svg>

      {/* Percentage Text */}
      <ViewX
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Animated.Text
          style={{
            color: textColor,
            fontSize: size * 0.2,
            fontWeight: 'bold',
          }}
          // animatedProps={textProps}
        />
      </ViewX>
    </ViewX>
  );
};

export default ProgressCircle;
