import {Plus, Trash2} from 'lucide-react-native';
import {StyleProp, StyleSheet, TextInput, ViewStyle} from 'react-native';
import {TextX, TouchableX, ViewX} from '~components/common';
import {themes} from '~styles/theme';

// Type definitions
interface NumericDetails {
  goal: string;
  unit: string;
}

interface TimerDetails {
  goal: number;
  unit: 'minutes' | 'hours';
}

interface ChecklistDetails {
  items: string[];
}

interface EvaluationDetails {
  numeric: NumericDetails;
  timer: TimerDetails;
  checklist: ChecklistDetails;
}

type EvaluationType = keyof EvaluationDetails;

interface BaseProps {
  evaluationDetails: EvaluationDetails;
  onDetailsChange: (details: Partial<EvaluationDetails>) => void;
}

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 17,
  },
  title: {
    // fontSize: 'md',
    // fontWeight: 'semibold',
    marginBottom: 12,
  },
});

// Common input component
interface EvaluationInputProps extends React.ComponentProps<typeof TextInput> {
  style?: StyleProp<ViewStyle>;
}

const EvaluationInput: React.FC<EvaluationInputProps> = ({style, ...props}) => (
  <TextInput
    style={[styles.input, style]}
    placeholderTextColor="#8E8E93"
    {...props}
  />
);

// Numeric evaluation component
const NumericEvaluation: React.FC<BaseProps> = ({
  evaluationDetails,
  onDetailsChange,
}) => {
  const {goal, unit} = evaluationDetails.numeric;

  return (
    <ViewX style={styles.container}>
      <TextX style={styles.title} fontSize="md" fontWeight="semibold">
        Set Target
      </TextX>
      <ViewX flexDirection="row" gap={12}>
        <EvaluationInput
          value={goal}
          onChangeText={(text: string) =>
            onDetailsChange({
              numeric: {...evaluationDetails.numeric, goal: text},
            })
          }
          keyboardType="numeric"
          placeholder="Amount"
        />
        <EvaluationInput
          style={{flex: 2}}
          value={unit}
          onChangeText={(text: string) =>
            onDetailsChange({
              numeric: {...evaluationDetails.numeric, unit: text},
            })
          }
          placeholder="Unit (e.g., steps)"
        />
      </ViewX>
    </ViewX>
  );
};

// Timer evaluation component
const TimerEvaluation: React.FC<BaseProps> = ({
  evaluationDetails,
  onDetailsChange,
}) => {
  const {goal, unit} = evaluationDetails.timer;

  const toggleUnit = () => {
    const newUnit: TimerDetails['unit'] =
      unit === 'minutes' ? 'hours' : 'minutes';
    onDetailsChange({
      timer: {
        ...evaluationDetails.timer,
        unit: newUnit,
      },
    });
  };

  return (
    <ViewX style={styles.container}>
      <TextX style={styles.title}>Set Duration</TextX>
      <ViewX flexDirection="row" gap={12}>
        <EvaluationInput
          value={goal.toString()}
          onChangeText={(text: string) =>
            onDetailsChange({
              timer: {
                ...evaluationDetails.timer,
                goal: parseInt(text, 10) || 0,
              },
            })
          }
          keyboardType="numeric"
          placeholder="Duration"
        />
        <TouchableX
          backgroundColor="#3A3A3C"
          borderRadius={8}
          padding={12}
          minWidth={100}
          alignItems="center"
          onPress={toggleUnit}>
          <TextX fontSize="lg">{unit}</TextX>
        </TouchableX>
      </ViewX>
    </ViewX>
  );
};

// Checklist item component
interface ChecklistItemProps {
  item: string;
  index: number;
  onUpdate: (index: number, text: string) => void;
  onDelete: (index: number) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  index,
  onUpdate,
  onDelete,
}) => (
  <ViewX flexDirection="row" alignItems="center" gap={12} marginBottom={8}>
    <EvaluationInput
      value={item}
      onChangeText={(text: string) => onUpdate(index, text)}
      placeholder={`Item ${index + 1}`}
    />
    <TouchableX onPress={() => onDelete(index)}>
      <Trash2 size={20} color="#FF3B30" />
    </TouchableX>
  </ViewX>
);

// Checklist evaluation component
const ChecklistEvaluation: React.FC<BaseProps> = ({
  evaluationDetails,
  onDetailsChange,
}) => {
  const {items} = evaluationDetails.checklist;

  const updateItem = (index: number, text: string) => {
    const newItems = [...items];
    newItems[index] = text;
    onDetailsChange({
      checklist: {items: newItems},
    });
  };

  const deleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onDetailsChange({
      checklist: {items: newItems},
    });
  };

  const addItem = () => {
    const newItems = [...items, ''];
    onDetailsChange({
      checklist: {items: newItems},
    });
  };

  return (
    <ViewX style={styles.container}>
      <TextX style={styles.title}>Checklist Items</TextX>
      {items.map((item, index) => (
        <ChecklistItem
          key={index}
          item={item}
          index={index}
          onUpdate={updateItem}
          onDelete={deleteItem}
        />
      ))}
      <TouchableX
        flexDirection="row"
        alignItems="center"
        gap={8}
        paddingVertical={12}
        onPress={addItem}>
        <Plus size={20} color={themes.dark.background.accent} />
        <TextX color="accent" fontSize="lg" fontWeight="medium">
          Add Item
        </TextX>
      </TouchableX>
    </ViewX>
  );
};

// Main component
interface EvaluationDetailInputProps extends BaseProps {
  evaluationType: EvaluationType;
}

const EvaluationDetailInput: React.FC<EvaluationDetailInputProps> = ({
  evaluationType,
  evaluationDetails,
  onDetailsChange,
}) => {
  const components: Record<EvaluationType, React.FC<BaseProps>> = {
    numeric: NumericEvaluation,
    timer: TimerEvaluation,
    checklist: ChecklistEvaluation,
  };

  const Component = components[evaluationType];
  return Component ? (
    <Component
      evaluationDetails={evaluationDetails}
      onDetailsChange={onDetailsChange}
    />
  ) : null;
};

export type {
  ChecklistDetails,
  EvaluationDetails,
  EvaluationType,
  NumericDetails,
  TimerDetails,
};

export default EvaluationDetailInput;
