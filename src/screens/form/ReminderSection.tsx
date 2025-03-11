// screens/form/ReminderSection.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import {AlertCircle, Bell, Clock, Plus, X} from 'lucide-react-native';
import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {TextX, TouchableX, ViewX} from '~/components/common';
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

const RemindersSection: React.FC<RemindersSectionProps> = ({
  reminders,
  timeOfDay,
  onUpdateReminders,
  error,
}) => {
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const {theme} = useTheme();

  const fieldColor = getThemeColor(theme, 'background', 'field');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const textSecondary = getThemeColor(theme, 'text', 'secondary');
  const textTertiary = getThemeColor(theme, 'text', 'tertiary');
  const accentColor = getThemeColor(theme, 'text', 'accent');
  const errorColor = getThemeColor(theme, 'text', 'error');

  // Add the frequency time as a default reminder if no reminders exist
  useEffect(() => {
    if (timeOfDay && reminders.length === 0) {
      onUpdateReminders([new Date(timeOfDay)]);
    }
  }, [timeOfDay, reminders.length, onUpdateReminders]);

  const handleAddReminder = (event: any, date?: Date) => {
    setTimePickerVisible(Platform.OS === 'ios');
    if (date) {
      // Only add the time if it doesn't already exist
      const exists = reminders.some(
        existing =>
          existing.getHours() === date.getHours() &&
          existing.getMinutes() === date.getMinutes(),
      );

      if (!exists) {
        onUpdateReminders([...reminders, date]);
      }
    }
  };

  const handleRemoveReminder = (index: number) => {
    const newReminders = [...reminders];
    newReminders.splice(index, 1);
    onUpdateReminders(newReminders);
  };

  const sortReminders = (a: Date, b: Date) => {
    const aMinutes = a.getHours() * 60 + a.getMinutes();
    const bMinutes = b.getHours() * 60 + b.getMinutes();
    return aMinutes - bMinutes;
  };

  return (
    <ViewX marginBottom={vs(24)}>
      <ViewX
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={vs(8)}>
        <SectionLabel title="Reminders" isRequired />

        <TouchableX
          flexDirection="row"
          alignItems="center"
          paddingHorizontal={s(10)}
          paddingVertical={vs(6)}
          borderRadius={16}
          gap={4}
          backgroundColor={withAlpha(accentColor, 0.15)}
          onPress={() => setTimePickerVisible(true)}>
          <Plus size={14} color={accentColor} strokeWidth={1.5} />
          <TextX fontSize="xs" color="accent">
            Add
          </TextX>
        </TouchableX>
      </ViewX>

      {error && (
        <ViewX
          flexDirection="row"
          alignItems="center"
          backgroundColor={withAlpha(errorColor, 0.1)}
          paddingHorizontal={s(8)}
          paddingVertical={vs(4)}
          borderRadius={8}
          marginBottom={vs(8)}>
          <AlertCircle size={14} color={errorColor} />
          <TextX fontSize="xs" color="error" marginLeft={s(6)}>
            {error}
          </TextX>
        </ViewX>
      )}

      {reminders.length > 0 ? (
        <ViewX gap={vs(8)}>
          {reminders.sort(sortReminders).map((reminder, index) => (
            <ViewX
              key={reminder.toISOString()}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              borderRadius={8}
              paddingHorizontal={s(12)}
              paddingVertical={vs(10)}
              borderWidth={1}
              backgroundColor={withAlpha(fieldColor, 0.7)}
              borderColor={borderColor}>
              <ViewX flexDirection="row" alignItems="center">
                <Bell size={14} color={textSecondary} strokeWidth={1.5} />
                <TextX fontSize="xs" color="secondary" marginLeft={s(8)}>
                  {formatTime12Hour(reminder)}
                </TextX>
              </ViewX>

              <TouchableX
                padding={vs(4)}
                onPress={() => handleRemoveReminder(index)}>
                <X size={14} color={errorColor} strokeWidth={1.5} />
              </TouchableX>
            </ViewX>
          ))}
        </ViewX>
      ) : (
        <ViewX
          borderRadius={8}
          padding={vs(14)}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          backgroundColor={withAlpha(fieldColor, 0.4)}
          borderWidth={1}
          borderColor={withAlpha(error ? errorColor : borderColor, 0.5)}
          borderStyle="dashed">
          <Bell size={16} color={textTertiary} strokeWidth={1.5} />
          <TextX fontSize="xs" color="tertiary" marginLeft={s(8)}>
            No reminders set. Add at least one reminder to get notified.
          </TextX>
        </ViewX>
      )}

      {timeOfDay && reminders.length === 0 && (
        <TouchableX
          flexDirection="row"
          alignItems="center"
          padding={styleUtils.spacing.sm}
          marginTop={styleUtils.spacing.sm}
          borderRadius={styleUtils.borderRadius.sm}
          backgroundColor={withAlpha(accentColor, 0.1)}
          borderColor={withAlpha(accentColor, 0.3)}
          borderWidth={1}
          onPress={() => onUpdateReminders([new Date(timeOfDay)])}>
          <Clock size={16} color={accentColor} strokeWidth={1.5} />
          <ViewX marginLeft={styleUtils.spacing.sm} flex={1}>
            <TextX fontSize="sm" color="accent" fontWeight="medium">
              Use habit time as reminder
            </TextX>
            <TextX fontSize="xs" color="secondary">
              {formatTime12Hour(timeOfDay)}
            </TextX>
          </ViewX>
          <Plus size={16} color={accentColor} strokeWidth={1.5} />
        </TouchableX>
      )}

      {/* Time Picker for adding reminders */}
      {timePickerVisible && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display="spinner"
          onChange={handleAddReminder}
        />
      )}
    </ViewX>
  );
};

export default RemindersSection;
