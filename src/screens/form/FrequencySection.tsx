/* eslint-disable react-native/no-inline-styles */
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import {Calendar, Check, ChevronDown, Clock, Repeat} from 'lucide-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {TextX, TouchableX, ViewX} from '~/components/common';
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';
import SquircleViewContainer from '~containers/SquircleViewContainer';
import {useTheme} from '~hooks/ThemeContext';
import {s, vs} from '~utils/screenUtil';
import {SectionLabel} from './BasicInfo';

// Define frequency types and their details
const FREQUENCY_TYPES = [
  {
    id: 'daily',
    label: 'Daily',
    icon: Calendar,
    description: 'Repeat every day',
    needsTimeSelection: true,
  },
  {
    id: 'weekly',
    label: 'Weekly',
    icon: Calendar,
    description: 'Repeat on specific days of the week',
    needsTimeSelection: true,
  },
  {
    id: 'monthly',
    label: 'Monthly',
    icon: Calendar,
    description: 'Repeat on specific days of the month',
    needsTimeSelection: true,
  },
  {
    id: 'hourly',
    label: 'Hourly',
    icon: Clock,
    description: 'Repeat multiple times per day',
    needsTimeSelection: false,
  },
];

// Days of the week
const WEEKDAYS = [
  {id: 'mon', label: 'Monday', shortLabel: 'M'},
  {id: 'tue', label: 'Tuesday', shortLabel: 'T'},
  {id: 'wed', label: 'Wednesday', shortLabel: 'W'},
  {id: 'thu', label: 'Thursday', shortLabel: 'T'},
  {id: 'fri', label: 'Friday', shortLabel: 'F'},
  {id: 'sat', label: 'Saturday', shortLabel: 'S'},
  {id: 'sun', label: 'Sunday', shortLabel: 'S'},
];

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
  // State
  const [frequencyModalVisible, setFrequencyModalVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Animation refs
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const modalY = useRef(new Animated.Value(300)).current;

  // Theme
  const {theme} = useTheme();

  // Theme colors
  const bgColor = getThemeColor(theme, 'background', 'base');
  const surfaceColor = getThemeColor(theme, 'background', 'surface');
  const fieldColor = getThemeColor(theme, 'background', 'field');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const errorColor = getThemeColor(theme, 'text', 'error');
  const textSecondary = getThemeColor(theme, 'text', 'secondary');
  const textTertiary = getThemeColor(theme, 'text', 'tertiary');
  const accentColor = getThemeColor(theme, 'text', 'accent');

  // Generate calendar grid for the selected month
  const calendarGrid = generateCalendarGrid(selectedYear, selectedMonth);

  // Get current frequency type details
  const frequencyType = FREQUENCY_TYPES.find(f => f.id === frequency.type);

  // Determine if time selection is the issue
  const isTimeError =
    error && error.toLowerCase().includes('time') && !frequency.timeOfDay;
  const isFrequencyError = error && !error.toLowerCase().includes('time');

  // Animate chevron rotation for dropdown
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: frequencyModalVisible ? 1 : 0,
      duration: 250,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();

    if (frequencyModalVisible) {
      // Animate modal appearance
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(modalY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate modal disappearance
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(modalY, {
          toValue: 300,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [frequencyModalVisible, rotateAnim, overlayOpacity, modalY]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Handlers
  const handleSelectFrequencyType = (type: FrequencyType) => {
    let newFrequency: FrequencyData = {
      ...frequency,
      type,
      value: [],
    };

    if (type === 'hourly') {
      newFrequency.interval = 1;
    }

    onUpdateFrequency(newFrequency);
    setFrequencyModalVisible(false);
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

  // Helper functions
  // const getFrequencyTypeLabel = () => {
  //   return frequencyType?.label || 'Select frequency';
  // };

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
    return format(frequency.timeOfDay, 'h:mm a');
  };

  // Function to generate a proper calendar grid
  function generateCalendarGrid(year: number, month: number) {
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
  }

  return (
    <ViewX>
      <SectionLabel
        title="Frequency"
        isRequired
        caption="How often you want to do this habit"
      />

      {/* Frequency Type Selector */}
      <SquircleViewContainer
        borderRadius="md"
        backgroundColor={fieldColor}
        borderColor={isFrequencyError ? errorColor : borderColor}
        borderWidth={isFrequencyError ? 2 : 1}
        height={vs(64)}>
        <TouchableX
          onPress={() => setFrequencyModalVisible(true)}
          style={styles.selectorContainer}
          backgroundColor="transparent"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          accessibilityLabel="Select frequency"
          accessibilityHint="Choose how often to do this habit">
          <ViewX flexDirection="row" alignItems="center">
            {frequencyType ? (
              <>
                <ViewX
                  width={s(44)}
                  height={s(44)}
                  borderRadius={s(12)}
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor={withAlpha(accentColor, 0.15)}
                  marginRight={s(12)}>
                  <frequencyType.icon
                    size={22}
                    color={accentColor}
                    strokeWidth={1.5}
                  />
                </ViewX>
                <ViewX>
                  <TextX fontSize="md" fontWeight="medium" color="primary">
                    {frequencyType.label}
                  </TextX>
                  <TextX fontSize="xs" color="tertiary" marginTop={vs(2)}>
                    {frequencyType.description}
                  </TextX>
                </ViewX>
              </>
            ) : (
              <TextX fontSize="md" color="tertiary">
                Select frequency
              </TextX>
            )}
          </ViewX>

          <Animated.View style={{transform: [{rotate: spin}]}}>
            <ChevronDown size={22} color={textSecondary} strokeWidth={1.5} />
          </Animated.View>
        </TouchableX>
      </SquircleViewContainer>

      {isFrequencyError && (
        <TextX fontSize="xs" color="error" marginTop={vs(6)} marginLeft={s(4)}>
          {error}
        </TextX>
      )}

      {/* Frequency Configuration Section */}
      <ViewX marginTop={vs(20)}>
        {/* Hourly Interval Input */}
        {frequency.type === 'hourly' && (
          <SquircleViewContainer
            borderRadius="md"
            backgroundColor={withAlpha(fieldColor, 0.5)}
            padding="md">
            <ViewX style={styles.sectionHeader}>
              <Repeat size={18} color={accentColor} strokeWidth={1.5} />
              <TextX
                fontSize="sm"
                fontWeight="semibold"
                color="accent"
                marginLeft={s(8)}>
                Repeat Interval
              </TextX>
            </ViewX>

            <ViewX flexDirection="row" alignItems="center" marginTop={vs(12)}>
              <TouchableX
                width={s(44)}
                height={s(44)}
                borderRadius={s(22)}
                justifyContent="center"
                alignItems="center"
                backgroundColor={withAlpha(fieldColor, 0.7)}
                onPress={() => handleUpdateInterval(false)}
                disabled={(frequency.interval || 1) <= 1}
                opacity={(frequency.interval || 1) <= 1 ? 0.5 : 1}
                accessibilityLabel="Decrease interval">
                <TextX fontSize="2xl" fontWeight="semibold" color="tertiary">
                  -
                </TextX>
              </TouchableX>

              <ViewX
                flexDirection="row"
                alignItems="flex-end"
                justifyContent="center"
                flex={1}
                paddingHorizontal={s(16)}>
                <TextX fontSize="3xl" fontWeight="bold" color="accent">
                  {frequency.interval || 1}
                </TextX>
                <TextX
                  fontSize="md"
                  color="secondary"
                  marginLeft={s(8)}
                  marginBottom={vs(4)}>
                  {(frequency.interval || 1) > 1 ? 'hours' : 'hour'}
                </TextX>
              </ViewX>

              <TouchableX
                width={s(44)}
                height={s(44)}
                borderRadius={s(22)}
                justifyContent="center"
                alignItems="center"
                backgroundColor={withAlpha(fieldColor, 0.7)}
                onPress={() => handleUpdateInterval(true)}
                accessibilityLabel="Increase interval">
                <TextX fontSize="2xl" fontWeight="semibold" color="tertiary">
                  +
                </TextX>
              </TouchableX>
            </ViewX>

            <TextX fontSize="xs" color="tertiary" marginTop={vs(12)}>
              {`Habit will repeat every ${frequency.interval || 1} ${
                (frequency.interval || 1) > 1 ? 'hours' : 'hour'
              } throughout the day.`}
            </TextX>
          </SquircleViewContainer>
        )}

        {/* Weekly Day Selection */}
        {frequency.type === 'weekly' && (
          <SquircleViewContainer
            borderRadius="md"
            backgroundColor={withAlpha(fieldColor, 0.5)}
            padding="md">
            <ViewX style={styles.sectionHeader}>
              <Calendar size={18} color={accentColor} strokeWidth={1.5} />
              <TextX
                fontSize="sm"
                fontWeight="semibold"
                color="accent"
                marginLeft={s(8)}>
                Days of Week
              </TextX>
            </ViewX>

            <ViewX style={styles.weekdaysContainer}>
              {WEEKDAYS.map(day => (
                <DaySelector
                  key={day.id}
                  day={day}
                  isSelected={frequency.value.includes(day.id)}
                  onToggle={() => handleToggleDay(day.id)}
                  accentColor={accentColor}
                />
              ))}
            </ViewX>

            <TextX fontSize="xs" color="tertiary" marginTop={vs(12)}>
              {frequency.value.length === 0
                ? 'Select which days of the week to repeat this habit'
                : getFrequencyValueDisplay()}
            </TextX>
          </SquircleViewContainer>
        )}

        {/* Monthly Date Selection */}
        {frequency.type === 'monthly' && (
          <SquircleViewContainer
            borderRadius="md"
            backgroundColor={withAlpha(fieldColor, 0.5)}
            padding="md">
            <ViewX style={styles.sectionHeader}>
              <Calendar size={18} color={accentColor} strokeWidth={1.5} />
              <TextX
                fontSize="sm"
                fontWeight="semibold"
                color="accent"
                marginLeft={s(8)}>
                Days of Month
              </TextX>
            </ViewX>

            <ViewX
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom={vs(12)}
              marginTop={vs(8)}>
              <TouchableX
                padding={styleUtils.spacing.xs}
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

              <TextX fontSize="sm" fontWeight="medium" color="primary">
                {new Date(selectedYear, selectedMonth).toLocaleString(
                  'default',
                  {
                    month: 'long',
                    year: 'numeric',
                  },
                )}
              </TextX>

              <TouchableX
                padding={styleUtils.spacing.xs}
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

            {/* Weekday headers */}
            <ViewX
              flexDirection="row"
              justifyContent="space-around"
              marginBottom={vs(8)}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <ViewX
                  key={`header-${index}`}
                  width={s(30)}
                  justifyContent="center"
                  alignItems="center">
                  <TextX fontSize="2xs" color="tertiary" fontWeight="medium">
                    {day}
                  </TextX>
                </ViewX>
              ))}
            </ViewX>

            {/* Calendar grid */}
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
                  marginBottom={vs(8)}>
                  {week.map((day, dayIndex) => {
                    if (day === null) {
                      // Empty cell for padding
                      return (
                        <ViewX
                          key={`empty-${weekIndex}-${dayIndex}`}
                          width={s(30)}
                          height={s(30)}
                        />
                      );
                    }

                    const dateString = day.toString();
                    const isSelected = frequency.value.includes(dateString);

                    return (
                      <TouchableX
                        key={`date-${dateString}`}
                        width={s(30)}
                        height={s(30)}
                        borderRadius={s(15)}
                        justifyContent="center"
                        alignItems="center"
                        backgroundColor={
                          isSelected
                            ? withAlpha(accentColor, 0.2)
                            : 'transparent'
                        }
                        borderWidth={1}
                        borderColor={isSelected ? accentColor : 'transparent'}
                        onPress={() => handleToggleDate(dateString)}
                        accessibilityLabel={`Day ${dateString} of month`}
                        accessibilityRole="checkbox"
                        accessibilityState={{checked: isSelected}}>
                        <TextX
                          fontSize="xs"
                          fontWeight={isSelected ? 'semibold' : 'regular'}
                          color={isSelected ? 'accent' : 'tertiary'}>
                          {dateString}
                        </TextX>
                      </TouchableX>
                    );
                  })}
                </ViewX>
              );
            })}

            <TextX fontSize="xs" color="tertiary" marginTop={vs(8)}>
              {frequency.value.length === 0
                ? 'Select which days of the month to repeat this habit'
                : getFrequencyValueDisplay()}
            </TextX>
          </SquircleViewContainer>
        )}

        {/* Time of Day Selection */}
        {frequencyType?.needsTimeSelection && (
          <ViewX marginTop={vs(16)}>
            <SectionLabel
              title="Time of Day"
              isRequired={true}
              caption="When you plan to do this habit"
            />

            <TouchableX
              onPress={() => setTimePickerVisible(true)}
              style={[
                styles.timeSelector,
                {
                  borderColor: isTimeError ? errorColor : borderColor,
                  borderWidth: isTimeError ? 2 : 1,
                  backgroundColor: fieldColor,
                },
              ]}
              accessibilityLabel="Select time of day"
              accessibilityHint="Choose a time for your habit">
              <ViewX flexDirection="row" alignItems="center">
                <Clock
                  size={20}
                  color={frequency.timeOfDay ? accentColor : textTertiary}
                  strokeWidth={1.5}
                />
                <TextX
                  fontSize="md"
                  color={frequency.timeOfDay ? 'primary' : 'tertiary'}
                  marginLeft={s(12)}>
                  {getTimeDisplay()}
                </TextX>
              </ViewX>
            </TouchableX>

            {isTimeError && (
              <TextX
                fontSize="xs"
                color="error"
                marginTop={vs(6)}
                marginLeft={s(4)}>
                {error}
              </TextX>
            )}
          </ViewX>
        )}
      </ViewX>

      {/* Frequency Type Selection Modal */}
      <Modal
        visible={frequencyModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setFrequencyModalVisible(false)}>
        <TouchableWithoutFeedback
          onPress={() => setFrequencyModalVisible(false)}>
          <Animated.View
            style={[
              styles.modalOverlay,
              {
                backgroundColor: withAlpha(bgColor, 0.8),
                opacity: overlayOpacity,
              },
            ]}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContent,
                  {
                    backgroundColor: surfaceColor,
                    borderColor: borderColor,
                    transform: [{translateY: modalY}],
                  },
                ]}>
                <ViewX style={styles.modalHeader}>
                  <TextX fontSize="lg" fontWeight="semibold" color="primary">
                    Select Frequency
                  </TextX>
                  <TouchableX
                    paddingVertical={vs(6)}
                    paddingHorizontal={s(12)}
                    borderRadius={s(20)}
                    backgroundColor={withAlpha(accentColor, 0.1)}
                    onPress={() => setFrequencyModalVisible(false)}>
                    <TextX fontSize="sm" fontWeight="medium" color="accent">
                      Cancel
                    </TextX>
                  </TouchableX>
                </ViewX>

                <ViewX
                  style={styles.modalDivider}
                  backgroundColor={withAlpha(borderColor, 0.5)}
                />

                <ViewX style={styles.frequencyOptions}>
                  {FREQUENCY_TYPES.map(option => (
                    <TouchableX
                      key={option.id}
                      onPress={() =>
                        handleSelectFrequencyType(option.id as FrequencyType)
                      }
                      backgroundColor={
                        frequency.type === option.id
                          ? withAlpha(accentColor, 0.08)
                          : 'transparent'
                      }
                      style={styles.frequencyOption}
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      accessibilityLabel={option.label}
                      accessibilityRole="radio"
                      accessibilityState={{
                        checked: frequency.type === option.id,
                      }}>
                      <ViewX flexDirection="row" alignItems="center">
                        <SquircleViewContainer
                          borderRadius="md"
                          backgroundColor={withAlpha(accentColor, 0.12)}
                          width={s(48)}
                          height={s(48)}>
                          <ViewX style={styles.iconContainer}>
                            <option.icon
                              size={24}
                              color={accentColor}
                              strokeWidth={1.5}
                            />
                          </ViewX>
                        </SquircleViewContainer>

                        <ViewX marginLeft={s(12)}>
                          <TextX
                            fontSize="md"
                            fontWeight="medium"
                            color="primary">
                            {option.label}
                          </TextX>
                          <TextX
                            fontSize="xs"
                            color="tertiary"
                            marginTop={vs(2)}>
                            {option.description}
                          </TextX>
                        </ViewX>
                      </ViewX>

                      {frequency.type === option.id && (
                        <ViewX
                          width={s(28)}
                          height={s(28)}
                          borderRadius={s(14)}
                          backgroundColor={withAlpha(accentColor, 0.15)}
                          justifyContent="center"
                          alignItems="center">
                          <Check
                            size={16}
                            color={accentColor}
                            strokeWidth={2}
                          />
                        </ViewX>
                      )}
                    </TouchableX>
                  ))}
                </ViewX>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Time Picker */}
      {timePickerVisible && (
        <DateTimePicker
          value={frequency.timeOfDay || new Date()}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleSetTime}
        />
      )}
    </ViewX>
  );
};

