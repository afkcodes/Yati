import DateTimePicker from '@react-native-community/datetimepicker';
import {
  AlarmClock,
  AlertCircle,
  Bell,
  ChevronRight,
  Clock,
  Plus,
  X,
} from 'lucide-react-native';
import React, {useCallback, useState} from 'react';
import {Platform} from 'react-native';
import {TextX, TouchableX, ViewX} from '~/components/common';
import SquircleViewContainer from '~/containers/SquircleViewContainer';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';
import {formatTime12Hour} from '~/utils/date/dateUtils';
import {s, vs} from '~utils/screenUtil';
import {SectionLabel} from './BasicInfo';

interface RemindersSectionProps {
  reminders: Date[];
  timeOfDay: Date | null;
  onUpdateReminders: (reminders: Date[]) => void;
  error?: string;
}

const ReminderSection: React.FC<RemindersSectionProps> = ({
  reminders,
  timeOfDay,
  onUpdateReminders,
  error,
}) => {
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const {theme} = useTheme();

  // Theme colors
  const colors = {
    fieldColor: getThemeColor(theme, 'background', 'field'),
    surfaceColor: getThemeColor(theme, 'background', 'surface'),
    borderColor: getThemeColor(theme, 'border', 'subtle'),
    textSecondary: getThemeColor(theme, 'text', 'secondary'),
    textTertiary: getThemeColor(theme, 'text', 'tertiary'),
    accentColor: getThemeColor(theme, 'text', 'accent'),
    errorColor: getThemeColor(theme, 'text', 'error'),
    successColor: getThemeColor(theme, 'text', 'success'),
  };

  // Suggested times based on common reminder patterns
  const suggestedTimes = [
    {label: 'Morning', time: '08:00', icon: 'Sun'},
    {label: 'Noon', time: '12:00', icon: 'Sun'},
    {label: 'Evening', time: '18:00', icon: 'Sunset'},
    {label: 'Night', time: '21:00', icon: 'Moon'},
  ];

  // Toggle expanded state
  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  const handleAddReminder = useCallback(
    (event: any, date?: Date) => {
      setTimePickerVisible(Platform.OS === 'ios');

      if (!date) {
        return;
      }

      // Check if this time already exists
      const timeExists = reminders.some(
        existing =>
          existing.getHours() === date.getHours() &&
          existing.getMinutes() === date.getMinutes(),
      );

      if (!timeExists) {
        const newReminders = [...reminders, date].sort((a, b) => {
          const aMinutes = a.getHours() * 60 + a.getMinutes();
          const bMinutes = b.getHours() * 60 + b.getMinutes();
          return aMinutes - bMinutes;
        });
        onUpdateReminders(newReminders);
        setExpanded(true);
      }
    },
    [reminders, onUpdateReminders],
  );

  const handleRemoveReminder = useCallback(
    (index: number) => {
      const newReminders = [...reminders];
      newReminders.splice(index, 1);
      onUpdateReminders(newReminders);
    },
    [reminders, onUpdateReminders],
  );

  const handleAddSuggestedTime = useCallback(
    (timeString: string) => {
      const [hours, minutes] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);

      // Check if already exists
      const timeExists = reminders.some(
        existing =>
          existing.getHours() === hours && existing.getMinutes() === minutes,
      );

      if (!timeExists) {
        const newReminders = [...reminders, date].sort((a, b) => {
          const aMinutes = a.getHours() * 60 + a.getMinutes();
          const bMinutes = b.getHours() * 60 + b.getMinutes();
          return aMinutes - bMinutes;
        });
        onUpdateReminders(newReminders);
        setExpanded(true);
      }
    },
    [reminders, onUpdateReminders],
  );

  // Add habit time as reminder
  const addHabitTimeReminder = useCallback(() => {
    if (timeOfDay) {
      onUpdateReminders([new Date(timeOfDay)]);
    }
  }, [timeOfDay, onUpdateReminders]);

  // Sort reminders by time for consistent display
  const sortedReminders = [...reminders].sort((a, b) => {
    const aMinutes = a.getHours() * 60 + a.getMinutes();
    const bMinutes = b.getHours() * 60 + b.getMinutes();
    return aMinutes - bMinutes;
  });

  return (
    <ViewX marginBottom={vs(24)}>
      {/* Header with Section Label */}
      <ViewX
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={vs(8)}>
        <SectionLabel title="Reminders" isRequired />

        <ViewX flexDirection="row" alignItems="center">
          <TouchableX
            onPress={toggleExpanded}
            paddingHorizontal={s(8)}
            paddingVertical={vs(4)}>
            <TextX fontSize="xs" color="accent" fontWeight="medium">
              {expanded ? 'Collapse' : 'Expand'}
            </TextX>
          </TouchableX>

          <TextX fontSize="sm" color="tertiary" marginHorizontal={s(4)}>
            |
          </TextX>

          <TouchableX
            onPress={() => setTimePickerVisible(true)}
            flexDirection="row"
            alignItems="center"
            paddingHorizontal={s(8)}
            paddingVertical={vs(4)}>
            <Clock size={14} color={colors.accentColor} strokeWidth={1.5} />
            <TextX
              fontSize="xs"
              color="accent"
              fontWeight="medium"
              marginLeft={s(4)}>
              Custom
            </TextX>
          </TouchableX>
        </ViewX>
      </ViewX>

      {/* Error message - always visible */}
      {error && (
        <SquircleViewContainer
          borderRadius="sm"
          backgroundColor={withAlpha(colors.errorColor, 0.1)}
          padding="xs"
          marginBottom="sm">
          <ViewX flexDirection="row" alignItems="center">
            <AlertCircle
              size={14}
              color={colors.errorColor}
              strokeWidth={1.5}
            />
            <TextX fontSize="xs" color="error" marginLeft={s(6)}>
              {error}
            </TextX>
          </ViewX>
        </SquircleViewContainer>
      )}

      {/* Main summary - always visible */}
      <SquircleViewContainer borderRadius="md" variant="field" padding="sm">
        <TouchableX
          onPress={toggleExpanded}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingVertical={vs(2)}>
          <ViewX flexDirection="row" alignItems="center">
            <AlarmClock
              size={18}
              color={colors.accentColor}
              strokeWidth={1.5}
            />
            <TextX
              fontSize="md"
              fontWeight="semibold"
              color="primary"
              marginLeft={s(8)}>
              {reminders.length === 0
                ? 'No reminders set'
                : reminders.length === 1
                  ? '1 reminder set'
                  : `${reminders.length} reminders set`}
            </TextX>
          </ViewX>

          <ViewX flexDirection="row" alignItems="center">
            {reminders.length > 0 && (
              <TextX fontSize="sm" color="secondary" marginRight={s(4)}>
                {reminders.length === 1
                  ? formatTime12Hour(reminders[0])
                  : `${formatTime12Hour(reminders[0])}, ...`}
              </TextX>
            )}
            <ChevronRight
              size={16}
              color={colors.textTertiary}
              style={{
                transform: [{rotate: expanded ? '90deg' : '0deg'}],
              }}
            />
          </ViewX>
        </TouchableX>
      </SquircleViewContainer>

      {/* Expandable content */}
      {expanded && (
        <ViewX marginTop={vs(12)}>
          {/* Quick time selection */}
          <ViewX marginBottom={vs(12)}>
            <TextX
              fontSize="xs"
              color="secondary"
              marginBottom={vs(8)}
              textTransform="uppercase">
              Quick Add
            </TextX>

            <ViewX flexDirection="row" justifyContent="space-between">
              {suggestedTimes.map(({label, time}) => (
                <TouchableX
                  key={time}
                  onPress={() => handleAddSuggestedTime(time)}
                  paddingVertical={vs(8)}
                  paddingHorizontal={s(8)}
                  backgroundColor={withAlpha(colors.accentColor, 0.1)}
                  borderRadius={8}
                  alignItems="center"
                  width={s(72)}>
                  <TextX fontSize="xs" color="accent" fontWeight="medium">
                    {label}
                  </TextX>
                  <TextX fontSize="sm" color="primary" fontWeight="semibold">
                    {time}
                  </TextX>
                </TouchableX>
              ))}
            </ViewX>
          </ViewX>

          {/* Reminders List - no FlatList, just mapping directly */}
          {sortedReminders.length > 0 ? (
            <ViewX>
              <TextX
                fontSize="xs"
                color="secondary"
                marginBottom={vs(8)}
                textTransform="uppercase">
                Set Reminders
              </TextX>

              <ViewX>
                {sortedReminders.map((item, index) => (
                  <SquircleViewContainer
                    key={item.toISOString()}
                    borderRadius="xs"
                    variant="surface"
                    borderColor={withAlpha(colors.borderColor, 0.5)}
                    borderWidth={1}
                    padding="xs"
                    marginBottom="xs">
                    <ViewX
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      paddingHorizontal={s(8)}
                      paddingVertical={vs(6)}>
                      <ViewX flexDirection="row" alignItems="center">
                        <Bell
                          size={16}
                          color={colors.accentColor}
                          strokeWidth={1.5}
                        />
                        <TextX
                          fontSize="md"
                          color="primary"
                          marginLeft={s(8)}
                          fontWeight="medium">
                          {formatTime12Hour(item)}
                        </TextX>
                      </ViewX>

                      <TouchableX
                        padding={vs(4)}
                        onPress={() => handleRemoveReminder(index)}
                        accessibilityLabel={`Remove ${formatTime12Hour(item)} reminder`}
                        backgroundColor={withAlpha(colors.errorColor, 0.1)}
                        borderRadius={16}>
                        <X
                          size={14}
                          color={colors.errorColor}
                          strokeWidth={1.5}
                        />
                      </TouchableX>
                    </ViewX>
                  </SquircleViewContainer>
                ))}
              </ViewX>
            </ViewX>
          ) : (
            <ViewX paddingVertical={vs(8)}>
              <TouchableX
                onPress={() => setTimePickerVisible(true)}
                alignItems="center"
                paddingVertical={vs(16)}
                backgroundColor={withAlpha(colors.accentColor, 0.08)}
                borderRadius={8}
                borderWidth={1}
                borderColor={withAlpha(colors.accentColor, 0.2)}
                borderStyle="dashed">
                <Plus size={20} color={colors.accentColor} strokeWidth={1.5} />
                <TextX fontSize="sm" color="accent" marginTop={vs(4)}>
                  Add a reminder
                </TextX>
              </TouchableX>
            </ViewX>
          )}

          {/* Use habit time option */}
          {timeOfDay && reminders.length === 0 && (
            <ViewX marginTop={vs(8)}>
              <TextX
                fontSize="xs"
                color="secondary"
                marginBottom={vs(4)}
                textTransform="uppercase">
                Suggestion
              </TextX>

              <TouchableX
                flexDirection="row"
                alignItems="center"
                paddingHorizontal={s(12)}
                paddingVertical={vs(10)}
                borderRadius={styleUtils.borderRadius.sm}
                backgroundColor={withAlpha(colors.successColor, 0.1)}
                borderColor={withAlpha(colors.successColor, 0.3)}
                borderWidth={1}
                onPress={addHabitTimeReminder}>
                <Clock
                  size={16}
                  color={colors.successColor}
                  strokeWidth={1.5}
                />
                <ViewX flex={1} marginLeft={s(8)}>
                  <TextX fontSize="sm" color="success" fontWeight="medium">
                    Use habit time as reminder
                  </TextX>
                  <TextX fontSize="xs" color="secondary">
                    {formatTime12Hour(timeOfDay)}
                  </TextX>
                </ViewX>
                <TouchableX
                  padding={s(4)}
                  borderRadius={16}
                  backgroundColor={withAlpha(colors.successColor, 0.2)}>
                  <Plus
                    size={14}
                    color={colors.successColor}
                    strokeWidth={1.5}
                  />
                </TouchableX>
              </TouchableX>
            </ViewX>
          )}
        </ViewX>
      )}

      {/* Alternate add time button - shown when collapsed and no reminders */}
      {!expanded && reminders.length === 0 && !error && (
        <TouchableX
          onPress={() => setTimePickerVisible(true)}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          paddingVertical={vs(10)}
          marginTop={vs(8)}
          borderRadius={8}
          backgroundColor={withAlpha(colors.accentColor, 0.1)}
          borderWidth={1}
          borderColor={withAlpha(colors.accentColor, 0.2)}
          borderStyle="dashed">
          <Plus size={16} color={colors.accentColor} strokeWidth={1.5} />
          <TextX
            fontSize="sm"
            color="accent"
            fontWeight="medium"
            marginLeft={s(6)}>
            Add Reminder Time
          </TextX>
        </TouchableX>
      )}

      {/* Time Picker for adding reminders */}
      {timePickerVisible && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleAddReminder}
          minuteInterval={5}
        />
      )}
    </ViewX>
  );
};

export default React.memo(ReminderSection);
