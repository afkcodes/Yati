import {CheckCircle2, Clock, Flame} from 'lucide-react-native';
import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {TextX, TouchableX, ViewX} from '~components/common';
import {useTheme} from '~hooks/ThemeContext';
import {styleUtils} from '~styles/theme';
import {getThemeColor, withAlpha} from '~styles/themeUtils';

interface HabitCardProps {
  title: string;
  frequency: string;
  period: 'morning' | 'evening' | 'night';
  color: string;
  isCompleted: boolean;
  streak?: number;
  onToggleComplete: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  title,
  frequency,
  period,
  color,
  isCompleted,
  streak = 0,
  onToggleComplete,
}) => {
  // Get current theme
  const {theme} = useTheme();

  // Animation values
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(isCompleted ? 1 : 0);
  const checkRotate = useSharedValue(isCompleted ? 1 : 0);
  const backgroundProgress = useSharedValue(isCompleted ? 100 : 0);
  const glowOpacity = useSharedValue(0);
  const streakBounce = useSharedValue(1);

  // Get theme colors
  const cardBackground = getThemeColor(theme, 'background', 'secondary');
  const checkContainerBg = isCompleted
    ? withAlpha(color, 0.1)
    : getThemeColor(theme, 'background', 'input');

  const handlePress = useCallback(() => {
    const newState = !isCompleted;

    // Card scale animation
    scale.value = withSequence(
      withTiming(0.98, {duration: 100}),
      withTiming(1, {duration: 150}),
    );

    if (newState) {
      checkScale.value = withSpring(1, {
        mass: 0.5,
        damping: 12,
        stiffness: 200,
      });

      // Rotate animation
      checkRotate.value = withTiming(1, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      // Background fill animation
      backgroundProgress.value = withTiming(100, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      // Glow effect
      glowOpacity.value = withSequence(
        withTiming(0.6, {duration: 200}),
        withDelay(200, withTiming(0, {duration: 300})),
      );

      // Streak bounce animation
      if (streak > 0) {
        streakBounce.value = withSequence(
          withTiming(1.2, {duration: 150}),
          withSpring(1, {
            mass: 1,
            damping: 10,
            stiffness: 100,
          }),
        );
      }
    } else {
      checkScale.value = withTiming(0, {duration: 200});
      checkRotate.value = withTiming(0, {duration: 200});
      backgroundProgress.value = withTiming(0, {duration: 300});
      streakBounce.value = 1;
    }

    runOnJS(onToggleComplete)();
  }, [
    backgroundProgress,
    checkRotate,
    checkScale,
    glowOpacity,
    isCompleted,
    onToggleComplete,
    scale,
    streak,
    streakBounce,
  ]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    width: `${backgroundProgress.value}%`,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: checkScale.value},
      {rotate: `${interpolate(checkRotate.value, [0, 1], [0, 360])}deg`},
    ],
    opacity: checkScale.value,
  }));

  return (
    <TouchableX
      onPress={handlePress}
      style={[
        styles.container,
        containerStyle,
        {backgroundColor: cardBackground},
      ]}
      borderRadius={styleUtils.borderRadius.lg}>
      <ViewX position="absolute" height="100%" width="100%">
        <Animated.View
          style={[
            styles.progressFill,
            {backgroundColor: withAlpha(color, 0.1)},
            backgroundStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.glowEffect,
            {backgroundColor: withAlpha(color, 0.3)},
            glowStyle,
          ]}
        />
      </ViewX>

      {/* Content */}
      <ViewX
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        padding={styleUtils.spacing.md}
        gap={styleUtils.spacing.sm}>
        <ViewX flex={1} gap={styleUtils.spacing.xs}>
          <ViewX
            flexDirection="row"
            alignItems="center"
            gap={styleUtils.spacing.xs}>
            <TextX fontSize="lg" fontWeight="semibold" color="primary">
              {title}
            </TextX>
            {/* <View style={[styles.periodBadge, {backgroundColor: color + '20'}]}>
              <TextX style={[styles.periodText, {color}]}>{period}</TextX>
            </View> */}
          </ViewX>

          <ViewX
            flexDirection="row"
            alignItems="center"
            gap={styleUtils.spacing.sm}>
            <ViewX
              flexDirection="row"
              alignItems="center"
              gap={styleUtils.spacing['2xs']}>
              <Clock
                size={14}
                color={getThemeColor(theme, 'text', 'secondary')}
                strokeWidth={2}
              />
              <TextX fontSize="sm" fontWeight="medium" color="secondary">
                {frequency}
              </TextX>
            </ViewX>
            {streak > 0 && (
              <ViewX
                flexDirection="row"
                alignItems="center"
                gap={styleUtils.spacing['3xs']}
                paddingLeft={styleUtils.spacing['3xs']}>
                <Flame size={14} color={color} fill={color} strokeWidth={2} />
                <TextX fontSize="xs" fontWeight="medium" style={{color}}>
                  {streak}D
                </TextX>
              </ViewX>
            )}
          </ViewX>
        </ViewX>

        <View
          style={[
            styles.checkContainer,
            {
              backgroundColor: checkContainerBg,
            },
          ]}>
          <Animated.View style={checkStyle}>
            <CheckCircle2 size={24} color={color} strokeWidth={2} />
          </Animated.View>
        </View>
      </ViewX>
    </TouchableX>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 0,
  },
  glowEffect: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  checkContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(HabitCard);
