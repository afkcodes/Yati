import {SquircleView} from 'expo-squircle-view';
import {Clock, Moon, Sun, Sunset} from 'lucide-react-native';
import React from 'react';
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
import {getThemeColor} from '~styles/themeUtils';

type TimePeriod = 'morning' | 'evening' | 'night' | 'all';

interface TimeFilterProps {
  selectedTime: TimePeriod;
  onSelectTime: (time: TimePeriod) => void;
}

const TIME_OPTIONS = [
  {id: 'all', label: 'All', Icon: Clock},
  {id: 'morning', label: 'Morning', Icon: Sun},
  {id: 'evening', label: 'Evening', Icon: Sunset},
  {id: 'night', label: 'Night', Icon: Moon},
] as const;

const TimeFilter = ({selectedTime, onSelectTime}: TimeFilterProps) => {
  const {theme} = useTheme();
  const [positions, setPositions] = React.useState<{[key: string]: number}>({});
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const [prevSelectedTime, setPrevSelectedTime] = React.useState(selectedTime);

  // Get theme colors
  const containerBg = getThemeColor(theme, 'background', 'secondary');
  const selectedBg = getThemeColor(theme, 'background', 'accent');
  const textSecondary = getThemeColor(theme, 'text', 'secondary');

  const onLayout = React.useCallback((event: any, id: string) => {
    const {x} = event.nativeEvent.layout;
    setPositions(prev => ({
      ...prev,
      [id]: x,
    }));
  }, []);

  React.useEffect(() => {
    if (
      positions[selectedTime] !== undefined &&
      prevSelectedTime !== selectedTime
    ) {
      translateX.value = withSpring(positions[selectedTime], {
        damping: 50,
        stiffness: 200,
      });
      scale.value = withTiming(1.1, {duration: 150});
      setTimeout(() => (scale.value = withTiming(1, {duration: 150})), 150);
      setPrevSelectedTime(selectedTime);
    } else if (positions[selectedTime] !== undefined && !prevSelectedTime) {
      // Initial position without animation
      translateX.value = positions[selectedTime];
      setPrevSelectedTime(selectedTime);
    }
  }, [selectedTime, positions, translateX, scale, prevSelectedTime]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}, {scale: scale.value}],
  }));

  const handlePress = React.useCallback(
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
};

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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedBackground: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: '25%',
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
  pressedButton: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    gap: 6,
  },
  buttonText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  selectedText: {
    color: '#000000',
  },
  unselectedText: {
    color: '#8E8E93',
  },
});

export default React.memo(TimeFilter);
