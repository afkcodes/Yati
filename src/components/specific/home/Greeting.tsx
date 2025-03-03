/* eslint-disable react-native/no-inline-styles */
import {Bell} from 'lucide-react-native';
import React from 'react';
import {Image} from 'react-native';
import {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextX, TouchableX, ViewX} from '~components/common';
import {useTheme} from '~hooks/ThemeContext';
import {getThemeColor, styleUtils} from '~styles/theme';
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
      {/* Avatar */}
      <TouchableX
        onPress={onPressStreak}
        alignSelf="flex-start"
        borderColor="white"
        height={s(48)}
        width={s(48)}
        borderRadius={styleUtils.borderRadius.full}
        overflow="hidden"
        borderWidth={s(2)}>
        {avatar ? (
          <Image
            source={{uri: avatar}}
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              borderRadius: styleUtils.borderRadius.full,
            }}
            resizeMode="cover"
          />
        ) : (
          <ViewX
            width={s(48)}
            height={s(48)}
            backgroundColor={avatarFallbackBg}
            justifyContent="center"
            alignItems="center">
            <TextX fontSize="lg" fontWeight="semibold" color="secondary">
              {username[0].toUpperCase()}
            </TextX>
          </ViewX>
        )}
      </TouchableX>

      {/* Greeting */}
      <ViewX justifyContent="center" flexDirection="row" alignItems="center">
        <TextX fontSize="2xl" fontWeight="bold" color="primary">
          Hey,{' '}
        </TextX>
        <TextX fontSize="2xl" fontWeight="bold" color="primary">
          {username}
        </TextX>
      </ViewX>

      {/* Notification Bell */}
      <TouchableX
        height={s(48)}
        width={s(48)}
        onPress={onPressNotification}
        justifyContent="center"
        alignItems="center"
        style={bellAnimatedStyle}>
        <Bell size={24} color={textColor} strokeWidth={2} />
        {hasUnreadNotifications && (
          <ViewX
            position="absolute"
            top={s(8)}
            right={s(8)}
            width={s(8)}
            height={s(8)}
            borderRadius={s(4)}
            borderWidth={1.5}
            borderColor="#FFFFFF"
            backgroundColor={notificationDotColor}
          />
        )}
      </TouchableX>
    </ViewX>
  );
};

export default React.memo(GreetingHeader);
