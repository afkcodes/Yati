import {
  Check,
  CheckCircle2,
  ChevronRight,
  Hash,
  ListChecks,
  Plus,
  Timer,
  Trash2,
} from 'lucide-react-native';
import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {EVALUATION_TYPES, EvaluationType} from './data';

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

export const EvaluationTypeSelector: React.FC<EvaluationTypeSelectorProps> = ({
  evaluationType,
  evaluationDetails,
  onTypeChange,
  onDetailsChange,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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

  const renderEvaluationOptions = () => (
    <View style={styles.optionsContainer}>
      {Object.entries(EVALUATION_CONFIG).map(([type, config]) => {
        const Icon = config.icon;
        const isSelected = evaluationType === type;

        return (
          <TouchableOpacity
            key={type}
            style={[styles.optionButton, {borderColor: config.color}]}
            onPress={() => {
              onTypeChange(type as EvaluationType);
              setShowOptions(false);
              if (type !== 'boolean') {
                setShowDetails(true);
              }
            }}>
            <View style={styles.optionContent}>
              <Icon size={24} color={config.color} />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>
                  {EVALUATION_TYPES.find(t => t.id === type)?.label}
                </Text>
                <Text style={styles.optionDescription}>{config.example}</Text>
              </View>
            </View>
            {isSelected && <Check size={20} color={config.color} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderDetailInput = () => {
    const config = EVALUATION_CONFIG[evaluationType];
    const Icon = config.icon;

    switch (evaluationType) {
      case 'numeric':
        return (
          <View style={styles.detailContainer}>
            <Text style={styles.detailTitle}>Set Target</Text>
            <View style={styles.numericInputContainer}>
              <TextInput
                style={styles.numericInput}
                value={evaluationDetails.numeric.goal}
                onChangeText={text =>
                  onDetailsChange({
                    numeric: {...evaluationDetails.numeric, goal: text},
                  })
                }
                keyboardType="numeric"
                placeholder="Amount"
                placeholderTextColor="#8E8E93"
              />
              <TextInput
                style={styles.unitInput}
                value={evaluationDetails.numeric.unit}
                onChangeText={text =>
                  onDetailsChange({
                    numeric: {...evaluationDetails.numeric, unit: text},
                  })
                }
                placeholder="Unit (e.g., steps)"
                placeholderTextColor="#8E8E93"
              />
            </View>
          </View>
        );

      case 'timer':
        return (
          <View style={styles.detailContainer}>
            <Text style={styles.detailTitle}>Set Duration</Text>
            <View style={styles.timerInputContainer}>
              <TextInput
                style={styles.numericInput}
                value={evaluationDetails.timer.goal.toString()}
                onChangeText={text =>
                  onDetailsChange({
                    timer: {
                      ...evaluationDetails.timer,
                      goal: parseInt(text) || 0,
                    },
                  })
                }
                keyboardType="numeric"
                placeholder="Duration"
                placeholderTextColor="#8E8E93"
              />
              <TouchableOpacity
                style={styles.unitSelector}
                onPress={() =>
                  onDetailsChange({
                    timer: {
                      ...evaluationDetails.timer,
                      unit:
                        evaluationDetails.timer.unit === 'minutes'
                          ? 'hours'
                          : 'minutes',
                    },
                  })
                }>
                <Text style={styles.unitSelectorText}>
                  {evaluationDetails.timer.unit}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'checklist':
        return (
          <View style={styles.detailContainer}>
            <Text style={styles.detailTitle}>Checklist Items</Text>
            {evaluationDetails.checklist.items.map((item, index) => (
              <View key={index} style={styles.checklistItemContainer}>
                <TextInput
                  style={styles.checklistInput}
                  value={item}
                  onChangeText={text => {
                    const newItems = [...evaluationDetails.checklist.items];
                    newItems[index] = text;
                    onDetailsChange({
                      checklist: {items: newItems},
                    });
                  }}
                  placeholder={`Item ${index + 1}`}
                  placeholderTextColor="#8E8E93"
                />
                <TouchableOpacity
                  onPress={() => {
                    const newItems = evaluationDetails.checklist.items.filter(
                      (_, i) => i !== index,
                    );
                    onDetailsChange({
                      checklist: {items: newItems},
                    });
                  }}>
                  <Trash2 size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addItemButton}
              onPress={() => {
                const newItems = [...evaluationDetails.checklist.items, ''];
                onDetailsChange({
                  checklist: {items: newItems},
                });
              }}>
              <Plus size={20} color="#34C759" />
              <Text style={styles.addItemText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Track Progress</Text>

      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => setShowOptions(true)}>
        <View style={styles.mainButtonContent}>
          {(() => {
            const Icon = EVALUATION_CONFIG[evaluationType].icon;
            return (
              <Icon size={20} color={EVALUATION_CONFIG[evaluationType].color} />
            );
          })()}
          <Text style={styles.selectedText}>{getDisplayText()}</Text>
        </View>
        <ChevronRight size={20} color="#8E8E93" />
      </TouchableOpacity>

      {evaluationType !== 'boolean' && renderDetailInput()}

      <Modal
        visible={showOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Track Progress</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowOptions(false)}>
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            {renderEvaluationOptions()}
          </View>
        </View>
      </Modal>
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
    maxHeight: '80%',
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
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#8E8E93',
  },
  detailContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  numericInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  numericInput: {
    flex: 1,
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 17,
  },
  unitInput: {
    flex: 2,
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 17,
  },
  timerInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  unitSelector: {
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
    padding: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  unitSelectorText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  checklistItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  checklistInput: {
    flex: 1,
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 17,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  addItemText: {
    color: '#34C759',
    fontSize: 17,
    fontWeight: '500',
  },
});
