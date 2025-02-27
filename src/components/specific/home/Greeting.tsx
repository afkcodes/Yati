/* eslint-disable react-native/no-inline-styles */
import {Bell} from 'lucide-react-native';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextX, TouchableX, ViewX} from '~components/common';
import {useTheme} from '~hooks/ThemeContext';
import {styleUtils} from '~styles/theme';
import {getThemeColor} from '~styles/themeUtils';
import {s} from '~utils/screenUtil';

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
  hasUnreadNotifications = false,
  onPressNotification,
  onPressStreak,
}) => {
  const {theme} = useTheme();
  const bellScale = useSharedValue(1);
  const {top} = useSafeAreaInsets();

  // Get theme colors
  const textColor = getThemeColor(theme, 'text', 'primary');
  const textSecondaryColor = getThemeColor(theme, 'text', 'secondary');
  const notificationDotColor = getThemeColor(theme, 'text', 'error');
  const avatarFallbackBg = getThemeColor(theme, 'background', 'tertiary');

  const bellAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: bellScale.value}],
  }));

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
          <View
            style={[
              styles.avatar,
              styles.avatarFallback,
              {backgroundColor: avatarFallbackBg},
            ]}>
            <Text style={[styles.avatarText, {color: textSecondaryColor}]}>
              {username[0].toUpperCase()}
            </Text>
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
        <Bell size={24} color={textColor} strokeWidth={2} />
        {hasUnreadNotifications && (
          <View
            style={[
              styles.notificationDot,
              {backgroundColor: notificationDotColor},
            ]}
          />
        )}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
  },
  streakBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
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
    fontWeight: '500',
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
  },
  message: {
    fontSize: 13,
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
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});

export default React.memo(GreetingHeader);
