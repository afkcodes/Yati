import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleProp, ViewStyle} from 'react-native';

type AnimationType = 'fade' | 'slide-up' | 'scale' | 'none';

type AnimatedContainerProps = {
  children: React.ReactNode;
  trigger: any; // Value that triggers the animation when changed
  style?: StyleProp<ViewStyle>; // Custom styles for the container
  duration?: number; // Animation duration in milliseconds
  delay?: number; // Delay before animation starts
  animationType?: AnimationType; // Type of animation
  initialValues?: {
    opacity?: number; // Initial opacity (default: 0)
    translateY?: number; // Initial Y offset for slide (default: 20)
    scale?: number; // Initial scale (default: 0.9)
  }; // Customizable initial values
  onAnimationComplete?: () => void; // Callback when animation finishes
};

/**
 * A reusable animated container for smooth transitions when content changes.
 * Supports fade, slide-up, and scale animations with native driver support.
 */
const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  trigger,
  style,
  duration = 400, // Slightly longer default for smoothness
  delay = 50, // Small default delay to let layout settle
  animationType = 'fade', // Default to fade
  initialValues = {},
  onAnimationComplete,
}) => {
  // Animation values with defaults
  const fadeAnim = useRef(
    new Animated.Value(initialValues.opacity ?? 0),
  ).current;
  const slideAnim = useRef(
    new Animated.Value(initialValues.translateY ?? 20),
  ).current;
  const scaleAnim = useRef(
    new Animated.Value(initialValues.scale ?? 0.9),
  ).current;

  useEffect(() => {
    if (animationType === 'none') {
      return;
    } // Skip animation if 'none'

    // Reset animation values
    if (animationType === 'fade') {
      fadeAnim.setValue(initialValues.opacity ?? 0);
    }
    if (animationType === 'slide-up') {
      slideAnim.setValue(initialValues.translateY ?? 20);
    }
    if (animationType === 'scale') {
      scaleAnim.setValue(initialValues.scale ?? 0.9);
    }

    // Define the animation
    const animations = [];
    if (animationType === 'fade') {
      animations.push(
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      );
    }
    if (animationType === 'slide-up') {
      animations.push(
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          delay,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      );
    }
    if (animationType === 'scale') {
      animations.push(
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      );
    }

    // Run animations in parallel
    Animated.parallel(animations).start(({finished}) => {
      if (finished && onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, [
    trigger,
    fadeAnim,
    slideAnim,
    scaleAnim,
    duration,
    delay,
    animationType,
    initialValues,
    onAnimationComplete,
  ]);

  // Dynamic style based on animation type
  const animatedStyle = {
    opacity: animationType === 'fade' ? fadeAnim : 1,
    transform: [
      ...(animationType === 'slide-up' ? [{translateY: slideAnim}] : []),
      ...(animationType === 'scale' ? [{scale: scaleAnim}] : []),
    ],
  };

  return (
    <Animated.View collapsable={false} style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

export default AnimatedContainer;
