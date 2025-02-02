// import {Clock, Moon, Sun, Sunset} from 'lucide-react-native';
// import React from 'react';
// import {Pressable, StyleSheet, Text, View} from 'react-native';
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
// } from 'react-native-reanimated';

// type TimePeriod = 'morning' | 'evening' | 'night' | 'all';

// interface TimeFilterProps {
//   selectedTime: TimePeriod;
//   onSelectTime: (time: TimePeriod) => void;
// }

// const TIME_OPTIONS = [
//   {id: 'all', label: 'All', Icon: Clock},
//   {id: 'morning', label: 'Morning', Icon: Sun},
//   {id: 'evening', label: 'Evening', Icon: Sunset},
//   {id: 'night', label: 'Night', Icon: Moon},
// ] as const;

// const TimeFilter = ({selectedTime, onSelectTime}: TimeFilterProps) => {
//   // Store positions for the sliding animation
//   const [positions, setPositions] = React.useState<{[key: string]: number}>({});
//   const translateX = useSharedValue(0);

//   // Update position when a button is measured
//   const onLayout = React.useCallback((event: any, id: string) => {
//     const {x} = event.nativeEvent.layout;
//     setPositions(prev => ({
//       ...prev,
//       [id]: x,
//     }));
//   }, []);

//   // Animate background when selection changes
//   React.useEffect(() => {
//     if (positions[selectedTime] !== undefined) {
//       translateX.value = withSpring(positions[selectedTime], {
//         damping: 20,
//         stiffness: 300,
//       });
//     }
//   }, [selectedTime, positions, translateX]);

//   // Animated style for the background
//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{translateX: translateX.value}],
//   }));

//   return (
//     <View style={styles.container}>
//       <View style={styles.filterContainer}>
//         {/* Animated background */}
//         <Animated.View style={[styles.selectedBackground, animatedStyle]} />

//         {/* Filter buttons */}
//         {TIME_OPTIONS.map(({id, label, Icon}) => {
//           const isSelected = selectedTime === id;

//           return (
//             <Pressable
//               key={id}
//               onPress={() => onSelectTime(id)}
//               onLayout={e => onLayout(e, id)}
//               style={styles.button}>
//               <View style={styles.buttonContent}>
//                 <Icon
//                   size={16}
//                   color={isSelected ? '#000000' : '#8E8E93'}
//                   strokeWidth={2}
//                 />
//                 <Text
//                   style={[
//                     styles.buttonText,
//                     isSelected ? styles.selectedText : styles.unselectedText,
//                   ]}>
//                   {label}
//                 </Text>
//               </View>
//             </Pressable>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 16,
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#1A1A1A',
//     borderRadius: 16,
//     padding: 4,
//     height: 56,
//     position: 'relative',
//   },
//   selectedBackground: {
//     position: 'absolute',
//     top: 4,
//     bottom: 4,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     width: '25%',
//   },
//   button: {
//     flex: 1,
//     borderRadius: 12,
//   },
//   buttonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 44,
//     gap: 6,
//   },
//   buttonText: {
//     fontSize: 13,
//     lineHeight: 18,
//   },
//   selectedText: {
//     color: '#000000',
//     fontWeight: '500',
//   },
//   unselectedText: {
//     color: '#8E8E93',
//     fontWeight: '400',
//   },
// });

// export default React.memo(TimeFilter);

import {Clock, Moon, Sun, Sunset} from 'lucide-react-native';
import React from 'react';
import {
  AccessibilityInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {trigger} from 'react-native-haptic-feedback';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

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
  const [positions, setPositions] = React.useState<{[key: string]: number}>({});
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1); // For background scaling effect
  // const haptics = useHaptics();

  const onLayout = React.useCallback((event: any, id: string) => {
    const {x} = event.nativeEvent.layout;
    setPositions(prev => ({
      ...prev,
      [id]: x,
    }));
  }, []);

  React.useEffect(() => {
    if (positions[selectedTime] !== undefined) {
      translateX.value = withSpring(positions[selectedTime], {
        damping: 50,
        stiffness: 300,
      });
      scale.value = withTiming(1.1, {duration: 150}); // Scale up slightly
      setTimeout(() => (scale.value = withTiming(1, {duration: 150})), 150); // Scale back down
    }
  }, [selectedTime, positions, translateX, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {scale: scale.value}, // Apply scaling effect
    ],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {/* Animated background */}
        <Animated.View style={[styles.selectedBackground, animatedStyle]} />
        {/* Filter buttons */}
        {TIME_OPTIONS.map(({id, label, Icon}) => {
          const isSelected = selectedTime === id;
          return (
            <Pressable
              key={id}
              onPress={() => {
                onSelectTime(id);
                trigger('selection'); // Haptic feedback
                AccessibilityInfo.announceForAccessibility(`Selected ${label}`);
              }}
              onLayout={e => onLayout(e, id)}
              style={({pressed}) => [
                styles.button,
                pressed && styles.pressedButton, // Pressed state styling
              ]}>
              <View style={styles.buttonContent}>
                <Icon
                  size={16}
                  color={isSelected ? '#000000' : '#8E8E93'}
                  strokeWidth={2}
                />
                <Text
                  style={[
                    styles.buttonText,
                    isSelected ? styles.selectedText : styles.unselectedText,
                  ]}>
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 4,
    height: 56,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // For Android
  },
  selectedBackground: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '25%',
  },
  button: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressedButton: {
    opacity: 0.7, // Subtle opacity change on press
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
