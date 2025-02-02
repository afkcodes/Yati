// import React, {useState} from 'react';
// import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
// import Animated, {
//   interpolate,
//   runOnJS,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
// } from 'react-native-reanimated';

// const {width: SCREEN_WIDTH} = Dimensions.get('window');

// type Position = 'left' | 'right' | 'center';

// interface ExpandableFeedbackProps {
//   position?: Position;
// }

// const SPRING_CONFIG = {
//   damping: 15,
//   stiffness: 150,
//   mass: 0.5,
// };

// const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// const ExpandableFeedback: React.FC<ExpandableFeedbackProps> = ({
//   position = 'center',
// }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

//   const progress = useSharedValue(0);
//   const positionValue = useSharedValue<Position>(position);

//   const getOriginX = (pos: Position): number => {
//     'worklet';
//     switch (pos) {
//       case 'left':
//         return 20;
//       case 'right':
//         return SCREEN_WIDTH - 140;
//       default:
//         return (SCREEN_WIDTH - 120) / 2;
//     }
//   };

//   const containerStyle = useAnimatedStyle(() => {
//     const originX = getOriginX(positionValue.value);
//     const targetX = (SCREEN_WIDTH - (SCREEN_WIDTH - 40)) / 2;

//     return {
//       transform: [
//         {
//           translateX: interpolate(progress.value, [0, 1], [originX, targetX], {
//             extrapolateLeft: 'clamp',
//             extrapolateRight: 'clamp',
//           }),
//         },
//       ],
//       width: interpolate(progress.value, [0, 1], [120, SCREEN_WIDTH - 40], {
//         extrapolateLeft: 'clamp',
//         extrapolateRight: 'clamp',
//       }),
//       height: interpolate(progress.value, [0, 1], [40, 300], {
//         extrapolateLeft: 'clamp',
//         extrapolateRight: 'clamp',
//       }),
//       borderRadius: interpolate(progress.value, [0, 1], [20, 12], {
//         extrapolateLeft: 'clamp',
//         extrapolateRight: 'clamp',
//       }),
//     };
//   });

//   const contentStyle = useAnimatedStyle(() => {
//     return {
//       opacity: progress.value,
//       transform: [
//         {
//           scale: interpolate(progress.value, [0, 1], [0.8, 1], {
//             extrapolateLeft: 'clamp',
//             extrapolateRight: 'clamp',
//           }),
//         },
//       ],
//     };
//   });

//   const buttonTextStyle = useAnimatedStyle(() => {
//     return {
//       opacity: interpolate(progress.value, [0, 0.5], [1, 0], {
//         extrapolateLeft: 'clamp',
//         extrapolateRight: 'clamp',
//       }),
//     };
//   });

//   const handlePress = () => {
//     if (!isExpanded && !feedbackSubmitted) {
//       runOnJS(setIsExpanded)(true);
//       progress.value = withSpring(1, SPRING_CONFIG);
//     }
//   };

//   const handleClose = () => {
//     progress.value = withSpring(0, SPRING_CONFIG, finished => {
//       if (finished) {
//         runOnJS(setIsExpanded)(false);
//       }
//     });
//   };

//   const handleSubmit = () => {
//     runOnJS(setFeedbackSubmitted)(true);
//     handleClose();
//   };

//   return (
//     <AnimatedPressable
//       onPress={handlePress}
//       style={[styles.container, containerStyle]}>
//       <Animated.View style={[styles.buttonTextContainer, buttonTextStyle]}>
//         <Text style={styles.buttonText}>
//           {feedbackSubmitted ? 'Thanks for the feedback!' : 'Feedback'}
//         </Text>
//       </Animated.View>

//       {isExpanded && (
//         <Animated.View style={[styles.content, contentStyle]}>
//           <View style={styles.header}>
//             <Text style={styles.title}>Send Feedback</Text>
//             <Pressable
//               onPress={handleClose}
//               style={styles.closeButton}
//               hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
//               <Text style={styles.closeButtonText}>×</Text>
//             </Pressable>
//           </View>

//           <View style={styles.formContainer}>
//             <Text style={styles.label}>What's on your mind?</Text>

//             <Pressable style={styles.submitButton} onPress={handleSubmit}>
//               <Text style={styles.submitButtonText}>Submit Feedback</Text>
//             </Pressable>
//           </View>
//         </Animated.View>
//       )}
//     </AnimatedPressable>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     position: 'absolute',
//     bottom: 40,
//     overflow: 'hidden',
//   },
//   buttonTextContainer: {
//     position: 'absolute',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#000',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   content: {
//     width: '100%',
//     height: '100%',
//     padding: 16,
//     position: 'absolute',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   closeButton: {
//     padding: 8,
//   },
//   closeButtonText: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   formContainer: {
//     flex: 1,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#333',
//   },
//   submitButton: {
//     backgroundColor: '#007AFF',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 'auto',
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

// export default ExpandableFeedback;

import React, {useState} from 'react';
import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

type Position = 'left' | 'right' | 'center';

interface ExpandableProps {
  trigger: React.ReactNode;
  children: (props: {onClose: () => void}) => React.ReactNode;
  position?: Position;
  triggerWidth?: number; // Custom width for the trigger
  triggerHeight?: number; // Custom height for the trigger
  expandedWidth?: number; // Custom width for the expanded state
  expandedHeight?: number; // Custom height for the expanded state
}

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 0.5,
};

// Wrap the Pressable component from react-native with Animated
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Expandable: React.FC<ExpandableProps> = ({
  trigger,
  children,
  position = 'center',
  triggerWidth = 120, // Default trigger width
  triggerHeight = 40, // Default trigger height
  expandedWidth = SCREEN_WIDTH - 40, // Default expanded width
  expandedHeight = 300, // Default expanded height
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const progress = useSharedValue(0);
  const positionValue = useSharedValue<Position>(position);

  const getOriginX = (pos: Position): number => {
    'worklet';
    switch (pos) {
      case 'left':
        return 20;
      case 'right':
        return SCREEN_WIDTH - triggerWidth - 20;
      default:
        return (SCREEN_WIDTH - triggerWidth) / 2;
    }
  };

  const containerStyle = useAnimatedStyle(() => {
    const originX = getOriginX(positionValue.value);
    const targetX = (SCREEN_WIDTH - expandedWidth) / 2;

    return {
      transform: [
        {
          translateX: interpolate(progress.value, [0, 1], [originX, targetX], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        },
      ],
      width: interpolate(
        progress.value,
        [0, 1],
        [triggerWidth, expandedWidth],
        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
      ),
      height: interpolate(
        progress.value,
        [0, 1],
        [triggerHeight, expandedHeight],
        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
      ),
      borderRadius: interpolate(progress.value, [0, 1], [20, 12], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    };
  });

  const contentStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        scale: interpolate(progress.value, [0, 1], [0.8, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      },
    ],
  }));

  const handlePress = () => {
    if (!isExpanded) {
      runOnJS(setIsExpanded)(true);
      progress.value = withSpring(1, SPRING_CONFIG);
    }
  };

  const handleClose = () => {
    progress.value = withSpring(0, SPRING_CONFIG, finished => {
      if (finished) {
        runOnJS(setIsExpanded)(false);
      }
    });
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.container, containerStyle]}>
      {isExpanded ? (
        <Animated.View style={[styles.content, contentStyle]}>
          {children({onClose: handleClose})}
        </Animated.View>
      ) : (
        <View style={styles.triggerContainer}>{trigger}</View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', //themes.dark.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 5,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // position: 'absolute',
    // bottom: 0,
  },
  triggerContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    height: '100%',
  },
});

export default Expandable;
