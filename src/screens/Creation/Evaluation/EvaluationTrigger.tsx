import {
  CheckCircle2,
  ChevronRight,
  Hash,
  ListChecks,
  Timer,
} from 'lucide-react-native';
import React from 'react';
import {TextX, TouchableX, ViewX} from '~components/common';
import {useModalControl} from '~hooks/useModalControl';
import {EvaluationType} from '../data';
import EvaluationDetailInput from './EvaluationDetailInput';
import EvaluationSelectModal from './EvaluationSelectModal';

interface EvaluationDetails {
  numeric: {goal: string; unit: string};
  timer: {goal: number; unit: 'minutes' | 'hours'};
  checklist: {items: string[]};
}

interface EvaluationTypeSelectorProps {
  evaluationType: EvaluationType;
  evaluationDetails: EvaluationDetails;
  onTypeChange: (type: EvaluationType) => void;
  onDetailsChange: (details: Partial<EvaluationDetails>) => void;
}

const EVALUATION_CONFIG: any = {
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

export const EvaluationTypeSelector: React.FC<EvaluationTypeSelectorProps> = ({
  evaluationType,
  evaluationDetails,
  onTypeChange,
  onDetailsChange,
}) => {
  const getDisplayText = () => {
    switch (evaluationType) {
      case 'boolean':
        return 'Simple yes/no completion';
      case 'numeric':
        return evaluationDetails.numeric.goal
          ? `${evaluationDetails.numeric.goal} ${evaluationDetails.numeric.unit}`
          : 'Track a number';
      case 'timer':
        return evaluationDetails.timer.goal
          ? `${evaluationDetails.timer.goal} ${evaluationDetails.timer.unit}`
          : 'Track duration';
      case 'checklist':
        return `${evaluationDetails.checklist.items.length} items checklist`;
      default:
        return 'Set tracking method';
    }
  };

  const openEvaluationModal = useModalControl(
    EvaluationSelectModal,
    {evaluationType, onTypeChange},
    {isOpen: true},
  );

  return (
    <>
      <ViewX>
        <TextX fontSize="lg" fontWeight="semibold" marginBottom={12}>
          Track Progress
        </TextX>

        <TouchableX
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="#2C2C2E"
          padding={16}
          borderRadius={12}
          marginBottom={16}
          onPress={openEvaluationModal}>
          <ViewX flexDirection="row" alignItems="center" gap={12}>
            {(() => {
              const Icon = EVALUATION_CONFIG[evaluationType].icon;
              return (
                <Icon
                  size={20}
                  color={EVALUATION_CONFIG[evaluationType].color}
                />
              );
            })()}
            <TextX fontSize="lg">{getDisplayText()}</TextX>
          </ViewX>
          <ChevronRight size={20} color="#8E8E93" />
        </TouchableX>

        {evaluationType !== 'boolean' && (
          <EvaluationDetailInput
            evaluationDetails={evaluationDetails}
            evaluationType={evaluationType}
            onDetailsChange={onDetailsChange}
          />
        )}
      </ViewX>
    </>
  );
};
