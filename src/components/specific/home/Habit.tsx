// import {Check} from 'lucide-react-native';
// import React from 'react';
// import {Pressable, StyleSheet, Text, View} from 'react-native';
// import Animated, {
//   interpolate,
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from 'react-native-reanimated';

// interface WeekDay {
//   day: string;
//   date: number;
//   isCompleted?: boolean;
// }

// interface HabitCardProps {
//   title: string;
//   frequency: string;
//   weekDays: WeekDay[];
//   color?: string;
//   onToggleComplete: (date: number) => void;
//   onPress?: () => void;
// }

// const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// const HabitCard: React.FC<HabitCardProps> = ({
//   title,
//   frequency,
//   weekDays,
//   color = '#FF6B6B',
//   onToggleComplete,
//   onPress,
// }) => {
//   const fadeAnim = useSharedValue(1);

//   const animatedStyle = useAnimatedStyle(() => ({
//     opacity: fadeAnim.value,
//     transform: [
//       {
//         scale: interpolate(fadeAnim.value, [0.95, 1], [0.98, 1]),
//       },
//     ],
//   }));

//   const handlePress = () => {
//     fadeAnim.value = withTiming(0.95, {duration: 100}, () => {
//       fadeAnim.value = withTiming(1, {duration: 150});
//     });
//     onPress?.();
//   };

//   const renderDay = (day: WeekDay, index: number) => {
//     const isToday = index === 1; // Assuming second day is "today" like in the image

//     return (
//       <View key={index} style={styles.dayColumn}>
//         <Text style={styles.dayText}>{day.day}</Text>
//         <Pressable
//           onPress={() => onToggleComplete(day.date)}
//           style={[
//             styles.dateCircle,
//             isToday && styles.todayCircle,
//             day.isCompleted && {backgroundColor: color},
//           ]}>
//           {day.isCompleted ? (
//             <Check size={16} color="#000000" strokeWidth={3} />
//           ) : (
//             <Text style={[styles.dateText, isToday && styles.todayText]}>
//               {day.date}
//             </Text>
//           )}
//         </Pressable>
//       </View>
//     );
//   };

//   return (
//     <AnimatedPressable
//       style={[styles.container, animatedStyle]}
//       onPress={handlePress}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.title}>{title}</Text>
//         <Text style={styles.frequency}>{frequency}</Text>
//       </View>

//       <View style={styles.daysContainer}>{weekDays.map(renderDay)}</View>
//     </AnimatedPressable>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#1C1C1E',
//     borderRadius: 16,
//     padding: 16,
//     marginVertical: 8,
//     marginHorizontal: 16,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   frequency: {
//     fontSize: 15,
//     color: '#8E8E93',
//   },
//   daysContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   dayColumn: {
//     alignItems: 'center',
//     gap: 8,
//   },
//   dayText: {
//     fontSize: 13,
//     color: '#8E8E93',
//     marginBottom: 4,
//   },
//   dateCircle: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#2C2C2E',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   todayCircle: {
//     backgroundColor: '#2C2C2E',
//     borderWidth: 1,
//     borderColor: '#8E8E93',
//   },
//   dateText: {
//     fontSize: 15,
//     fontWeight: '500',
//     color: '#FFFFFF',
//   },
//   todayText: {
//     color: '#FFFFFF',
//   },
// });

// import {Check, Circle} from 'lucide-react-native';
// import React from 'react';
// import {Pressable, StyleSheet, Text, View} from 'react-native';
// import Animated, {
//   interpolate,
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from 'react-native-reanimated';

// interface WeekDay {
//   day: string;
//   date: number;
//   isCompleted?: boolean;
// }

// interface HabitCardProps {
//   title: string;
//   frequency: string;
//   weekDays: WeekDay[];
//   color?: string;
//   onToggleComplete: (date: number) => void;
//   onPress?: () => void;
//   timePeriod: 'morning' | 'evening' | 'night';
// }

// const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// const HabitCard: React.FC<HabitCardProps> = ({
//   title,
//   frequency,
//   weekDays,
//   color = '#FF6B6B',
//   onToggleComplete,
//   onPress,
//   timePeriod,
// }) => {
//   const fadeAnim = useSharedValue(1);

//   const animatedStyle = useAnimatedStyle(() => ({
//     opacity: fadeAnim.value,
//     transform: [
//       {
//         scale: interpolate(fadeAnim.value, [0.95, 1], [0.98, 1]),
//       },
//     ],
//   }));

//   const handlePress = () => {
//     fadeAnim.value = withTiming(0.95, {duration: 100}, () => {
//       fadeAnim.value = withTiming(1, {duration: 150});
//     });
//     onPress?.();
//   };

