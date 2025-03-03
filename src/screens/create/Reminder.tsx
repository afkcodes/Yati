import DateTimePicker from '@react-native-community/datetimepicker';
import {Bell, Plus, X} from 'lucide-react-native';
import {useState} from 'react';
import {Platform} from 'react-native';
import {TextX, TouchableX, ViewX} from '~/components/common';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, withAlpha} from '~/styles/theme';
import {s, vs} from '~utils/screenUtil';

interface RemindersSectionProps {
  reminders: Date[];
  onUpdateReminders: (reminders: Date[]) => void;
}

const RemindersSection = ({
  reminders,
  onUpdateReminders,
}: RemindersSectionProps) => {
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const {theme} = useTheme();

  const fieldColor = getThemeColor(theme, 'background', 'field');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const textSecondary = getThemeColor(theme, 'text', 'secondary');
  const textTertiary = getThemeColor(theme, 'text', 'tertiary');
  const accentColor = getThemeColor(theme, 'text', 'accent');
  const errorColor = getThemeColor(theme, 'text', 'error');

  const handleAddReminder = (event: any, date: any) => {
    setTimePickerVisible(Platform.OS === 'ios');
    if (date) {
      // Only add time part, ignore date part
      const timeOnly = new Date();
      timeOnly.setHours(date.getHours());
      timeOnly.setMinutes(date.getMinutes());
      timeOnly.setSeconds(0);
      timeOnly.setMilliseconds(0);

      // Check if this time already exists
      const exists = reminders.some(
        existing =>
          existing.getHours() === timeOnly.getHours() &&
          existing.getMinutes() === timeOnly.getMinutes(),
      );

      if (!exists) {
        onUpdateReminders([...reminders, timeOnly]);
      }
    }
  };

  const handleRemoveReminder = (index: number) => {
    const newReminders = [...reminders];
    newReminders.splice(index, 1);
    onUpdateReminders(newReminders);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
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
        <SectionLabel title="Reminders" />

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
                  {formatTime(reminder)}
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
          padding={vs(16)}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          backgroundColor={withAlpha(fieldColor, 0.4)}>
          <Bell size={16} color={textTertiary} strokeWidth={1.5} />
          <TextX fontSize="xs" color="tertiary" marginLeft={s(8)}>
            No reminders set
          </TextX>
        </ViewX>
      )}

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

const SectionLabel = ({title}: {title: string}) => (
  <TextX
    fontSize="sm"
    fontWeight="medium"
    color="secondary"
    marginBottom={vs(8)}>
    {title}
  </TextX>
);

export default RemindersSection;