// Day selector for weekly frequency
interface DaySelectorProps {
  day: (typeof WEEKDAYS)[0];
  isSelected: boolean;
  onToggle: () => void;
  accentColor: string;
}

// Continuing from the DaySelector component in FrequencySection.tsx

const DaySelector: React.FC<DaySelectorProps> = ({
  day,
  isSelected,
  onToggle,
  accentColor,
}) => {
  const {theme} = useTheme();

  return (
    <ViewX style={styles.daySelector}>
      <TouchableX
        width={s(40)}
        height={s(40)}
        borderRadius={s(20)}
        backgroundColor={
          isSelected ? withAlpha(accentColor, 0.2) : 'transparent'
        }
        borderWidth={1}
        borderColor={
          isSelected ? accentColor : getThemeColor(theme, 'border', 'subtle')
        }
        justifyContent="center"
        alignItems="center"
        onPress={onToggle}
        accessibilityLabel={day.label}
        accessibilityRole="checkbox"
        accessibilityState={{checked: isSelected}}>
        <TextX
          fontSize="sm"
          fontWeight={isSelected ? 'semibold' : 'regular'}
          color={isSelected ? 'accent' : 'tertiary'}>
          {day.shortLabel}
        </TextX>
      </TouchableX>

      <TextX
        fontSize="2xs"
        color="tertiary"
        marginTop={vs(4)}
        textAlign="center">
        {day.shortLabel === 'S' && day.id === 'sun' ? 'Sun' : day.shortLabel}
      </TextX>
    </ViewX>
  );
};

const styles = StyleSheet.create({
  selectorContainer: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  timeSelector: {
    height: vs(48),
    borderRadius: s(12),
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: vs(12),
  },
  daySelector: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    maxHeight: '75%',
    paddingBottom: vs(24),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingVertical: vs(16),
  },
  modalDivider: {
    height: 1,
    marginBottom: vs(12),
  },
  frequencyOptions: {
    paddingHorizontal: s(16),
  },
  frequencyOption: {
    paddingVertical: vs(12),
    paddingHorizontal: s(12),
    borderRadius: 12,
    marginBottom: vs(8),
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FrequencySection;
