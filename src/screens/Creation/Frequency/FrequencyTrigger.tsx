import DateTimePicker from '@react-native-community/datetimepicker';
import {Calendar, ChevronRight} from 'lucide-react-native';
import {useState} from 'react';
import {TextX, TouchableX, ViewX} from '~components/common';
import {useModalControl} from '~hooks/useModalControl';
import {Frequency} from '../data';
import FrequencyDetailInput from './FrequencyDetail';
import FrequencyModalContent from './FrequencyModalContent';

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

const getDisplayText = (
  frequency: Frequency,
  frequencyDetails: FrequencyDetails,
) => {
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

const FrequencyTrigger: React.FC<FrequencySelectorProps> = ({
  frequencyDetails,
  frequency,
  onFrequencyDetailsChange,
  onFrequencyChange,
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      onFrequencyDetailsChange({
        daily: {timeOfDay: selectedDate},
      });
    }
  };

  const openFrequencyModal = useModalControl(
    FrequencyModalContent,
    {frequency, onFrequencyChange},
    {isOpen: true},
  );

  return (
    <ViewX marginVertical={16}>
      <TextX fontSize="lg" fontWeight="semibold" marginBottom={12}>
        Repeat
      </TextX>

      <TouchableX
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="#2C2C2E"
        padding={16}
        borderRadius={12}
        marginBottom={16}
        onPress={openFrequencyModal}>
        <ViewX flexDirection="row" alignItems="center" gap={12}>
          <Calendar size={20} color="#FFFFFF" />
          <TextX fontSize="lg">
            {getDisplayText(frequency, frequencyDetails)}
          </TextX>
        </ViewX>
        <ChevronRight size={20} color="#8E8E93" />
      </TouchableX>

      <FrequencyDetailInput
        frequency={frequency}
        frequencyDetails={frequencyDetails}
        setShowTimePicker={setShowTimePicker}
        onFrequencyDetailsChange={onFrequencyDetailsChange}
      />
      {showTimePicker && (
        <DateTimePicker
          value={frequencyDetails.daily.timeOfDay}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={handleTimeChange}
        />
      )}
    </ViewX>
  );
};

export default FrequencyTrigger;
