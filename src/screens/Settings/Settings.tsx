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
import React, {useState} from 'react';
import {Platform, ScrollView, StyleSheet, Switch} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextX, TouchableX, ViewX} from '~/components/common';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, withAlpha} from '~/styles/theme';
import {s, vs} from '~/utils/screenUtil';

const SettingsScreen = () => {
  const {theme, setTheme} = useTheme();
  const insets = useSafeAreaInsets();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [weekStartMonday, setWeekStartMonday] = useState(true);
  const [streakProtection, setStreakProtection] = useState(false);

  const bgColor = getThemeColor(theme, 'background', 'base');
  const surfaceColor = getThemeColor(theme, 'background', 'surface');
  const accentColor = getThemeColor(theme, 'text', 'accent');
  const textSecondary = getThemeColor(theme, 'text', 'secondary');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const errorColor = getThemeColor(theme, 'text', 'error');

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const renderSectionHeader = (title: string): React.ReactElement => (
    <ViewX
      style={styles.sectionHeader}
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
  );

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

  const renderSettingItem = ({
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
      style={[
        styles.settingItem,
        isFirst && styles.settingItemFirst,
        isLast && styles.settingItemLast,
        {
          backgroundColor: surfaceColor,
          borderBottomColor: !isLast ? borderColor : 'transparent',
          borderBottomWidth: !isLast ? StyleSheet.hairlineWidth : 0,
        },
      ]}
      flexDirection="row"
      alignItems="center"
      paddingVertical={vs(12)}
      paddingHorizontal={s(16)}
      onPress={onPress}>
      <ViewX
        width={s(28)}
        justifyContent="center"
        alignItems="center"
        marginRight={s(12)}>
        <Icon
          size={20}
          color={destructive ? errorColor : iconColor || textSecondary}
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
            <ChevronRight size={16} color={textSecondary} />
          </ViewX>
        ))}
    </TouchableX>
  );

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

  // Render a toggle setting
  const renderToggleSetting = ({
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
            false: withAlpha(textSecondary, 0.2),
            true: withAlpha(accentColor, 0.8),
          }}
          thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
          ios_backgroundColor={withAlpha(textSecondary, 0.2)}
        />
      ),
    });

  // Render a group of settings
  const renderSettingGroup = (
    items: React.ReactElement[],
  ): React.ReactElement => (
    <ViewX
      marginHorizontal={s(16)}
      borderRadius={12}
      overflow="hidden"
      marginBottom={vs(8)}
      backgroundColor={surfaceColor}>
      {items}
    </ViewX>
  );

  return (
    <ViewX
      flex={1}
      backgroundColor={bgColor}
      paddingTop={insets.top}
      paddingBottom={insets.bottom}>
      <ViewX
        paddingHorizontal={s(16)}
        paddingVertical={vs(12)}
        borderBottomWidth={StyleSheet.hairlineWidth}
        borderBottomColor="rgba(150, 150, 150, 0.2)">
        <TextX fontSize="xl" fontWeight="semibold">
          Settings
        </TextX>
      </ViewX>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Habit Preferences */}
        {renderSectionHeader('Habit Preferences')}
        {renderSettingGroup([
          renderSettingItem({
            icon: Target,
            title: 'Goal Settings',
            subtitle: 'Configure goal targets and reminders',
            onPress: () => {},
            rightElement: <ChevronRight size={16} color={textSecondary} />,
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
            onPress: () => {},
            rightElement: <ChevronRight size={16} color={textSecondary} />,
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
            onPress: () => {},
            rightElement: <ChevronRight size={16} color={textSecondary} />,
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
            onPress: () => {},
            rightElement: <ChevronRight size={16} color={textSecondary} />,
            iconColor: '#32D74B',
          }),

          renderSettingItem({
            icon: Smartphone,
            title: 'App Icon',
            subtitle: 'Change app icon style',
            value: Platform.OS === 'ios' ? 'Change' : 'Default',
            onPress: () => {},
            rightElement: <ChevronRight size={16} color={textSecondary} />,
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
            onPress: () => {},
            rightElement: <ChevronRight size={16} color={textSecondary} />,
            iconColor: '#32D74B',
          }),

          renderSettingItem({
            icon: Shield,
            title: 'Privacy Settings',
            subtitle: 'Manage data sharing and privacy',
            onPress: () => {},
            rightElement: <ChevronRight size={16} color={textSecondary} />,
            iconColor: '#FF375F',
          }),

          renderSettingItem({
            icon: Trash2,
            title: 'Clear All Data',
            subtitle: 'Permanently delete all app data',
            onPress: () => {},
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
            onPress: () => {},
            rightElement: <ChevronRight size={16} color={textSecondary} />,
            isFirst: true,
          }),

          renderSettingItem({
            icon: Share2,
            title: 'Share App',
            subtitle: 'Tell friends about this app',
            onPress: () => {},
            rightElement: <ChevronRight size={16} color={textSecondary} />,
            iconColor: '#5856D6',
          }),

          renderSettingItem({
            icon: Globe,
            title: 'Language',
            subtitle: 'Change app language',
            value: 'English',
            onPress: () => {},
            rightElement: <ChevronRight size={16} color={textSecondary} />,
            iconColor: '#32D74B',
          }),

          renderSettingItem({
            icon: HelpCircle,
            title: 'Help Center',
            subtitle: 'Get help with using the app',
            onPress: () => {},
            rightElement: <ChevronRight size={16} color={textSecondary} />,
            iconColor: '#FF375F',
          }),

          renderSettingItem({
            icon: Info,
            title: 'About',
            subtitle: 'App information and credits',
            value: 'Version 1.0.0',
            onPress: () => {},
            rightElement: <ChevronRight size={16} color={textSecondary} />,
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
            onPress: () => {},
            rightElement: <ChevronRight size={16} color={textSecondary} />,
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
            onPress: () => {},
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
  sectionHeader: {},
  settingItem: {},
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
