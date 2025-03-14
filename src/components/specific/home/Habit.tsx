/* eslint-disable react-native/no-inline-styles */
import {Check, Clock, Flame} from 'lucide-react-native';
import React, {useEffect, useState} from 'react';
import {Animated, Easing} from 'react-native';
import {TextX, TouchableX, ViewX} from '~components/common';
import {useTheme} from '~hooks/ThemeContext';
import {getThemeColor, withAlpha} from '~styles/theme';
import {s, vs} from '~utils/screenUtil';

interface HabitCardProps {
  title: string;
  frequency: string;
  color: string;
  isCompleted: boolean;
  streak?: number;
  onToggleComplete: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  title,
  frequency,
  color,
  isCompleted,
  streak = 0,
  onToggleComplete,
}) => {
  const {theme} = useTheme();
  const cardBg = getThemeColor(theme, 'background', 'surface');
  const textTertiary = getThemeColor(theme, 'text', 'tertiary');
  const accentColor = withAlpha(color, 1);

  // Animation for the checkmark
  const [checkmarkAnim] = useState(new Animated.Value(0));
  const [bgOpacity] = useState(new Animated.Value(0));

  // Run animation when completion status changes
  useEffect(() => {
    if (isCompleted) {
      // Reset and start checkmark animation
      checkmarkAnim.setValue(0);
      Animated.timing(checkmarkAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      // Fade in background
      Animated.timing(bgOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out background
      Animated.timing(bgOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isCompleted, checkmarkAnim, bgOpacity]);

  const checkScale = checkmarkAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1.2, 1],
  });

  const checkOpacity = checkmarkAnim.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 1],
  });

  return (
    <ViewX
      marginHorizontal={s(16)}
      marginVertical={vs(4)}
      borderRadius={s(8)}
      backgroundColor={cardBg}
      position="relative"
      overflow="hidden">
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: withAlpha(accentColor, 0.1),
          opacity: bgOpacity,
        }}
      />

      {/* Main Content */}
      <TouchableX
        onPress={onToggleComplete}
        flexDirection="row"
        alignItems="center"
        paddingVertical={vs(10)}
        paddingHorizontal={s(12)}
        accessibilityLabel={`${title} habit, ${
          isCompleted ? 'completed' : 'not completed'
        }, frequency: ${frequency}`}>
        {/* Check Circle with Animated Check */}
        <ViewX
          width={s(16)}
          height={s(16)}
          borderRadius={s(8)}
          borderWidth={1}
          borderColor={
            isCompleted ? 'transparent' : withAlpha(textTertiary, 0.3)
          }
          backgroundColor={isCompleted ? accentColor : 'transparent'}
          justifyContent="center"
          alignItems="center"
          marginRight={s(10)}>
          {isCompleted && (
            <Animated.View
              style={{
                opacity: checkOpacity,
                transform: [{scale: checkScale}],
              }}>
              <Check size={10} color={'#FFFFFF'} strokeWidth={2.5} />
            </Animated.View>
          )}
        </ViewX>

        {/* Content Container */}
        <ViewX flex={1}>
          <TextX fontSize="sm" fontWeight="medium" color="primary">
            {title}
          </TextX>

          {/* Meta Row */}
          <ViewX flexDirection="row" alignItems="center" marginTop={vs(2)}>
            <Clock size={10} color={textTertiary} strokeWidth={1.5} />
            <TextX fontSize="xs" color="tertiary" marginLeft={s(4)}>
              {frequency}
            </TextX>
            {streak > 0 && (
              <ViewX flexDirection="row" alignItems="center" marginLeft={s(6)}>
                <ViewX
                  width={s(3)}
                  height={s(3)}
                  borderRadius={s(1.5)}
                  backgroundColor={withAlpha(textTertiary, 0.3)}
                  marginRight={s(6)}
                />
                <Flame size={9} color={accentColor} strokeWidth={1.5} />
                <TextX
                  fontSize="xs"
                  color="accent"
                  marginLeft={s(2)}
                  fontWeight="medium">
                  {streak}
                </TextX>
              </ViewX>
            )}
          </ViewX>
        </ViewX>
      </TouchableX>
    </ViewX>
  );
};

export default React.memo(HabitCard);