//   const renderDay = (day: WeekDay, index: number) => (
//     <View key={index} style={styles.dayColumn}>
//       <Text style={styles.dayText}>{day.day}</Text>
//       <Pressable
//         onPress={() => onToggleComplete(day.date)}
//         style={styles.dateContainer}>
//         <View
//           style={[
//             styles.dateCircle,
//             day.isCompleted && {backgroundColor: color},
//           ]}>
//           {day.isCompleted ? (
//             <Check size={16} color="#000000" strokeWidth={3} />
//           ) : (
//             <Text style={styles.dateText}>{day.date}</Text>
//           )}
//         </View>
//         {!day.isCompleted && (
//           <View style={styles.touchIndicator}>
//             <Circle size={20} color="#8E8E93" strokeWidth={1.5} />
//           </View>
//         )}
//       </Pressable>
//     </View>
//   );

//   return (
//     <AnimatedPressable
//       style={[styles.container, animatedStyle]}
//       onPress={handlePress}>
//       <View style={styles.headerContainer}>
//         <View style={styles.titleContainer}>
//           <Text style={styles.title}>{title}</Text>
//           <View
//             style={[
//               styles.timeBadge,
//               {backgroundColor: color + '20'}, // 20 is for opacity
//             ]}>
//             <Text style={[styles.timeText, {color}]}>{timePeriod}</Text>
//           </View>
//         </View>
//         <Text style={styles.frequency}>{frequency}</Text>
//       </View>

//       <View style={styles.daysContainer}>{weekDays.map(renderDay)}</View>
//     </AnimatedPressable>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#1C1C1E',
//     borderRadius: 16,
//     padding: 16,
//     marginVertical: 8,
//     marginHorizontal: 16,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   title: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   timeBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   timeText: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   frequency: {
//     fontSize: 15,
//     color: '#8E8E93',
//   },
//   daysContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   dayColumn: {
//     alignItems: 'center',
//     gap: 8,
//   },
//   dayText: {
//     fontSize: 13,
//     color: '#8E8E93',
//     marginBottom: 4,
//   },
//   dateContainer: {
//     position: 'relative',
//     padding: 2,
//   },
//   dateCircle: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#2C2C2E',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dateText: {
//     fontSize: 15,
//     fontWeight: '500',
//     color: '#FFFFFF',
//   },
//   touchIndicator: {
//     position: 'absolute',
//     top: -2,
//     left: -2,
//     right: -2,
//     bottom: -2,
//     justifyContent: 'center',
//     alignItems: 'center',
//     opacity: 0.3,
//   },
// });

// export default React.memo(HabitCard);

// import {Check} from 'lucide-react-native';
// import React, {useCallback} from 'react';
// import {Pressable, StyleSheet, Text, View} from 'react-native';
// import Animated, {
//   Easing,
//   runOnJS,
//   useAnimatedStyle,
//   useSharedValue,
//   withDelay,
//   withSequence,
//   withSpring,
//   withTiming,
// } from 'react-native-reanimated';

// interface HabitCardProps {
//   title: string;
//   frequency: string;
//   period: 'morning' | 'evening' | 'night';
//   color: string;
//   isCompleted: boolean;
//   streak?: number;
//   onToggleComplete: () => void;
// }

// const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// const HabitCard: React.FC<HabitCardProps> = ({
//   title,
//   frequency,
//   period,
//   color,
//   isCompleted,
//   streak = 0,
//   onToggleComplete,
// }) => {
//   // Animation values
//   const scale = useSharedValue(1);
//   const checkScale = useSharedValue(isCompleted ? 1 : 0);
//   const checkOpacity = useSharedValue(isCompleted ? 1 : 0);
//   const circleScale = useSharedValue(0);

//   // Animation styles
//   const containerStyle = useAnimatedStyle(() => ({
//     transform: [{scale: scale.value}],
//   }));

//   const checkStyle = useAnimatedStyle(() => ({
//     transform: [{scale: checkScale.value}],
//     opacity: checkOpacity.value,
//   }));

//   const circleStyle = useAnimatedStyle(() => ({
//     transform: [{scale: circleScale.value}],
//     opacity: withSpring(circleScale.value ? 0.2 : 0),
//   }));

//   const handlePress = useCallback(() => {
//     // Card press animation
//     scale.value = withSequence(
//       withTiming(0.96, {duration: 150}),
//       withTiming(1, {duration: 150}),
//     );

//     // Check animation
//     const newState = !isCompleted;
//     if (newState) {
//       checkScale.value = withSpring(1, {damping: 12});
//       checkOpacity.value = withSpring(1);

//       // Celebration animation
//       circleScale.value = withSequence(
//         withTiming(1, {
//           duration: 300,
//           easing: Easing.bezier(0.25, 0.1, 0.25, 1),
//         }),
//         withTiming(1.2, {duration: 200}),
//         withDelay(100, withTiming(0, {duration: 300})),
//       );
//     } else {
//       checkScale.value = withTiming(0);
//       checkOpacity.value = withTiming(0);
//     }

//     runOnJS(onToggleComplete)();
//   }, [
//     checkOpacity,
//     checkScale,
//     circleScale,
//     isCompleted,
//     onToggleComplete,
//     scale,
//   ]);

