import {
  Check,
  CheckCircle2,
  Hash,
  ListChecks,
  Timer,
} from 'lucide-react-native';
import {TextX, TouchableX, ViewX} from '~components/common';
import {closeModal} from '~hooks/useModalControl';
import {EVALUATION_TYPES, EvaluationType} from '../data';

const EVALUATION_CONFIG = {
  boolean: {
    icon: CheckCircle2,
    color: '#34C759',
    example: 'Simple yes/no completion',
  },
  numeric: {
    icon: Hash,
    color: '#5856D6',
    example: 'e.g., 5000 steps, 3 glasses of water',
  },
  timer: {
    icon: Timer,
    color: '#FF9500',
    example: 'e.g., 30 minutes of reading',
  },
  checklist: {
    icon: ListChecks,
    color: '#FF2D55',
    example: 'e.g., Morning routine tasks',
  },
};

interface EvaluationTypeSelectorProps {
  evaluationType: EvaluationType;
  onTypeChange: (type: EvaluationType) => void;
}

const EvaluationSelectModal: React.FC<EvaluationTypeSelectorProps> = ({
  evaluationType,
  onTypeChange,
}) => {
  const handleSelectType = (type: EvaluationType) => {
    onTypeChange(type);
    closeModal();
  };

  return (
    <ViewX
      backgroundColor="#1C1C1E"
      borderTopLeftRadius={12}
      borderTopRightRadius={12}
      paddingBottom={32}>
      <ViewX
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        padding={16}
        borderBottomWidth={1}
        borderBottomColor="#2C2C2E">
        <TextX fontSize="lg" fontWeight="semibold">
          Track Progress
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

      <ViewX padding={16} gap={12}>
        {Object.entries(EVALUATION_CONFIG).map(([type, config]) => {
          const Icon = config.icon;
          const isSelected = evaluationType === type;
          return (
            <TouchableX
              key={type}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              padding={16}
              backgroundColor="#2C2C2E"
              borderRadius={12}
              borderWidth={1}
              borderColor={isSelected ? config.color : 'transparent'}
              onPress={() => handleSelectType(type as EvaluationType)}>
              <ViewX flexDirection="row" alignItems="center" gap={12} flex={1}>
                <Icon size={24} color={config.color} />
                <ViewX flex={1}>
                  <TextX fontSize="lg" fontWeight="semibold" marginBottom={4}>
                    {EVALUATION_TYPES.find(t => t.id === type)?.label}
                  </TextX>
                  <TextX fontSize="sm" color="tertiary">
                    {config.example}
                  </TextX>
                </ViewX>
              </ViewX>
              {isSelected && <Check size={20} color={config.color} />}
            </TouchableX>
          );
        })}
      </ViewX>
    </ViewX>
  );
};

export default EvaluationSelectModal;
