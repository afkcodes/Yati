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
  MessageCircle,
  Moon,
  Palette,
  Share2,
  Shield,
  Smartphone,
  Target,
  Trash2,
} from 'lucide-react-native';
import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  value?: string;
  isToggle?: boolean;
  isEnabled?: boolean;
  isLast?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
  isLast,
}) => (
  <View style={[styles.section, !isLast && styles.sectionMargin]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  value,
  isToggle,
  isEnabled,
  isLast,
  onPress,
  onToggle,
}) => (
  <Pressable
    style={({pressed}) => [
      styles.settingsItem,
      !isLast && styles.settingsItemBorder,
      pressed && styles.settingsItemPressed,
    ]}
    onPress={onPress}>
    <View style={styles.settingsItemLeft}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.settingsItemTitle}>{title}</Text>
    </View>
    <View style={styles.settingsItemRight}>
      {isToggle ? (
        <Switch
          value={isEnabled}
          onValueChange={onToggle}
          trackColor={{false: '#3A3A3C', true: '#34C759'}}
          thumbColor={isEnabled ? '#FFFFFF' : '#FFFFFF'}
          ios_backgroundColor="#3A3A3C"
        />
      ) : (
        <>
          {value && <Text style={styles.settingsItemValue}>{value}</Text>}
          <ChevronRight size={20} color="#8E8E93" />
        </>
      )}
    </View>
  </Pressable>
);

const SettingsScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(true);
  const [weekStartMonday, setWeekStartMonday] = React.useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(true);
  const [backupEnabled, setBackupEnabled] = React.useState(true);
  const [streakProtection, setStreakProtection] = React.useState(false);

  const {top} = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, {paddingTop: top + 10}]}
      contentContainerStyle={[
        styles.contentContainer,
        {paddingBottom: top + 16},
      ]}>
      {/* Habit Preferences */}
      <SettingsSection title="Habit Preferences">
        <SettingsItem
          icon={<Target size={22} color="#FF6B6B" />}
          title="Goal Settings"
          value="Configure"
          onPress={() => {}}
        />
        <SettingsItem
          icon={<Calendar size={22} color="#5856D6" />}
          title="Week Start Day"
          value={weekStartMonday ? 'Monday' : 'Sunday'}
          onPress={() => setWeekStartMonday(!weekStartMonday)}
        />
        <SettingsItem
          icon={<Award size={22} color="#FFD60A" />}
          title="Streak Protection"
          isToggle
          isEnabled={streakProtection}
          onToggle={setStreakProtection}
        />
        <SettingsItem
          icon={<Gauge size={22} color="#32D74B" />}
          title="Progress Calculation"
          value="Weekly Average"
          isLast
          onPress={() => {}}
        />
      </SettingsSection>

      {/* Notifications & Reminders */}
      <SettingsSection title="Notifications & Reminders">
        <SettingsItem
          icon={<Bell size={22} color="#FF6B6B" />}
          title="Push Notifications"
          isToggle
          isEnabled={notificationsEnabled}
          onToggle={setNotificationsEnabled}
        />
        <SettingsItem
          icon={<Clock size={22} color="#FF9F0A" />}
          title="Reminder Schedule"
          value="Customize"
          onPress={() => {}}
        />
        <SettingsItem
          icon={<MessageCircle size={22} color="#64D2FF" />}
          title="Motivation Messages"
          value="Configure"
          isLast
          onPress={() => {}}
        />
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection title="Appearance">
        <SettingsItem
          icon={<Moon size={22} color="#0A84FF" />}
          title="Dark Mode"
          isToggle
          isEnabled={darkModeEnabled}
          onToggle={setDarkModeEnabled}
        />
        <SettingsItem
          icon={<Palette size={22} color="#32D74B" />}
          title="Theme Colors"
          value="Customize"
          onPress={() => {}}
        />
        <SettingsItem
          icon={<Smartphone size={22} color="#BF5AF2" />}
          title="App Icon"
          value={Platform.OS === 'ios' ? 'Change' : 'Default'}
          isLast
          onPress={() => {}}
        />
      </SettingsSection>

      {/* Data & Privacy */}
      <SettingsSection title="Data & Privacy">
        <SettingsItem
          icon={<Database size={22} color="#5856D6" />}
          title="Backup & Sync"
          isToggle
          isEnabled={backupEnabled}
          onToggle={setBackupEnabled}
        />
        <SettingsItem
          icon={<FileJson size={22} color="#32D74B" />}
          title="Export Data"
          value="CSV/JSON"
          onPress={() => {}}
        />
        <SettingsItem
          icon={<Shield size={22} color="#FF375F" />}
          title="Privacy Settings"
          onPress={() => {}}
        />
        <SettingsItem
          icon={<Trash2 size={22} color="#FF453A" />}
          title="Clear All Data"
          isLast
          onPress={() => {}}
        />
      </SettingsSection>

      {/* Account & Support */}
      <SettingsSection title="Account & Support">
        <SettingsItem
          icon={<Share2 size={22} color="#5856D6" />}
          title="Share App"
          onPress={() => {}}
        />
        <SettingsItem
          icon={<Globe size={22} color="#32D74B" />}
          title="Language"
          value="English"
          onPress={() => {}}
        />
        <SettingsItem
          icon={<HelpCircle size={22} color="#FF375F" />}
          title="Help Center"
          onPress={() => {}}
        />
        <SettingsItem
          icon={<Info size={22} color="#64D2FF" />}
          title="About"
          value="Version 1.0.0"
          isLast
          onPress={() => {}}
        />
      </SettingsSection>

      {/* Premium Features */}
      <SettingsSection title="Premium" isLast>
        <SettingsItem
          icon={<Award size={22} color="#FFD700" />}
          title="Upgrade to Pro"
          value="Get More Features"
          isLast
          onPress={() => {}}
        />
      </SettingsSection>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: Platform.select({ios: 40, android: 24}),
  },
  section: {
    width: '100%',
  },
  sectionMargin: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56, // Fixed height for all items
    backgroundColor: '#1C1C1E',
  },
  settingsItemBorder: {
    borderBottomWidth: Platform.select({ios: 0.5, android: 1}),
    borderBottomColor: '#2C2C2E',
  },
  settingsItemPressed: {
    backgroundColor: Platform.select({
      ios: '#2C2C2E',
      android: '#2C2C2E80', // Semi-transparent for ripple effect
    }),
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 56, // Match parent height
    paddingVertical: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#FFFFFF',
    flex: 1,
    letterSpacing: -0.4, // iOS-like letter spacing
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 32,
    minWidth: 54, // Minimum width for consistency
    justifyContent: 'flex-end',
    paddingLeft: 8,
  },
  settingsItemValue: {
    fontSize: 17,
    color: '#8E8E93',
    marginRight: 4,
    textAlign: 'right',
  },
});
export default SettingsScreen;
