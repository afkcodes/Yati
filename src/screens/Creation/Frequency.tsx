import DateTimePicker from '@react-native-community/datetimepicker';
import {Calendar, Check, ChevronRight, Clock} from 'lucide-react-native';
import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {FREQUENCIES, Frequency, WEEKDAYS} from './data';

interface FrequencyDetails {
  hourly: {interval: number};
  daily: {timeOfDay: Date};
  weekly: {days: string[]};
  monthly: {dates: number[]};
}

interface FrequencySelectorProps {
  frequency: Frequency;
  frequencyDetails: FrequencyDetails;
  onFrequencyChange: (frequency: Frequency) => void;
  onFrequencyDetailsChange: (details: Partial<FrequencyDetails>) => void;
}

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  frequency,
  frequencyDetails,
  onFrequencyChange,
  onFrequencyDetailsChange,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Get display text based on current frequency and details
  const getDisplayText = () => {
    switch (frequency) {
      case 'hourly':
        return `Every ${frequencyDetails.hourly.interval} hours`;
      case 'daily':
        return `Daily at ${frequencyDetails.daily.timeOfDay.toLocaleTimeString(
          [],
          {
            hour: '2-digit',
            minute: '2-digit',
          },
        )}`;
      case 'weekly':
        return `Weekly on ${frequencyDetails.weekly.days.join(', ')}`;
      case 'monthly':
        return `Monthly on date${
          frequencyDetails.monthly.dates.length > 1 ? 's' : ''
        }: ${frequencyDetails.monthly.dates.join(', ')}`;
      default:
        return 'Set frequency';
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      onFrequencyDetailsChange({
        daily: {timeOfDay: selectedDate},
      });
    }
  };

  const renderFrequencyOptions = () => (
    <View style={styles.optionsContainer}>
      {FREQUENCIES.map(({id, label, icon: Icon}) => (
        <TouchableOpacity
          key={id}
          style={styles.optionButton}
          onPress={() => {
            onFrequencyChange(id);
            setShowOptions(false);
          }}>
          <View style={styles.optionContent}>
            <Icon size={20} color={frequency === id ? '#34C759' : '#FFFFFF'} />
            <Text style={styles.optionText}>{label}</Text>
          </View>
          {frequency === id && <Check size={20} color="#34C759" />}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDetailInput = () => {
    switch (frequency) {
      case 'hourly':
        return (
          <View style={styles.detailRow}>
            <TextInput
              style={styles.hourlyInput}
              value={frequencyDetails.hourly.interval.toString()}
              onChangeText={text => {
                const interval = parseInt(text) || 1;
                onFrequencyDetailsChange({
                  hourly: {interval},
                });
              }}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor="#8E8E93"
            />
            <Text style={styles.hourlyText}>hours</Text>
          </View>
        );

      case 'daily':
        return (
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimePicker(true)}>
            <Clock size={20} color="#FFFFFF" />
            <Text style={styles.timeText}>
              {frequencyDetails.daily.timeOfDay.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>
        );

      case 'weekly':
        return (
          <View style={styles.weekDayPicker}>
            {WEEKDAYS.map(day => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  frequencyDetails.weekly.days.includes(day) &&
                    styles.dayButtonSelected,
                ]}
                onPress={() => {
                  const days = frequencyDetails.weekly.days.includes(day)
                    ? frequencyDetails.weekly.days.filter(d => d !== day)
                    : [...frequencyDetails.weekly.days, day];
                  onFrequencyDetailsChange({weekly: {days}});
                }}>
                <Text
                  style={[
                    styles.dayText,
                    frequencyDetails.weekly.days.includes(day) &&
                      styles.dayTextSelected,
                  ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'monthly':
        return (
          <View style={styles.monthlyPicker}>
            {[1, 5, 10, 15, 20, 25].map(date => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateButton,
                  frequencyDetails.monthly.dates.includes(date) &&
                    styles.dateButtonSelected,
                ]}
                onPress={() => {
                  const dates = frequencyDetails.monthly.dates.includes(date)
                    ? frequencyDetails.monthly.dates.filter(d => d !== date)
                    : [...frequencyDetails.monthly.dates, date];
                  onFrequencyDetailsChange({monthly: {dates}});
                }}>
                <Text
                  style={[
                    styles.dateText,
                    frequencyDetails.monthly.dates.includes(date) &&
                      styles.dateTextSelected,
                  ]}>
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Repeat</Text>

      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => setShowOptions(true)}>
        <View style={styles.mainButtonContent}>
          <Calendar size={20} color="#FFFFFF" />
          <Text style={styles.selectedText}>{getDisplayText()}</Text>
        </View>
        <ChevronRight size={20} color="#8E8E93" />
      </TouchableOpacity>

      {renderDetailInput()}

      <Modal
        visible={showOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Frequency</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowOptions(false)}>
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            {renderFrequencyOptions()}
          </View>
        </View>
      </Modal>

      {showTimePicker && (
        <DateTimePicker
          value={frequencyDetails.daily.timeOfDay}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2C2C2E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  mainButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedText: {
    fontSize: 17,
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#34C759',
    fontSize: 17,
    fontWeight: '600',
  },
  optionsContainer: {
    padding: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 17,
    color: '#FFFFFF',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
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
  hourlyText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  weekDayPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
  },
  dayButton: {
    padding: 12,
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
    minWidth: 45,
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#34C759',
  },
  dayText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  dayTextSelected: {
    fontWeight: '600',
  },
  monthlyPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
  },
  dateButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
  },
  dateButtonSelected: {
    backgroundColor: '#34C759',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  dateTextSelected: {
    fontWeight: '600',
  },
});

export default FrequencySelector;
