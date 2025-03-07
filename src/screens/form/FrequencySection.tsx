// screens/form/FrequencySection.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import {Calendar, Check, ChevronRight, Clock} from 'lucide-react-native';
import React, {useState} from 'react';
import {Modal, Platform, ScrollView, StyleSheet} from 'react-native';
import {TextX, TouchableX, ViewX} from '~/components/common';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';

// Define frequency types and their labels
const FREQUENCY_TYPES = [
  {id: 'hourly', label: 'Hourly', icon: Clock},
  {id: 'daily', label: 'Daily', icon: Calendar},
  {id: 'weekly', label: 'Weekly', icon: Calendar},
  {id: 'monthly', label: 'Monthly', icon: Calendar},
];

// Days of the week
const WEEKDAYS = [
  {id: 'mon', label: 'Mon'},
  {id: 'tue', label: 'Tue'},
  {id: 'wed', label: 'Wed'},
  {id: 'thu', label: 'Thu'},
  {id: 'fri', label: 'Fri'},
  {id: 'sat', label: 'Sat'},
  {id: 'sun', label: 'Sun'},
];

// Function to generate a proper calendar grid
const generateCalendarGrid = (year: number, month: number) => {
  // Create 6 rows of 7 columns (all null initially)
  const grid: (number | null)[][] = Array(6)
    .fill(null)
    .map(() => Array(7).fill(null));

  // Get number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get the day of week of the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // Convert to 0-indexed for Monday-based week (0 = Monday, 6 = Sunday)
  const mondayBasedStart = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  let dayCounter = 1;
  let weekCounter = 0;

  // Start filling the grid from the correct first day position
  for (let i = mondayBasedStart; i < 7; i++) {
    grid[weekCounter][i] = dayCounter++;
  }

  // Fill in the rest of the days
  weekCounter++;

  while (dayCounter <= daysInMonth) {
    for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
      grid[weekCounter][i] = dayCounter++;
    }
    weekCounter++;
  }

  return grid;
};

// Define the specific frequency types to match the HabitData type
export type FrequencyType = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface FrequencyData {
  type: FrequencyType;
  value: string[];
  timeOfDay: Date | null;
  interval?: number; // For hourly frequency
}

interface FrequencySectionProps {
  frequency: FrequencyData;
  onUpdateFrequency: (frequency: FrequencyData) => void;
  error?: string;
}

