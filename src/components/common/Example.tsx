import {useState} from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const SPRING_CONFIG = {
  damping: 15,
  mass: 0.5,
  stiffness: 80,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const FeedbackOverlay = () => {
  const [expanded, setExpanded] = useState(false);
  const animationProgress = useSharedValue(0);

  const handlePress = () => {
    if (expanded) {
      animationProgress.value = withSpring(0, SPRING_CONFIG);
    } else {
      animationProgress.value = withSpring(1, SPRING_CONFIG);
    }
    setExpanded(!expanded);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const expandValue = animationProgress.value;
    return {
      height: interpolate(expandValue, [0, 1], [60, height * 0.6]), // Reduced height
      width: interpolate(expandValue, [0, 1], [60, width * 0.85]), // Slightly reduced width
      position: 'absolute',
      borderRadius: interpolate(expandValue, [0, 1], [50, 10]),
      backgroundColor: 'white',
      bottom: interpolate(expandValue, [0, 1], [100, height * 0.15]),
      right: interpolate(expandValue, [0, 1], [20, width * 0.05]),
      ...(Platform.OS === 'android'
        ? {
            elevation: interpolate(expandValue, [0, 1], [4, 8]),
          }
        : {
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: interpolate(expandValue, [0, 1], [0.25, 0.3]),
            shadowRadius: interpolate(expandValue, [0, 1], [3.84, 5]),
          }),
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(expanded ? 1 : 0, {
        duration: 100,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      }),
      transform: [
        {
          translateY: interpolate(animationProgress.value, [0, 1], [20, 0]),
        },
      ],
    };
  });

  const buttonTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(expanded ? 0 : 1, {
        duration: 100,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      }),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.button, animatedStyle]}>
        <TouchableOpacity
          onPress={handlePress}
          // style={styles.buttonInner}
          activeOpacity={0.8}>
          <Animated.Text style={[styles.buttonText, buttonTextStyle]}>
            Feedback
          </Animated.Text>
        </TouchableOpacity>

        <Animated.View style={[styles.content, contentStyle]}>
          <Text style={styles.overlayTitle}>Send Feedback</Text>
          <Text style={styles.overlaySubtitle}>
            Help us improve by sharing your thoughts
          </Text>
          {/* Add your feedback form components here */}
          <TouchableOpacity
            onPress={handlePress}
            style={styles.closeButton}
            activeOpacity={0.8}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  buttonInner: {
    width: '100%',
    height: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    letterSpacing: 0.15,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 24,
    width: '100%',
  },
  overlayTitle: {
    color: '#000',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  overlaySubtitle: {
    color: '#666',
    fontSize: 15,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 28,
    paddingVertical: 10,
    backgroundColor: '#000',
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default FeedbackOverlay;
