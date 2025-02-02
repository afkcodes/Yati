import {Bell} from 'lucide-react-native';
import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextX, TouchableX, ViewX} from '~components/common';
import {styleUtils, themes} from '~styles/theme';
import {s} from '~utils/screenUtil';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GreetingHeaderProps {
  username: string;
  avatar?: string;
  streakCount: number;
  hasUnreadNotifications?: boolean;
  onPressNotification?: () => void;
  onPressStreak?: () => void;
}

const GreetingHeader: React.FC<GreetingHeaderProps> = ({
  username,
  avatar,
  streakCount = 0,
  hasUnreadNotifications = false,
  onPressNotification,
  onPressStreak,
}) => {
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);
  const bellScale = useSharedValue(1);

  const getTimeBasedContent = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return {
        greeting: 'Good morning',
        message: '🌅 Ready to start your day?',
      };
    }
    if (hour < 17) {
      return {
        greeting: 'Good afternoon',
        message: '💪 Keep going strong!',
      };
    }
    if (hour < 21) {
      return {
        greeting: 'Good evening',
        message: '🎯 Finish your goals!',
      };
    }
    return {
      greeting: 'Good night',
      message: '✨ Time to reflect',
    };
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
    opacity: opacity.value,
  }));

  const bellAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: bellScale.value}],
  }));

  React.useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 12,
      stiffness: 100,
    });
    opacity.value = withSpring(1);
  }, []);

  React.useEffect(() => {
    if (hasUnreadNotifications) {
      bellScale.value = withSequence(
        withTiming(1.2, {duration: 200}),
        withSpring(1, {damping: 4}),
      );
    }
  }, [hasUnreadNotifications]);

  const {greeting} = getTimeBasedContent();

  const {top} = useSafeAreaInsets();

  return (
    <ViewX
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingTop={top + 8}
      paddingHorizontal={styleUtils.spacing.sm}>
      <TouchableX
        onPress={onPressStreak}
        style={styles.avatarContainer}
        alignSelf="flex-start"
        borderColor="white"
        height={s(48)}
        width={s(48)}
        borderRadius={styleUtils.borderRadius.full}
        overflow="hidden"
        borderWidth={s(3)}>
        {avatar ? (
          <Image
            source={{uri: avatar}}
            style={{flex: 1, borderRadius: styleUtils.borderRadius.full}}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarText}>{username[0].toUpperCase()}</Text>
          </View>
        )}
      </TouchableX>

      <ViewX justifyContent="center" flexDirection="row" alignItems="center">
        <TextX fontSize="2xl" fontWeight="bold">
          Hey,{' '}
        </TextX>
        <TextX fontSize="2xl" fontWeight="bold">
          {username}
        </TextX>
      </ViewX>

      <TouchableX
        height={s(48)}
        width={s(48)}
        onPress={onPressNotification}
        style={[styles.notificationButton, bellAnimatedStyle]}>
        <Bell size={24} color={themes.dark.text.primary} strokeWidth={2} />
        {hasUnreadNotifications && <View style={styles.notificationDot} />}
      </TouchableX>
    </ViewX>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 24,
  },
  avatarFallback: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
  },
  streakBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FF4757',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  streakText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  username: {
    fontSize: 20,
    color: '#1F2937',
    fontWeight: '700',
  },
  message: {
    fontSize: 13,
    color: '#6B7280',
  },
  notificationButton: {
    padding: 8,
    borderRadius: 20,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4757',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});

export default React.memo(GreetingHeader);
