import {Check} from 'lucide-react-native';
import {TextX, TouchableX, ViewX} from '~components/common';
import {closeModal} from '~hooks/useModalControl';
import {FREQUENCIES, Frequency} from '../data';

const renderFrequencyOptions = (
  frequency: Frequency,
  onFrequencyChange: (frequency: Frequency) => void,
) => (
  <ViewX padding={16}>
    {FREQUENCIES.map(({id, label, icon: Icon}) => (
      <TouchableX
        key={id}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        padding={16}
        borderBottomWidth={1}
        borderBottomColor="#2C2C2E"
        onPress={() => {
          onFrequencyChange(id);
          closeModal();
        }}>
        <ViewX flexDirection="row" alignItems="center" gap={12}>
          <Icon size={20} color={frequency === id ? '#34C759' : '#FFFFFF'} />
          <TextX fontSize="lg">{label}</TextX>
        </ViewX>
        {frequency === id && <Check size={20} color="#34C759" />}
      </TouchableX>
    ))}
  </ViewX>
);

const FrequencyModalContent = ({
  frequency,
  onFrequencyChange,
}: {
  frequency: Frequency;
  onFrequencyChange: (frequency: Frequency) => void;
}) => {
  return (
    <ViewX
      flex={1}
      justifyContent="flex-end"
      backgroundColor="rgba(0, 0, 0, 0.5)">
      <ViewX backgroundColor="#1C1C1E" paddingBottom={32}>
        <ViewX
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          padding={16}
          borderBottomWidth={1}
          borderBottomColor="#2C2C2E">
          <TextX fontSize="lg" fontWeight="semibold">
            Set Frequency
          </TextX>
          <TouchableX
            padding={8}
            onPress={() => {
              closeModal();
            }}>
            <TextX fontSize="lg" fontWeight="semibold" color="accent">
              Done
            </TextX>
          </TouchableX>
        </ViewX>
        {renderFrequencyOptions(frequency, onFrequencyChange)}
      </ViewX>
    </ViewX>
  );
};

export default FrequencyModalContent;
