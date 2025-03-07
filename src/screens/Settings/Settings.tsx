/* eslint-disable react-native/no-inline-styles */
import {
  Award,
  Bell,
  Calendar,
  ChevronRight,
  Clock,
  Database,
  FileJson,
  Gauge,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  LucideIcon,
  Moon,
  Palette,
  Share2,
  Shield,
  Smartphone,
  Sun,
  Target,
  Trash2,
  User,
} from 'lucide-react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {Platform, ScrollView, StyleSheet, Switch} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextX, TouchableX, ViewX} from '~/components/common';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, withAlpha} from '~/styles/theme';
import {s, vs} from '~/utils/screenUtil';

// Interface for setting item props
interface SettingItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  value?: string;
  onPress: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
  iconColor?: string;
  isFirst?: boolean;
  isLast?: boolean;
}

// Interface for toggle setting props
interface ToggleSettingProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  iconColor?: string;
  isFirst?: boolean;
  isLast?: boolean;
}

const SettingsScreen: React.FC = () => {
  const {theme, setTheme} = useTheme();
  const insets = useSafeAreaInsets();

  // State for toggle settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [weekStartMonday, setWeekStartMonday] = useState(true);
  const [streakProtection, setStreakProtection] = useState(false);

  // Memoize theme colors to prevent recalculation on every render
  const colors = useMemo(
    () => ({
      bgColor: getThemeColor(theme, 'background', 'base'),
      surfaceColor: getThemeColor(theme, 'background', 'surface'),
      accentColor: getThemeColor(theme, 'text', 'accent'),
      textSecondary: getThemeColor(theme, 'text', 'secondary'),
      borderColor: getThemeColor(theme, 'border', 'subtle'),
      errorColor: getThemeColor(theme, 'text', 'error'),
    }),
    [theme],
  );

  // Handle theme toggle
  const handleThemeToggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Render section header - memoized to prevent recreating on every render
  const renderSectionHeader = useCallback(
    (title: string): React.ReactElement => (
      <ViewX
        paddingHorizontal={s(16)}
        paddingVertical={vs(8)}
        marginTop={vs(16)}
        marginBottom={vs(8)}>
        <TextX
          fontSize="xs"
          color="secondary"
          fontWeight="semibold"
          letterSpacing={1}
          textTransform="uppercase">
          {title}
        </TextX>
      </ViewX>
    ),
    [],
  );

  // Render setting item
  const renderSettingItem = useCallback(
    ({
      icon: Icon,
      title,
      subtitle,
      value,
      onPress,
      rightElement,
      destructive = false,
      iconColor,
      isFirst = false,
      isLast = false,
    }: SettingItemProps): React.ReactElement => (
      <TouchableX
        flexDirection="row"
        alignItems="center"
        paddingVertical={vs(12)}
        paddingHorizontal={s(16)}
        onPress={onPress}
        style={[
          isFirst && styles.settingItemFirst,
          isLast && styles.settingItemLast,
          {
            backgroundColor: colors.surfaceColor,
            borderBottomColor: !isLast ? colors.borderColor : 'transparent',
            borderBottomWidth: !isLast ? StyleSheet.hairlineWidth : 0,
          },
        ]}>
        <ViewX
          width={s(28)}
          justifyContent="center"
          alignItems="center"
          marginRight={s(12)}>
          <Icon
            size={20}
            color={
              destructive
                ? colors.errorColor
                : iconColor || colors.textSecondary
            }
            strokeWidth={1.5}
          />
        </ViewX>
        <ViewX flex={1}>
          <TextX
            fontSize="sm"
            fontWeight="medium"
            color={destructive ? 'error' : 'primary'}>
            {title}
          </TextX>
          {subtitle && (
            <TextX fontSize="xs" color="tertiary" marginTop={vs(2)}>
              {subtitle}
            </TextX>
          )}
        </ViewX>
        {rightElement ||
          (value && (
            <ViewX
              flexDirection="row"
              alignItems="center"
              justifyContent="flex-end"
              minWidth={s(60)}>
              <TextX fontSize="sm" color="tertiary">
                {value}
              </TextX>
              <ChevronRight size={16} color={colors.textSecondary} />
            </ViewX>
          ))}
      </TouchableX>
    ),
    [colors],
  );

  // Render toggle setting
  const renderToggleSetting = useCallback(
    ({
      icon,
      title,
      subtitle,
      value,
      onValueChange,
      iconColor,
      isFirst = false,
      isLast = false,
    }: ToggleSettingProps): React.ReactElement =>
      renderSettingItem({
        icon,
        title,
        subtitle,
        iconColor,
        isFirst,
        isLast,
        onPress: () => onValueChange(!value), // Toggle when pressing the item
        rightElement: (
          <Switch
            value={value}
            style={{height: vs(12)}}
            onValueChange={onValueChange}
            trackColor={{
              false: withAlpha(colors.textSecondary, 0.2),
              true: withAlpha(colors.accentColor, 0.8),
            }}
            thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
            ios_backgroundColor={withAlpha(colors.textSecondary, 0.2)}
          />
        ),
      }),
    [renderSettingItem, colors],
  );

  // Render a group of settings
  const renderSettingGroup = useCallback(
    (items: React.ReactElement[]): React.ReactElement => (
      <ViewX
        marginHorizontal={s(16)}
        borderRadius={12}
        overflow="hidden"
        marginBottom={vs(8)}
        backgroundColor={colors.surfaceColor}>
        {items.map((item, index) => (
          <React.Fragment key={`setting-item-${index}`}>{item}</React.Fragment>
        ))}
      </ViewX>
    ),
    [colors.surfaceColor],
  );

  // Handle placeholder onPress events
  const handlePress = useCallback(() => {
    // This would be replaced with actual navigation or action logic
    console.log('Setting item pressed');
  }, []);

  return (
    <ViewX flex={1} backgroundColor={colors.bgColor}>
      <ViewX
        paddingTop={insets.top}
        paddingHorizontal={s(16)}
        paddingVertical={vs(12)}
        zIndex={10}
        variant="base"
        borderBottomWidth={StyleSheet.hairlineWidth}
        borderBottomColor="rgba(150, 150, 150, 0.2)">
        <TextX fontSize="xl" fontWeight="semibold">
          Settings
        </TextX>
      </ViewX>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: insets.bottom},
        ]}>
        {/* Habit Preferences */}
        {renderSectionHeader('Habit Preferences')}
        {renderSettingGroup([
          renderSettingItem({
            icon: Target,
            title: 'Goal Settings',
            subtitle: 'Configure goal targets and reminders',
            onPress: handlePress,
            rightElement: (
              <ChevronRight size={16} color={colors.textSecondary} />
            ),
            iconColor: '#FF6B6B',
            isFirst: true,
          }),

          renderSettingItem({
            icon: Calendar,
            title: 'Week Start Day',
            subtitle: 'Choose first day of week',
            value: weekStartMonday ? 'Monday' : 'Sunday',
            onPress: () => setWeekStartMonday(!weekStartMonday),
            iconColor: '#5856D6',
          }),

          renderToggleSetting({
            icon: Award,
            title: 'Streak Protection',
            subtitle: 'Prevent streak loss for occasional misses',
            value: streakProtection,
            onValueChange: setStreakProtection,
            iconColor: '#FFD60A',
          }),

          renderSettingItem({
            icon: Gauge,
            title: 'Progress Calculation',
            subtitle: 'How progress is measured and displayed',
            value: 'Weekly Average',
            onPress: handlePress,
            rightElement: (
              <ChevronRight size={16} color={colors.textSecondary} />
            ),
            iconColor: '#32D74B',
            isLast: true,
          }),
        ])}

        {/* Notifications & Reminders */}
        {renderSectionHeader('Notifications & Reminders')}
        {renderSettingGroup([
          renderToggleSetting({
            icon: Bell,
            title: 'Push Notifications',
            subtitle: notificationsEnabled ? 'Enabled' : 'Disabled',
            value: notificationsEnabled,
            onValueChange: setNotificationsEnabled,
            iconColor: '#FF6B6B',
            isFirst: true,
          }),

          renderSettingItem({
            icon: Clock,
            title: 'Reminder Schedule',
            subtitle: 'Set timing for habit reminders',
            value: 'Customize',
            onPress: handlePress,
            rightElement: (
              <ChevronRight size={16} color={colors.textSecondary} />
            ),
            iconColor: '#FF9F0A',
          }),

          renderToggleSetting({
            icon: Bell,
            title: 'Sounds',
            subtitle: 'Play sounds for achievements and reminders',
            value: soundsEnabled,
            onValueChange: setSoundsEnabled,
            iconColor: '#64D2FF',
            isLast: true,
          }),
        ])}

        {/* Appearance */}
        {renderSectionHeader('Appearance')}
        {renderSettingGroup([
          renderToggleSetting({
            icon: theme === 'dark' ? Moon : Sun,
            title: 'Dark Mode',
            subtitle:
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
            value: theme === 'dark',
            onValueChange: handleThemeToggle,
            iconColor: theme === 'dark' ? '#8B5CF6' : '#F59E0B',
            isFirst: true,
          }),

          renderSettingItem({
            icon: Palette,
            title: 'Theme Colors',
            subtitle: 'Customize app appearance',
            value: 'Customize',
            onPress: handlePress,
            rightElement: (
              <ChevronRight size={16} color={colors.textSecondary} />
            ),
            iconColor: '#32D74B',
          }),

          renderSettingItem({
            icon: Smartphone,
            title: 'App Icon',
            subtitle: 'Change app icon style',
            value: Platform.OS === 'ios' ? 'Change' : 'Default',
            onPress: handlePress,
            rightElement: (
              <ChevronRight size={16} color={colors.textSecondary} />
            ),
            iconColor: '#BF5AF2',
            isLast: true,
          }),
        ])}

        {/* Data & Privacy */}
        {renderSectionHeader('Data & Privacy')}
        {renderSettingGroup([
          renderToggleSetting({
            icon: Database,
            title: 'Backup & Sync',
            subtitle: 'Keep data safe across devices',
            value: autoBackupEnabled,
            onValueChange: setAutoBackupEnabled,
            iconColor: '#5856D6',
            isFirst: true,
          }),

          renderSettingItem({
            icon: FileJson,
            title: 'Export Data',
            subtitle: 'Export your data for backup or analysis',
            value: 'CSV/JSON',
            onPress: handlePress,
            rightElement: (
              <ChevronRight size={16} color={colors.textSecondary} />
            ),
            iconColor: '#32D74B',
          }),

          renderSettingItem({
            icon: Shield,
            title: 'Privacy Settings',
            subtitle: 'Manage data sharing and privacy',
            onPress: handlePress,
            rightElement: (
              <ChevronRight size={16} color={colors.textSecondary} />
            ),
            iconColor: '#FF375F',
          }),

          renderSettingItem({
            icon: Trash2,
            title: 'Clear All Data',
            subtitle: 'Permanently delete all app data',
            onPress: handlePress,
            destructive: true,
            iconColor: '#FF453A',
            isLast: true,
          }),
        ])}

        {/* Account & Support */}
        {renderSectionHeader('Account & Support')}
        {renderSettingGroup([
          renderSettingItem({
            icon: User,
            title: 'Profile',
            subtitle: 'Manage your account details',
            onPress: handlePress,
            rightElement: (
              <ChevronRight size={16} color={colors.textSecondary} />
            ),
            isFirst: true,
          }),

          renderSettingItem({
            icon: Share2,
            title: 'Share App',
            subtitle: 'Tell friends about this app',
            onPress: handlePress,
            rightElement: (
              <ChevronRight size={16} color={colors.textSecondary} />
            ),
            iconColor: '#5856D6',
          }),

          renderSettingItem({
            icon: Globe,
            title: 'Language',
            subtitle: 'Change app language',
            value: 'English',
            onPress: handlePress,
            rightElement: (
              <ChevronRight size={16} color={colors.textSecondary} />
            ),
            iconColor: '#32D74B',
          }),

          renderSettingItem({
            icon: HelpCircle,
            title: 'Help Center',
            subtitle: 'Get help with using the app',
            onPress: handlePress,
            rightElement: (
              <ChevronRight size={16} color={colors.textSecondary} />
            ),
            iconColor: '#FF375F',
          }),

          renderSettingItem({
            icon: Info,
            title: 'About',
            subtitle: 'App information and credits',
            value: 'Version 1.0.0',
            onPress: handlePress,
            rightElement: (
              <ChevronRight size={16} color={colors.textSecondary} />
            ),
            iconColor: '#64D2FF',
            isLast: true,
          }),
        ])}

        {/* Premium Features */}
        {renderSectionHeader('Premium')}
        {renderSettingGroup([
          renderSettingItem({
            icon: Award,
            title: 'Upgrade to Pro',
            subtitle: 'Get more features and customization',
            value: 'Get More Features',
            onPress: handlePress,
            rightElement: (
              <ChevronRight size={16} color={colors.textSecondary} />
            ),
            iconColor: '#FFD700',
            isFirst: true,
            isLast: true,
          }),
        ])}

        {/* Danger zone */}
        {renderSectionHeader('Danger Zone')}
        {renderSettingGroup([
          renderSettingItem({
            icon: LogOut,
            title: 'Log Out',
            subtitle: 'Sign out of your account',
            onPress: handlePress,
            destructive: true,
            isFirst: true,
            isLast: true,
          }),
        ])}

        {/* Version information */}
        <ViewX paddingVertical={vs(20)} marginBottom={vs(20)}>
          <TextX fontSize="xs" color="tertiary" textAlign="center">
            Version 1.0.0 (Build 100)
          </TextX>
        </ViewX>
      </ScrollView>
    </ViewX>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: vs(20),
  },
  settingItemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  settingItemLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});

export default SettingsScreen;
