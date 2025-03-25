// screens/form/ReminderSection.tsx
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
import {
  formatTime12Hour,
  fromISO,
  fromJSDate,
  toJSDate,
  toUTCISO,
} from '~utils/date/dateUtils';
import {s, vs} from '~utils/screenUtil';
import {SectionLabel} from './BasicInfo';

interface RemindersSectionProps {
  reminders: string[]; // Now an array of ISO strings
  timeOfDay: Date | null;
  onUpdateReminders: (reminders: string[]) => void;
  error?: string;
}

const RemindersSection: React.FC<RemindersSectionProps> = ({
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
    {label: 'Evening', time: '18:00', icon: 'Sunset'},
    {label: 'Night', time: '21:00', icon: 'Moon'},
  ];

  // Validate an ISO string and convert to Date
  const parseISOToDate = useCallback((iso: string): Date | null => {
    const dt = fromISO(iso, 'utc');
    if (!dt.isValid) {
      console.warn('Invalid ISO string in parseISOToDate:', iso);
      return null;
    }
    const date = toJSDate(dt);
    if (!isValidDate(date)) {
      console.warn('Invalid Date created from ISO string:', iso);
      return null;
    }
    return date;
  }, []);

  // Validate a Date object
  const isValidDate = (date: Date): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  // Format time with validation
  const formatReminderTime = useCallback(
    (iso: string): string => {
      const date = parseISOToDate(iso);
      if (!date) {
        return 'Invalid Date';
      }
      const dt = fromJSDate(date, 'local');
      if (!dt.isValid) {
        console.warn(
          'Invalid DateTime created from Date in formatReminderTime:',
          date,
        );
        return 'Invalid Date';
      }
      return formatTime12Hour(dt);
    },
    [parseISOToDate],
  );

  // Filter and sort reminders
  const sortedReminders = reminders
    .map(iso => ({iso, date: parseISOToDate(iso)}))
    .filter((item): item is {iso: string; date: Date} => item.date !== null)
    .sort((a, b) => {
      const aDt = fromJSDate(a.date, 'local');
      const bDt = fromJSDate(b.date, 'local');
      const aMinutes = aDt.hour * 60 + aDt.minute;
      const bMinutes = bDt.hour * 60 + bDt.minute;
      return aMinutes - bMinutes;
    })
    .map(item => item.iso);

  // Toggle expanded state
  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  const handleAddReminder = useCallback(
    (event: any, date?: Date) => {
      setTimePickerVisible(Platform.OS === 'ios');

      if (!date || !isValidDate(date)) {
        console.log('No valid date selected from DateTimePicker:', date);
        return;
      }

      // Convert the selected date to a DateTime in the local timezone
      const dt = fromJSDate(date, 'local');
      if (!dt.isValid) {
        console.warn('Invalid DateTime created from selected date:', date);
        return;
      }

      // Convert to ISO string in UTC
      const iso = toUTCISO(dt);

      // Check if this time already exists
      const timeExists = reminders.some(reminder => {
        const reminderDate = parseISOToDate(reminder);
        if (!reminderDate) {
          return false;
        }
        const reminderDt = fromJSDate(reminderDate, 'local');
        return reminderDt.hour === dt.hour && reminderDt.minute === dt.minute;
      });

      if (!timeExists) {
        const newReminders = [...reminders, iso].sort((a, b) => {
          const aDate = parseISOToDate(a);
          const bDate = parseISOToDate(b);
          if (!aDate || !bDate) {
            return 0;
          }
          const aDt = fromJSDate(aDate, 'local');
          const bDt = fromJSDate(bDate, 'local');
          const aMinutes = aDt.hour * 60 + aDt.minute;
          const bMinutes = bDt.hour * 60 + bDt.minute;
          return aMinutes - bMinutes;
        });
        console.log('Adding reminder:', iso, 'New reminders:', newReminders);
        onUpdateReminders(newReminders);
        setExpanded(true);
      } else {
        console.log('Reminder time already exists:', iso);
      }
    },
    [reminders, parseISOToDate, onUpdateReminders],
  );

  const handleRemoveReminder = useCallback(
    (index: number) => {
      const newReminders = [...reminders];
      newReminders.splice(index, 1);
      console.log(
        'Removing reminder at index:',
        index,
        'New reminders:',
        newReminders,
      );
      onUpdateReminders(newReminders);
    },
    [reminders, onUpdateReminders],
  );

  const handleAddSuggestedTime = useCallback(
    (timeString: string) => {
      const [hours, minutes] = timeString.split(':').map(Number);
      const dt = fromJSDate(new Date()).set({
        hour: hours,
        minute: minutes,
        second: 0,
        millisecond: 0,
      });

      if (!dt.isValid) {
        console.warn(
          'Invalid DateTime created from suggested time:',
          timeString,
        );
        return;
      }

      // Convert to ISO string in UTC
      const iso = toUTCISO(dt);

      // Check if already exists
      const timeExists = reminders.some(reminder => {
        const reminderDate = parseISOToDate(reminder);
        if (!reminderDate) {
          return false;
        }
        const reminderDt = fromJSDate(reminderDate, 'local');
        return reminderDt.hour === hours && reminderDt.minute === minutes;
      });

      if (!timeExists) {
        const newReminders = [...reminders, iso].sort((a, b) => {
          const aDate = parseISOToDate(a);
          const bDate = parseISOToDate(b);
          if (!aDate || !bDate) {
            return 0;
          }
          const aDt = fromJSDate(aDate, 'local');
          const bDt = fromJSDate(bDate, 'local');
          const aMinutes = aDt.hour * 60 + aDt.minute;
          const bMinutes = bDt.hour * 60 + bDt.minute;
          return aMinutes - bMinutes;
        });
        console.log(
          'Adding suggested time:',
          timeString,
          'New reminders:',
          newReminders,
        );
        onUpdateReminders(newReminders);
        setExpanded(true);
      } else {
        console.log('Suggested time already exists:', timeString);
      }
    },
    [reminders, parseISOToDate, onUpdateReminders],
  );

  // Add habit time as reminder
  const addHabitTimeReminder = useCallback(() => {
    if (timeOfDay && isValidDate(timeOfDay)) {
      const dt = fromJSDate(timeOfDay, 'local');
      if (!dt.isValid) {
        console.warn('Invalid DateTime created from timeOfDay:', timeOfDay);
        return;
      }
      const iso = toUTCISO(dt);
      const newReminders = [iso];
      console.log(
        'Adding habit time as reminder:',
        iso,
        'New reminders:',
        newReminders,
      );
      onUpdateReminders(newReminders);
    } else {
      console.warn('Invalid timeOfDay for habit time reminder:', timeOfDay);
    }
  }, [timeOfDay, onUpdateReminders]);

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
              {sortedReminders.length === 0
                ? 'No reminders set'
                : sortedReminders.length === 1
                  ? '1 reminder set'
                  : `${sortedReminders.length} reminders set`}
            </TextX>
          </ViewX>

          <ViewX flexDirection="row" alignItems="center">
            {sortedReminders.length > 0 && (
              <TextX fontSize="sm" color="secondary" marginRight={s(4)}>
                {sortedReminders.length === 1
                  ? formatReminderTime(sortedReminders[0])
                  : `${formatReminderTime(sortedReminders[0])}, ...`}
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
                {sortedReminders.map((iso, index) => (
                  <SquircleViewContainer
                    key={iso}
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
                          {formatReminderTime(iso)}
                        </TextX>
                      </ViewX>

                      <TouchableX
                        padding={s(4)}
                        onPress={() => handleRemoveReminder(index)}
                        accessibilityLabel={`Remove ${formatReminderTime(iso)} reminder`}
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
          {timeOfDay && sortedReminders.length === 0 && (
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
                    {formatReminderTime(
                      toUTCISO(fromJSDate(timeOfDay, 'local')),
                    )}
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
      {!expanded && sortedReminders.length === 0 && !error && (
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
          // Removed minuteInterval to allow any minute selection
        />
      )}
    </ViewX>
  );
};

export default React.memo(RemindersSection);
