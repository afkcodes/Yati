/* eslint-disable react-native/no-inline-styles */
import {Clock} from 'lucide-react-native';
import {StyleSheet, TextInput} from 'react-native';
import {TextX, TouchableX, ViewX} from '~components/common';

// Constants
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const MONTHLY_DATES = [1, 5, 10, 15, 20, 25] as const;

// Types
type WeekDay = (typeof WEEKDAYS)[number];
type MonthlyDate = (typeof MONTHLY_DATES)[number];

interface HourlyDetails {
  interval: number;
}

interface DailyDetails {
  timeOfDay: Date;
}

interface WeeklyDetails {
  days: WeekDay[];
}

interface MonthlyDetails {
  dates: MonthlyDate[];
}

interface FrequencyDetails {
  hourly: {interval: number};
  daily: {timeOfDay: Date};
  weekly: {days: string[]};
  monthly: {dates: number[]};
}

type FrequencyType = keyof FrequencyDetails;

interface BaseProps {
  frequencyDetails: FrequencyDetails;
  onFrequencyDetailsChange: (details: Partial<FrequencyDetails>) => void;
}

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
  },
  hourlyInput: {
    backgroundColor: '#3A3A3C',
    padding: 12,
    borderRadius: 8,
    width: 60,
    color: '#FFFFFF',
    fontSize: 17,
    textAlign: 'center',
  },
  dayButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 45,
    alignItems: 'center',
  },
  dateButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});

// Hourly frequency component
const HourlyFrequency: React.FC<BaseProps> = ({
  frequencyDetails,
  onFrequencyDetailsChange,
}) => (
  <ViewX
    style={styles.container}
    flexDirection="row"
    alignItems="center"
    gap={12}>
    <TextInput
      style={styles.hourlyInput}
      value={frequencyDetails.hourly.interval.toString()}
      onChangeText={(text: string) => {
        const interval = parseInt(text, 10) || 1;
        onFrequencyDetailsChange({hourly: {interval}});
      }}
      keyboardType="numeric"
      placeholder="1"
      placeholderTextColor="#8E8E93"
    />
    <TextX fontSize="lg">hours</TextX>
  </ViewX>
);

// Daily frequency component
interface DailyFrequencyProps extends BaseProps {
  onTimePickerPress: () => void;
}

const DailyFrequency: React.FC<DailyFrequencyProps> = ({
  frequencyDetails,
  onTimePickerPress,
}) => (
  <TouchableX
    style={styles.container}
    flexDirection="row"
    alignItems="center"
    gap={12}
    onPress={onTimePickerPress}>
    <Clock size={20} color="#FFFFFF" />
    <TextX fontSize="lg">
      {frequencyDetails.daily.timeOfDay.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </TextX>
  </TouchableX>
);

// Weekly frequency component
const WeeklyFrequency: React.FC<BaseProps> = ({
  frequencyDetails,
  onFrequencyDetailsChange,
}) => {
  const toggleDay = (day: WeekDay) => {
    const days = frequencyDetails.weekly.days.includes(day)
      ? frequencyDetails.weekly.days.filter(d => d !== day)
      : [...frequencyDetails.weekly.days, day];
    onFrequencyDetailsChange({weekly: {days}});
  };

  return (
    <ViewX style={styles.container} flexDirection="row" flexWrap="wrap" gap={8}>
      {WEEKDAYS.map(day => (
        <TouchableX
          key={day}
          style={[
            styles.dayButton,
            {
              backgroundColor: frequencyDetails.weekly.days.includes(day)
                ? '#34C759'
                : '#3A3A3C',
            },
          ]}
          onPress={() => toggleDay(day)}>
          <TextX
            fontSize="md"
            fontWeight={
              frequencyDetails.weekly.days.includes(day)
                ? 'semibold'
                : 'regular'
            }>
            {day}
          </TextX>
        </TouchableX>
      ))}
    </ViewX>
  );
};

// Monthly frequency component
const MonthlyFrequency: React.FC<BaseProps> = ({
  frequencyDetails,
  onFrequencyDetailsChange,
}) => {
  const toggleDate = (date: MonthlyDate) => {
    const dates = frequencyDetails.monthly.dates.includes(date)
      ? frequencyDetails.monthly.dates.filter(d => d !== date)
      : [...frequencyDetails.monthly.dates, date];
    onFrequencyDetailsChange({monthly: {dates}});
  };

  return (
    <ViewX style={styles.container} flexDirection="row" flexWrap="wrap" gap={8}>
      {MONTHLY_DATES.map(date => (
        <TouchableX
          key={date}
          style={[
            styles.dateButton,
            {
              backgroundColor: frequencyDetails.monthly.dates.includes(date)
                ? '#34C759'
                : '#3A3A3C',
            },
          ]}
          onPress={() => toggleDate(date)}>
          <TextX
            fontSize="md"
            fontWeight={
              frequencyDetails.monthly.dates.includes(date)
                ? 'semibold'
                : 'regular'
            }>
            {date}
          </TextX>
        </TouchableX>
      ))}
    </ViewX>
  );
};

// Main component
interface FrequencyDetailInputProps
  extends Omit<BaseProps, 'frequencyDetails'> {
  frequency: FrequencyType;
  frequencyDetails: FrequencyDetails;
  setShowTimePicker: (show: boolean) => void;
}

const FrequencyDetailInput: React.FC<FrequencyDetailInputProps> = ({
  frequency,
  frequencyDetails,
  onFrequencyDetailsChange,
  setShowTimePicker,
}) => {
  const components: Record<
    FrequencyType,
    React.FC<BaseProps | DailyFrequencyProps>
  > = {
    hourly: HourlyFrequency,
    daily: props => (
      <DailyFrequency
        {...props}
        onTimePickerPress={() => setShowTimePicker(true)}
      />
    ),
    weekly: WeeklyFrequency,
    monthly: MonthlyFrequency,
  };

  const Component = components[frequency];
  return Component ? (
    <Component
      frequencyDetails={frequencyDetails}
      onFrequencyDetailsChange={onFrequencyDetailsChange}
    />
  ) : null;
};

export type {
  DailyDetails,
  FrequencyDetails,
  FrequencyType,
  HourlyDetails,
  MonthlyDate,
  MonthlyDetails,
  WeekDay,
  WeeklyDetails,
};

export default FrequencyDetailInput;