//   return (
//     <AnimatedPressable
//       onPress={handlePress}
//       style={[styles.outerContainer, containerStyle]}>
//       <View style={[styles.colorStrip, {backgroundColor: color}]} />
//       <View style={styles.container}>
//         {/* Content */}
//         <View style={styles.content}>
//           <View style={styles.titleRow}>
//             <Text style={styles.title}>{title}</Text>
//             {/* <View style={[styles.tag, {backgroundColor: `${color}20`}]}>
//               <Text style={[styles.tagText, {color}]}>{period}</Text>
//             </View> */}
//           </View>

//           <View style={styles.detailsRow}>
//             <Text style={styles.frequency}>{frequency}</Text>
//             {streak > 0 && (
//               <Text style={[styles.streak, {color}]}>
//                 {streak} day streak 🔥
//               </Text>
//             )}
//           </View>
//         </View>

//         {/* Check button */}
//         <View style={styles.checkWrapper}>
//           <Animated.View
//             style={[styles.circle, {backgroundColor: color}, circleStyle]}
//           />

//           <View
//             style={[
//               styles.checkButton,
//               isCompleted && {backgroundColor: color},
//             ]}>
//             <Animated.View style={checkStyle}>
//               <Check
//                 size={22}
//                 color={isCompleted ? '#000' : color}
//                 strokeWidth={2.5}
//               />
//             </Animated.View>
//           </View>
//         </View>
//       </View>
//     </AnimatedPressable>
//   );
// };

// const styles = StyleSheet.create({
//   outerContainer: {
//     marginHorizontal: 16,
//     marginVertical: 8,
//     borderRadius: 16,
//     flexDirection: 'row',
//     overflow: 'visible',
//   },
//   colorStrip: {
//     width: 4,
//     borderTopLeftRadius: 16,
//     borderBottomLeftRadius: 16,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#1A1A1A',
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//   },
//   content: {
//     flex: 1,
//     gap: 8,
//   },
//   titleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   title: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     flex: 1,
//   },
//   tag: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   tagText: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   detailsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   frequency: {
//     fontSize: 14,
//     color: '#8E8E93',
//   },
//   streak: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   checkWrapper: {
//     width: 40,
//     height: 40,
//     marginLeft: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   circle: {
//     position: 'absolute',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   checkButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#2C2C2E',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default React.memo(HabitCard);

import {CheckCircle2, Clock, Flame} from 'lucide-react-native';
import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
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

interface HabitCardProps {
  title: string;
  frequency: string;
  period: 'morning' | 'evening' | 'night';
  color: string;
  isCompleted: boolean;
  streak?: number;
  onToggleComplete: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HabitCard: React.FC<HabitCardProps> = ({
  title,
  frequency,
  period,
  color,
  isCompleted,
  streak = 0,
  onToggleComplete,
}) => {
  // Animation values
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(isCompleted ? 1 : 0);
  const checkRotate = useSharedValue(isCompleted ? 1 : 0);
  const backgroundProgress = useSharedValue(isCompleted ? 100 : 0);
  const glowOpacity = useSharedValue(0);
  const streakBounce = useSharedValue(1);

  const handlePress = useCallback(() => {
    const newState = !isCompleted;

    // Card scale animation
    scale.value = withSequence(
      withTiming(0.98, {duration: 100}),
      withTiming(1, {duration: 150}),
    );

    if (newState) {
      // Check mark animation
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
      // Reset animations
      checkScale.value = withTiming(0, {duration: 200});
      checkRotate.value = withTiming(0, {duration: 200});
      backgroundProgress.value = withTiming(0, {duration: 300});
      streakBounce.value = 1;
    }

    runOnJS(onToggleComplete)();
  }, [isCompleted, streak]);

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

  const streakStyle = useAnimatedStyle(() => ({
    transform: [{scale: streakBounce.value}],
  }));

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.container, containerStyle]}>
      {/* Background layers */}
      <View style={styles.backgroundLayer}>
        <Animated.View
          style={[
            styles.progressFill,
            {backgroundColor: color + '15'},
            backgroundStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.glowEffect,
            {backgroundColor: color + '30'},
            glowStyle,
          ]}
        />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Left section */}
        <View style={styles.leftSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <View style={[styles.periodBadge, {backgroundColor: color + '20'}]}>
              <Text style={[styles.periodText, {color}]}>{period}</Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.frequencyRow}>
              <Clock size={14} color="#8E8E93" strokeWidth={2} />
              <Text style={styles.frequency}>{frequency}</Text>
            </View>
            {streak > 0 && (
              <Animated.View style={[styles.streakContainer, streakStyle]}>
                <Flame size={14} color={color} fill={color} strokeWidth={2} />
                <Text style={[styles.streakText, {color}]}>{streak}d</Text>
              </Animated.View>
            )}
          </View>
        </View>

        {/* Check button */}
        <View
          style={[
            styles.checkContainer,
            {backgroundColor: isCompleted ? color + '20' : '#2C2C2E'},
          ]}>
          <Animated.View style={checkStyle}>
            <CheckCircle2 size={24} color={color} strokeWidth={2} />
          </Animated.View>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
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
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  leftSection: {
    flex: 1,
    gap: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  periodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  frequencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  frequency: {
    fontSize: 13,
    color: '#8E8E93',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 4,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '600',
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