const FrequencySection: React.FC<FrequencySectionProps> = ({
  frequency,
  onUpdateFrequency,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const {theme} = useTheme();

  // Generate calendar grid for the selected month
  const calendarGrid = generateCalendarGrid(selectedYear, selectedMonth);

  const fieldColor = getThemeColor(theme, 'background', 'field');
  const surfaceColor = getThemeColor(theme, 'background', 'surface');
  const bgColor = getThemeColor(theme, 'background', 'base');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const accentColor = getThemeColor(theme, 'text', 'accent');
  const textPlaceholder = getThemeColor(theme, 'text', 'tertiary');
  const textSecondary = getThemeColor(theme, 'text', 'secondary');
  const errorColor = getThemeColor(theme, 'text', 'error');

  const handleSelectFrequencyType = (type: FrequencyType) => {
    let newFrequency = {
      ...frequency,
      type,
      value: [],
    };

    if (type === 'hourly') {
      newFrequency.interval = 1;
    }

    onUpdateFrequency(newFrequency);
    setModalVisible(false);
  };

  const handleToggleDay = (day: string) => {
    const newValue = [...frequency.value];
    if (newValue.includes(day)) {
      newValue.splice(newValue.indexOf(day), 1);
    } else {
      newValue.push(day);
    }
    onUpdateFrequency({...frequency, value: newValue});
  };

  const handleToggleDate = (date: string) => {
    const newValue = [...frequency.value];
    if (newValue.includes(date)) {
      newValue.splice(newValue.indexOf(date), 1);
    } else {
      newValue.push(date);
    }
    onUpdateFrequency({...frequency, value: newValue});
  };

  const handleSetTime = (event: any, date?: Date) => {
    setTimePickerVisible(Platform.OS === 'ios');
    if (date) {
      onUpdateFrequency({...frequency, timeOfDay: date});
    }
  };

  const getFrequencyTypeLabel = () => {
    const type = FREQUENCY_TYPES.find(t => t.id === frequency.type);
    return type?.label || 'Select frequency';
  };

  const getFrequencyValueDisplay = () => {
    if (frequency.type === 'daily') {
      return 'Every day';
    }

    if (frequency.type === 'hourly' && frequency.interval) {
      return `Every ${frequency.interval} hour${
        frequency.interval > 1 ? 's' : ''
      }`;
    }

    if (frequency.type === 'weekly' && frequency.value.length > 0) {
      const selectedDays = WEEKDAYS.filter(day =>
        frequency.value.includes(day.id),
      ).map(day => day.label);
      return selectedDays.length === 7
        ? 'Every day of the week'
        : selectedDays.join(', ');
    }

    if (frequency.type === 'monthly' && frequency.value.length > 0) {
      const getOrdinal = (n: number) => {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };
      const selectedDates = frequency.value
        .map(d => getOrdinal(parseInt(d, 10)))
        .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
      return selectedDates.length > 3
        ? `${selectedDates.length} days per month`
        : `Monthly on the ${selectedDates.join(', ')}`;
    }
    return '';
  };

  const getTimeDisplay = () => {
    if (!frequency.timeOfDay) {
      return 'Select time';
    }
    return frequency.timeOfDay.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleUpdateInterval = (increment: boolean) => {
    const currentInterval = frequency.interval || 1;
    const newInterval = increment
      ? currentInterval + 1
      : Math.max(1, currentInterval - 1);
    onUpdateFrequency({
      ...frequency,
      interval: newInterval,
    });
  };

  return (
    <ScrollView>
      <ViewX marginBottom={styleUtils.spacing.xl}>
        <SectionLabel title="Frequency" />
        {error && (
          <TextX
            fontSize="xs"
            color="error"
            marginBottom={styleUtils.spacing.xs}>
            {error}
          </TextX>
        )}

        <TouchableX
          height={44}
          borderRadius={styleUtils.borderRadius.xs}
          borderWidth={1}
          paddingHorizontal={styleUtils.spacing.sm}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          backgroundColor={fieldColor}
          borderColor={error ? errorColor : borderColor}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Select frequency"
          accessibilityHint="Choose how often you want to complete this habit"
          accessibilityRole="button">
          <ViewX flexDirection="row" alignItems="center">
            <Clock size={16} color={textSecondary} strokeWidth={1.5} />
            <TextX
              fontSize="sm"
              color="primary"
              marginLeft={styleUtils.spacing.xs}>
              {getFrequencyTypeLabel()}
            </TextX>
          </ViewX>
          <ChevronRight size={16} color={textPlaceholder} strokeWidth={1.5} />
        </TouchableX>

        {/* Hourly Interval Input */}
        {frequency.type === 'hourly' && (
          <ViewX
            backgroundColor={withAlpha(fieldColor, 0.3)}
            padding={styleUtils.spacing.sm}
            borderRadius={styleUtils.borderRadius.md}
            marginTop={styleUtils.spacing.sm}>
            <ViewX
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              marginBottom={styleUtils.spacing.xs}>
              <TextX fontSize="sm" fontWeight="medium" color="secondary">
                Repeat every
              </TextX>
            </ViewX>

            <ViewX flexDirection="row" alignItems="center">
              <TouchableX
                width={36}
                height={36}
                borderRadius={18}
                justifyContent="center"
                alignItems="center"
                backgroundColor={withAlpha(fieldColor, 0.7)}
                onPress={() => handleUpdateInterval(false)}
                disabled={(frequency.interval || 1) <= 1}
                accessibilityLabel="Decrease interval">
                <TextX fontSize="xl" fontWeight="semibold" color="tertiary">
                  -
                </TextX>
              </TouchableX>

              <ViewX
                flexDirection="row"
                alignItems="flex-end"
                justifyContent="center"
                flex={1}
                paddingHorizontal={styleUtils.spacing.md}>
                <TextX fontSize="2xl" fontWeight="bold" color="accent">
                  {frequency.interval || 1}
                </TextX>
                <TextX
                  fontSize="md"
                  color="secondary"
                  marginLeft={styleUtils.spacing.xs}
                  marginBottom={2}>
                  {(frequency.interval || 1) > 1 ? 'hours' : 'hour'}
                </TextX>
              </ViewX>

              <TouchableX
                width={36}
                height={36}
                borderRadius={18}
                justifyContent="center"
                alignItems="center"
                backgroundColor={withAlpha(fieldColor, 0.7)}
                onPress={() => handleUpdateInterval(true)}
                accessibilityLabel="Increase interval">
                <TextX fontSize="xl" fontWeight="semibold" color="tertiary">
                  +
                </TextX>
              </TouchableX>
            </ViewX>

            {/* Description of what this means */}
            <ViewX
              marginTop={styleUtils.spacing.sm}
              borderTopWidth={1}
              borderTopColor={withAlpha(borderColor, 0.3)}
              paddingTop={styleUtils.spacing.sm}>
              <TextX fontSize="xs" color="tertiary">
                {`Habit will repeat every ${frequency.interval || 1} ${
                  (frequency.interval || 1) > 1 ? 'hours' : 'hour'
                } throughout the day.`}
              </TextX>
            </ViewX>
          </ViewX>
        )}

        {frequency.type === 'weekly' && (
          <ViewX
            flexDirection="row"
            marginTop={styleUtils.spacing.sm}
            justifyContent="space-between">
            {WEEKDAYS.map(day => (
              <TouchableX
                key={day.id}
                width={36}
                height={36}
                borderRadius={18}
                justifyContent="center"
                alignItems="center"
                borderWidth={1}
                backgroundColor={
                  frequency.value.includes(day.id)
                    ? withAlpha(accentColor, 0.15)
                    : withAlpha(fieldColor, 0.7)
                }
                borderColor={
                  frequency.value.includes(day.id) ? accentColor : 'transparent'
                }
                onPress={() => handleToggleDay(day.id)}
                accessibilityLabel={`${day.label}`}
                accessibilityRole="checkbox"
                accessibilityState={{
                  checked: frequency.value.includes(day.id),
                }}>
                <TextX
                  fontSize="xs"
                  color={
                    frequency.value.includes(day.id) ? 'accent' : 'tertiary'
                  }>
                  {day.label}
                </TextX>
              </TouchableX>
            ))}
          </ViewX>
        )}

        {/* Monthly Date Selection */}
        {frequency.type === 'monthly' && (
          <ViewX>
            <ViewX
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom={styleUtils.spacing.xs}
              marginTop={styleUtils.spacing.md}>
              <TouchableX
                padding={styleUtils.spacing['2xs']}
                onPress={() => {
                  if (selectedMonth === 0) {
                    setSelectedMonth(11);
                    setSelectedYear(selectedYear - 1);
                  } else {
                    setSelectedMonth(selectedMonth - 1);
                  }
                }}
                accessibilityLabel="Previous month">
                <TextX fontSize="xs" color="accent">
                  ← Prev
                </TextX>
              </TouchableX>

              <TextX fontSize="sm" fontWeight="medium">
                {new Date(selectedYear, selectedMonth).toLocaleString(
                  'default',
                  {
                    month: 'long',
                    year: 'numeric',
                  },
                )}
              </TextX>

              <TouchableX
                padding={styleUtils.spacing['2xs']}
                onPress={() => {
                  if (selectedMonth === 11) {
                    setSelectedMonth(0);
                    setSelectedYear(selectedYear + 1);
                  } else {
                    setSelectedMonth(selectedMonth + 1);
                  }
                }}
                accessibilityLabel="Next month">
                <TextX fontSize="xs" color="accent">
                  Next →
                </TextX>
              </TouchableX>
            </ViewX>

            {/* Day of the week headers */}
            <ViewX
              flexDirection="row"
              justifyContent="space-around"
              marginBottom={styleUtils.spacing.xs}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <ViewX
                  key={`header-${index}`}
                  width={36}
                  justifyContent="center"
                  alignItems="center">
                  <TextX fontSize="2xs" color="tertiary" fontWeight="medium">
                    {day}
                  </TextX>
                </ViewX>
              ))}
            </ViewX>

            {/* Calendar grid - one row for each week */}
            {calendarGrid.map((week, weekIndex) => {
              // Only render weeks that have at least one date
              if (week.every(day => day === null)) {
                return null;
              }

              return (
                <ViewX
                  key={`week-${weekIndex}`}
                  flexDirection="row"
                  justifyContent="space-around"
                  marginBottom={styleUtils.spacing.xs}>
                  {week.map((day, dayIndex) => {
                    if (day === null) {
                      // Empty cell for padding
                      return (
                        <ViewX
                          key={`empty-${weekIndex}-${dayIndex}`}
                          width={36}
                          height={36}
                          justifyContent="center"
                          alignItems="center"
                        />
                      );
                    }

                    const dateString = day.toString();
                    const isSelected = frequency.value.includes(dateString);

                    return (
                      <TouchableX
                        key={`date-${dateString}`}
                        width={36}
                        height={36}
                        borderRadius={18}
                        justifyContent="center"
                        alignItems="center"
                        borderWidth={1}
                        backgroundColor={
                          isSelected
                            ? withAlpha(accentColor, 0.15)
                            : withAlpha(fieldColor, 0.7)
                        }
                        borderColor={isSelected ? accentColor : 'transparent'}
                        onPress={() => handleToggleDate(dateString)}
                        accessibilityLabel={`Day ${dateString} of month`}
                        accessibilityRole="checkbox"
                        accessibilityState={{checked: isSelected}}>
                        <TextX
                          fontSize="sm"
                          color={isSelected ? 'accent' : 'tertiary'}>
                          {dateString}
                        </TextX>
                      </TouchableX>
                    );
                  })}
                </ViewX>
              );
            })}
          </ViewX>
        )}

        {/* Frequency info and time selection */}
        <ViewX
          flexDirection="row"
          alignItems="center"
          marginTop={styleUtils.spacing.sm}
          justifyContent="space-between">
          {getFrequencyValueDisplay() !== '' && (
            <ViewX flex={1}>
              <TextX fontSize="xs" color="secondary">
                {getFrequencyValueDisplay()}
              </TextX>
            </ViewX>
          )}

          {frequency.type !== 'hourly' && (
            <TouchableX
              flexDirection="row"
              alignItems="center"
              paddingHorizontal={styleUtils.spacing.sm}
              paddingVertical={styleUtils.spacing.xs}
              borderRadius={styleUtils.borderRadius.sm}
              backgroundColor={withAlpha(fieldColor, 0.7)}
              borderWidth={1}
              borderColor={borderColor}
              onPress={() => setTimePickerVisible(true)}
              accessibilityLabel="Select time"
              accessibilityHint="Choose time of day for this habit">
              <Clock
                size={14}
                color={frequency.timeOfDay ? accentColor : textPlaceholder}
                strokeWidth={1.5}
              />
              <TextX
                fontSize="xs"
                color={frequency.timeOfDay ? 'primary' : 'tertiary'}
                fontWeight={frequency.timeOfDay ? 'medium' : 'regular'}
                marginLeft={styleUtils.spacing.xs}>
                {getTimeDisplay()}
              </TextX>
            </TouchableX>
          )}
        </ViewX>

        {/* Frequency Type Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <ViewX
            flex={1}
            justifyContent="flex-end"
            backgroundColor={withAlpha(bgColor, 0.9)}>
            <ViewX
              borderTopLeftRadius={16}
              borderTopRightRadius={16}
              borderWidth={1}
              maxHeight="40%"
              backgroundColor={surfaceColor}
              borderColor={borderColor}>
              <ViewX
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                paddingHorizontal={16}
                paddingVertical={14}
                borderBottomWidth={StyleSheet.hairlineWidth}
                borderBottomColor="rgba(255,255,255,0.1)">
                <TextX fontSize="lg" fontWeight="semibold" color="primary">
                  Select Frequency
                </TextX>
                <TouchableX
                  paddingVertical={6}
                  paddingHorizontal={10}
                  onPress={() => setModalVisible(false)}>
                  <TextX fontSize="sm" fontWeight="medium" color="accent">
                    Cancel
                  </TextX>
                </TouchableX>
              </ViewX>

              <ViewX paddingVertical={8}>
                {FREQUENCY_TYPES.map(option => (
                  <TouchableX
                    key={option.id}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingVertical={14}
                    paddingHorizontal={16}
                    backgroundColor={
                      frequency.type === option.id
                        ? withAlpha(accentColor, 0.07)
                        : 'transparent'
                    }
                    onPress={() =>
                      handleSelectFrequencyType(option.id as FrequencyType)
                    }>
                    <TextX fontSize="sm" color="primary">
                      {option.label}
                    </TextX>
                    {frequency.type === option.id && (
                      <Check size={16} color={accentColor} strokeWidth={1.5} />
                    )}
                  </TouchableX>
                ))}
              </ViewX>
            </ViewX>
          </ViewX>
        </Modal>

        {/* Time Picker */}
        {timePickerVisible && (
          <DateTimePicker
            value={frequency.timeOfDay || new Date()}
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={handleSetTime}
          />
        )}
      </ViewX>
    </ScrollView>
  );
};

// Helper component for section labels
const SectionLabel = ({title}: {title: string}) => (
  <TextX
    fontSize="sm"
    fontWeight="semibold"
    color="secondary"
    marginBottom={8}
    accessibilityRole="header">
    {title}
  </TextX>
);

export default FrequencySection;
