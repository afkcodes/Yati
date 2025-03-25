import {SquircleView} from 'expo-squircle-view';
import {Clock, Moon, Sun, Sunset} from 'lucide-react-native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {AccessibilityInfo, Pressable, StyleSheet, View} from 'react-native';
import {trigger} from 'react-native-haptic-feedback';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {TextX} from '~components/common';
import {useTheme} from '~hooks/ThemeContext';
import {getThemeColor} from '~styles/theme';

type TimePeriod = 'morning' | 'evening' | 'night' | 'all';

interface TimeFilterProps {
  selectedTime: TimePeriod;
  onSelectTime: (time: TimePeriod) => void;
}

// Time periods aligned with HabitCreationScreen.tsx
const TIME_OPTIONS = [
  {id: 'all', label: 'All', Icon: Clock}, // All time periods
  {id: 'morning', label: 'Morning', Icon: Sun}, // 5:00 AM to 11:59 AM
  {id: 'evening', label: 'Evening', Icon: Sunset}, // 5:00 PM to 8:59 PM (afternoon habits from 12:00 PM to 4:59 PM are mapped here)
  {id: 'night', label: 'Night', Icon: Moon}, // 9:00 PM to 4:59 AM
] as const;

const TAB_WIDTH_PERCENTAGE = 100 / TIME_OPTIONS.length;

const TimeFilter = React.memo(
  ({selectedTime, onSelectTime}: TimeFilterProps) => {
    const {theme} = useTheme();
    const positionsRef = useRef<{[key: string]: number}>({});
    const translateX = useSharedValue(0);
    const scale = useSharedValue(1);
    const initialized = useRef(false);

    // Memoize theme-dependent values to avoid recalculation
    const containerBg = useMemo(
      () => getThemeColor(theme, 'background', 'surface'),
      [theme],
    );
    const selectedBg = useMemo(
      () => getThemeColor(theme, 'background', 'accent'),
      [theme],
    );
    const textSecondary = useMemo(
      () => getThemeColor(theme, 'text', 'secondary'),
      [theme],
    );

    // Handle layout measurement
    const onLayout = useCallback(
      (event: any, id: string) => {
        const {x} = event.nativeEvent.layout;
        positionsRef.current[id] = x;
        // Only trigger animation setup after all positions are measured
        if (
          Object.keys(positionsRef.current).length === TIME_OPTIONS.length &&
          !initialized.current
        ) {
          translateX.value = positionsRef.current[selectedTime] || 0;
          initialized.current = true;
        }
      },
      [selectedTime, translateX],
    );

    // Update animation when selectedTime changes
    useEffect(() => {
      if (
        initialized.current &&
        positionsRef.current[selectedTime] !== undefined
      ) {
        translateX.value = withSpring(positionsRef.current[selectedTime], {
          damping: 50,
          stiffness: 200,
        });
        scale.value = withTiming(1.1, {duration: 150});
        setTimeout(() => (scale.value = withTiming(1, {duration: 150})), 150);
      }
    }, [selectedTime, translateX, scale]);

    // Animated style for the selected indicator
    const animatedStyle = useAnimatedStyle(
      () => ({
        transform: [{translateX: translateX.value}, {scale: scale.value}],
        width: `${TAB_WIDTH_PERCENTAGE}%`,
      }),
      [],
    );

    // Handle press with haptic feedback and accessibility
    const handlePress = useCallback(
      (id: TimePeriod) => {
        onSelectTime(id);
        trigger('selection', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
        AccessibilityInfo.announceForAccessibility(
          `Selected ${TIME_OPTIONS.find(opt => opt.id === id)?.label}`,
        );
      },
      [onSelectTime],
    );

    return (
      <View style={styles.container}>
        <SquircleView
          style={[styles.filterContainer, {backgroundColor: containerBg}]}>
          <Animated.View style={[animatedStyle, styles.selectedBackground]}>
            <SquircleView
              style={[styles.selectedIndicator, {backgroundColor: selectedBg}]}
            />
          </Animated.View>
          {TIME_OPTIONS.map(({id, label, Icon}) => {
            const isSelected = selectedTime === id;
            return (
              <Pressable
                key={id}
                onPress={() => handlePress(id)}
                onLayout={e => onLayout(e, id)}
                style={styles.button}>
                <View style={styles.buttonContent}>
                  <Icon
                    size={16}
                    color={
                      isSelected
                        ? getThemeColor(theme, 'text', 'primary')
                        : textSecondary
                    }
                    strokeWidth={2}
                  />
                  <TextX
                    color={isSelected ? 'primary' : 'secondary'}
                    fontSize="sm"
                    fontWeight={isSelected ? 'bold' : 'medium'}>
                    {label}
                  </TextX>
                </View>
              </Pressable>
            );
          })}
        </SquircleView>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    height: 56,
    position: 'relative',
  },
  selectedBackground: {
    position: 'absolute',
    top: 4,
    bottom: 4,
  },
  selectedIndicator: {
    flex: 1,
    borderRadius: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    gap: 6,
  },
});

export default TimeFilter;
