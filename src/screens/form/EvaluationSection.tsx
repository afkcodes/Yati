/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
// components/habit/form/EvaluationSection.tsx
import {LegendList} from '@legendapp/list';
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Edit2,
  Hash,
  ListChecks,
  Plus,
  Timer,
  X,
} from 'lucide-react-native';
import React, {useState} from 'react';
import {Modal, StyleSheet, TextInput} from 'react-native';
import {TextX, TouchableX, ViewX} from '~/components/common';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';
import {ChecklistItem, EvaluationType} from '~/types/habit.types';
import {
  COMMON_UNITS,
  EVALUATION_TYPES,
  TIME_UNITS,
} from '~/utils/constants/habitConstants';
import {SectionLabel} from './BasicInfo';

interface EvaluationData {
  type: EvaluationType;
  target: number;
  unit: string;
  checklistItems?: ChecklistItem[];
}

interface EvaluationSectionProps {
  evaluation: EvaluationData;
  onUpdateEvaluation: (evaluation: EvaluationData) => void;
  onAddChecklistItem: (text: string) => void;
  onUpdateChecklistItem: (itemId: string, text: string) => void;
  onRemoveChecklistItem: (itemId: string) => void;
  error?: string;
}

const EvaluationSection: React.FC<EvaluationSectionProps> = ({
  evaluation,
  onUpdateEvaluation,
  onAddChecklistItem,
  onUpdateChecklistItem,
  onRemoveChecklistItem,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [checklistModalVisible, setChecklistModalVisible] = useState(false);
  const [unitsListModalVisible, setUnitsListModalVisible] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [customUnitInput, setCustomUnitInput] = useState('');
  const [editingChecklistItem, setEditingChecklistItem] =
    useState<ChecklistItem | null>(null);

  const {theme} = useTheme();

  const bgColor = getThemeColor(theme, 'background', 'base');
  const surfaceColor = getThemeColor(theme, 'background', 'surface');
  const fieldColor = getThemeColor(theme, 'background', 'field');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const accentColor = getThemeColor(theme, 'text', 'accent');
  const textPrimary = getThemeColor(theme, 'text', 'primary');
  const textSecondary = getThemeColor(theme, 'text', 'secondary');
  const textPlaceholder = getThemeColor(theme, 'text', 'tertiary');
  const errorColor = getThemeColor(theme, 'text', 'error');

  const handleSelectType = (type: EvaluationType) => {
    // Initialize appropriate defaults based on type
    let newEvaluation: EvaluationData;

    if (type === 'checklist') {
      newEvaluation = {
        type,
        target: evaluation.checklistItems?.length || 0,
        unit: '',
        checklistItems: evaluation.checklistItems || [],
      };
    } else if (type === 'timer') {
      newEvaluation = {
        type,
        target: 30, // Default to 30 minutes
        unit: 'minutes',
      };
    } else if (type === 'numeric') {
      newEvaluation = {
        type,
        target: 1, // Default to 1
        unit: '',
      };
    } else {
      newEvaluation = {
        type,
        target: 1,
        unit: '',
      };
    }

    onUpdateEvaluation(newEvaluation);
    setModalVisible(false);
  };

  const handleUpdateTarget = (increment: boolean) => {
    const currentTarget = evaluation.target || 0;
    const step = evaluation.type === 'timer' ? 5 : 1;
    const max =
      evaluation.type === 'checklist'
        ? evaluation.checklistItems?.length || 0
        : 999;

    const newTarget = increment
      ? Math.min(max, currentTarget + step)
      : Math.max(0, currentTarget - step);

    onUpdateEvaluation({
      ...evaluation,
      target: newTarget,
    });
  };

  const handleUpdateUnit = (unit: string) => {
    onUpdateEvaluation({
      ...evaluation,
      unit,
    });
    setUnitModalVisible(false);
    setUnitsListModalVisible(false);
  };

  const handleCustomUnitSubmit = () => {
    if (customUnitInput.trim()) {
      onUpdateEvaluation({
        ...evaluation,
        unit: customUnitInput.trim(),
      });
      setCustomUnitInput('');
      setUnitsListModalVisible(false);
    }
  };

  const handleAddChecklistItemSubmit = () => {
    if (newItemText.trim()) {
      if (editingChecklistItem) {
        // Update existing item
        onUpdateChecklistItem(editingChecklistItem.id, newItemText.trim());
        setEditingChecklistItem(null);
      } else {
        // Add new item
        onAddChecklistItem(newItemText);
      }
      setNewItemText('');
    }
  };

  const handleEditChecklistItem = (item: ChecklistItem) => {
    setEditingChecklistItem(item);
    setNewItemText(item.text);
  };

  const getEvaluationTypeLabel = (): string => {
    const type = EVALUATION_TYPES.find(t => t.id === evaluation.type);
    return type?.label || 'Select tracking method';
  };

  const getEvaluationIcon = () => {
    const type = EVALUATION_TYPES.find(t => t.id === evaluation.type);
    return (type?.icon ||
      'CheckCircle2') as keyof typeof import('lucide-react-native');
  };

  // Get the icon component
  const IconComponent =
    evaluation.type === 'boolean'
      ? CheckCircle2
      : evaluation.type === 'numeric'
      ? Hash
      : evaluation.type === 'timer'
      ? Timer
      : evaluation.type === 'checklist'
      ? ListChecks
      : CheckCircle2;

  return (
    <ViewX marginBottom={styleUtils.spacing.xl}>
      <ViewX
        flexDirection="row"
        alignItems="center"
        marginBottom={styleUtils.spacing.xs}>
        <SectionLabel title="Track Progress" />
      </ViewX>

      <TouchableX
        height={44}
        borderRadius={styleUtils.borderRadius.xs}
        borderWidth={error ? 2 : 1}
        paddingHorizontal={styleUtils.spacing.sm}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor={fieldColor}
        borderColor={error ? errorColor : borderColor}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Select tracking method"
        accessibilityHint="Choose how to track your habit progress">
        <ViewX flexDirection="row" alignItems="center">
          <IconComponent size={16} color={textSecondary} strokeWidth={1.5} />
          <TextX
            fontSize="sm"
            color="primary"
            marginLeft={styleUtils.spacing.xs}>
            {getEvaluationTypeLabel()}
          </TextX>
        </ViewX>
        <ChevronRight size={16} color={textPlaceholder} strokeWidth={1.5} />
      </TouchableX>

      {error && (
        <TextX fontSize="xs" color="error" marginTop={styleUtils.spacing.xs}>
          {error}
        </TextX>
      )}

      {/* Numeric Target Config */}
      {evaluation.type === 'numeric' && (
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
              Target Amount
            </TextX>
          </ViewX>

          <ViewX flexDirection="row" alignItems="center">
            {/* Decrement button */}
            <TouchableX
              width={36}
              height={36}
              borderRadius={18}
              justifyContent="center"
              alignItems="center"
              backgroundColor={withAlpha(fieldColor, 0.7)}
              onPress={() => handleUpdateTarget(false)}
              disabled={evaluation.target <= 1}
              opacity={evaluation.target <= 1 ? 0.5 : 1}
              accessibilityLabel="Decrease target">
              <TextX fontSize="xl" fontWeight="semibold" color="tertiary">
                -
              </TextX>
            </TouchableX>

            {/* Target value */}
            <ViewX
              flex={1}
              flexDirection="row"
              justifyContent="center"
              alignItems="center">
              <TextX fontSize="2xl" fontWeight="bold" color="accent">
                {evaluation.target}
              </TextX>
            </ViewX>

            {/* Increment button */}
            <TouchableX
              width={36}
              height={36}
              borderRadius={18}
              justifyContent="center"
              alignItems="center"
              backgroundColor={withAlpha(fieldColor, 0.7)}
              onPress={() => handleUpdateTarget(true)}
              accessibilityLabel="Increase target">
              <TextX fontSize="xl" fontWeight="semibold" color="tertiary">
                +
              </TextX>
            </TouchableX>

            {/* Unit selector */}
            <ViewX marginLeft={styleUtils.spacing.md}>
              <TouchableX
                style={{
                  backgroundColor: withAlpha(fieldColor, 0.7),
                  paddingHorizontal: styleUtils.spacing.sm,
                  paddingVertical: styleUtils.spacing.xs,
                  borderRadius: styleUtils.borderRadius.xs,
                  borderWidth: 1,
                  borderColor,
                  minWidth: 100,
                }}
                onPress={() => setUnitsListModalVisible(true)}>
                <TextX
                  fontSize="md"
                  color={evaluation.unit ? 'primary' : 'tertiary'}
                  textAlign="center">
                  {evaluation.unit || 'Select unit'}
                </TextX>
              </TouchableX>
            </ViewX>
          </ViewX>

          <ViewX
            marginTop={styleUtils.spacing.sm}
            borderTopWidth={1}
            borderTopColor={withAlpha(borderColor, 0.3)}
            paddingTop={styleUtils.spacing.sm}>
            <TextX fontSize="xs" color="tertiary">
              {`Track ${evaluation.target} ${
                evaluation.unit || 'units'
              } each time.`}
            </TextX>
          </ViewX>
        </ViewX>
      )}

      {/* Timer Target Config */}
      {evaluation.type === 'timer' && (
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
              Duration Target
            </TextX>
            <TouchableX
              flexDirection="row"
              alignItems="center"
              backgroundColor={withAlpha(fieldColor, 0.7)}
              borderRadius={styleUtils.borderRadius.xs}
              paddingHorizontal={styleUtils.spacing.sm}
              paddingVertical={styleUtils.spacing.xs}
              borderWidth={1}
              borderColor={borderColor}
              onPress={() => setUnitModalVisible(true)}
              accessibilityLabel="Change time unit">
              <TextX
                fontSize="xs"
                color="primary"
                marginRight={styleUtils.spacing.xs}>
                {evaluation.unit === 'hours' ? 'Hours' : 'Minutes'}
              </TextX>
              <ChevronRight
                size={12}
                color={textPlaceholder}
                strokeWidth={1.5}
              />
            </TouchableX>
          </ViewX>

          <ViewX flexDirection="row" alignItems="center">
            <TouchableX
              width={36}
              height={36}
              borderRadius={18}
              justifyContent="center"
              alignItems="center"
              backgroundColor={withAlpha(fieldColor, 0.7)}
              onPress={() => handleUpdateTarget(false)}
              accessibilityLabel="Decrease target"
              disabled={evaluation.target <= 5}
              opacity={evaluation.target <= 5 ? 0.5 : 1}>
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
                {evaluation.target}
              </TextX>
              <TextX
                fontSize="md"
                color="secondary"
                marginLeft={styleUtils.spacing.xs}
                marginBottom={2}>
                {evaluation.unit}
              </TextX>
            </ViewX>

            <TouchableX
              width={36}
              height={36}
              borderRadius={18}
              justifyContent="center"
              alignItems="center"
              backgroundColor={withAlpha(fieldColor, 0.7)}
              onPress={() => handleUpdateTarget(true)}
              accessibilityLabel="Increase target">
              <TextX fontSize="xl" fontWeight="semibold" color="tertiary">
                +
              </TextX>
            </TouchableX>
          </ViewX>

          <ViewX
            marginTop={styleUtils.spacing.sm}
            borderTopWidth={1}
            borderTopColor={withAlpha(borderColor, 0.3)}
            paddingTop={styleUtils.spacing.sm}>
            <TextX fontSize="xs" color="tertiary">
              {`Track ${evaluation.target} ${evaluation.unit} of activity each time.`}
            </TextX>
          </ViewX>
        </ViewX>
      )}

      {/* Checklist Config */}
      {evaluation.type === 'checklist' && (
        <ViewX
          marginTop={styleUtils.spacing.sm}
          backgroundColor={withAlpha(fieldColor, 0.3)}
          padding={styleUtils.spacing.sm}
          borderRadius={styleUtils.borderRadius.md}>
          <ViewX
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={styleUtils.spacing.xs}>
            <TextX fontSize="sm" fontWeight="medium" color="secondary">
              Task List
            </TextX>

            <TouchableX
              flexDirection="row"
              alignItems="center"
              backgroundColor={withAlpha(accentColor, 0.15)}
              paddingHorizontal={styleUtils.spacing.sm}
              paddingVertical={styleUtils.spacing.xs}
              borderRadius={styleUtils.borderRadius.xs}
              onPress={() => setChecklistModalVisible(true)}>
              <Plus size={14} color={accentColor} strokeWidth={1.5} />
              <TextX fontSize="xs" color="accent" marginLeft={4}>
                Manage Tasks
              </TextX>
            </TouchableX>
          </ViewX>

          {/* Target selector for checklist */}
          {evaluation.checklistItems &&
            evaluation.checklistItems.length > 0 && (
              <ViewX
                flexDirection="row"
                alignItems="center"
                marginBottom={styleUtils.spacing.sm}
                borderRadius={styleUtils.borderRadius.xs}
                backgroundColor={withAlpha(fieldColor, 0.5)}
                padding={styleUtils.spacing.xs}>
                <TextX fontSize="xs" color="secondary">
                  Complete
                </TextX>

                <ViewX
                  flexDirection="row"
                  alignItems="center"
                  marginHorizontal={styleUtils.spacing.xs}>
                  <TouchableX
                    width={24}
                    height={24}
                    borderRadius={12}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor={withAlpha(fieldColor, 0.7)}
                    onPress={() => handleUpdateTarget(false)}
                    accessibilityLabel="Decrease target"
                    disabled={evaluation.target <= 1}
                    opacity={evaluation.target <= 1 ? 0.5 : 1}>
                    <TextX fontSize="md" fontWeight="semibold" color="tertiary">
                      -
                    </TextX>
                  </TouchableX>

                  <TextX
                    fontSize="md"
                    fontWeight="bold"
                    color="accent"
                    marginHorizontal={styleUtils.spacing.xs}>
                    {evaluation.target}
                  </TextX>

                  <TouchableX
                    width={24}
                    height={24}
                    borderRadius={12}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor={withAlpha(fieldColor, 0.7)}
                    onPress={() => handleUpdateTarget(true)}
                    accessibilityLabel="Increase target"
                    disabled={
                      evaluation.target >= evaluation.checklistItems.length
                    }
                    opacity={
                      evaluation.target >= evaluation.checklistItems.length
                        ? 0.5
                        : 1
                    }>
                    <TextX fontSize="md" fontWeight="semibold" color="tertiary">
                      +
                    </TextX>
                  </TouchableX>
                </ViewX>

                <TextX fontSize="xs" color="secondary">
                  of {evaluation.checklistItems.length} tasks to mark habit as
                  complete
                </TextX>
              </ViewX>
            )}

          {/* Display checklist items */}
          {evaluation.checklistItems && evaluation.checklistItems.length > 0 ? (
            <ViewX>
              {evaluation.checklistItems.slice(0, 3).map(item => (
                <ViewX
                  key={item.id}
                  flexDirection="row"
                  alignItems="center"
                  paddingVertical={styleUtils.spacing.xs}
                  marginBottom={2}>
                  <CheckCircle2
                    size={14}
                    color={textPlaceholder}
                    strokeWidth={1.5}
                  />
                  <TextX
                    fontSize="xs"
                    color="tertiary"
                    marginLeft={styleUtils.spacing.xs}
                    numberOfLines={1}
                    flex={1}>
                    {item.text}
                  </TextX>
                </ViewX>
              ))}

              {evaluation.checklistItems.length > 3 && (
                <TextX
                  fontSize="xs"
                  color="tertiary"
                  marginTop={2}
                  fontStyle="italic">
                  ...and {evaluation.checklistItems.length - 3} more
                </TextX>
              )}
            </ViewX>
          ) : (
            <ViewX
              borderWidth={1}
              borderColor={withAlpha(borderColor, 0.3)}
              borderStyle="dashed"
              borderRadius={styleUtils.borderRadius.xs}
              padding={styleUtils.spacing.sm}
              alignItems="center"
              justifyContent="center">
              <TextX fontSize="xs" color="tertiary" textAlign="center">
                No tasks added yet. Tap "Manage Tasks" to add items to your
                checklist.
              </TextX>
            </ViewX>
          )}
        </ViewX>
      )}

      {/* Type Selection Modal */}
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
            maxHeight="85%"
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
                Tracking Method
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
              {EVALUATION_TYPES.map(option => {
                // Get the icon component
                const TypeIcon =
                  option.id === 'boolean'
                    ? CheckCircle2
                    : option.id === 'numeric'
                    ? Hash
                    : option.id === 'timer'
                    ? Timer
                    : option.id === 'checklist'
                    ? ListChecks
                    : CheckCircle2;

                return (
                  <TouchableX
                    key={option.id}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingVertical={12}
                    paddingHorizontal={16}
                    backgroundColor={
                      evaluation.type === option.id
                        ? withAlpha(accentColor, 0.07)
                        : 'transparent'
                    }
                    onPress={() =>
                      handleSelectType(option.id as EvaluationType)
                    }>
                    <ViewX flexDirection="row" alignItems="center" flex={1}>
                      <ViewX
                        width={32}
                        height={32}
                        borderRadius={8}
                        justifyContent="center"
                        alignItems="center"
                        backgroundColor={withAlpha(accentColor, 0.1)}
                        marginRight={12}>
                        <TypeIcon
                          size={16}
                          color={accentColor}
                          strokeWidth={1.5}
                        />
                      </ViewX>
                      <ViewX flex={1}>
                        <TextX
                          fontSize="sm"
                          fontWeight="medium"
                          color="primary">
                          {option.label}
                        </TextX>
                        <TextX fontSize="xs" color="tertiary">
                          {option.description}
                        </TextX>
                      </ViewX>
                    </ViewX>

                    {evaluation.type === option.id && (
                      <Check size={16} color={accentColor} strokeWidth={1.5} />
                    )}
                  </TouchableX>
                );
              })}
            </ViewX>
          </ViewX>
        </ViewX>
      </Modal>

      {/* Timer Unit Selection Modal */}
      <Modal
        visible={unitModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setUnitModalVisible(false)}>
        <ViewX
          flex={1}
          justifyContent="flex-end"
          backgroundColor={withAlpha(bgColor, 0.9)}>
          <ViewX
            borderTopLeftRadius={16}
            borderTopRightRadius={16}
            borderWidth={1}
            maxHeight="30%"
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
                Select Time Unit
              </TextX>
              <TouchableX
                paddingVertical={6}
                paddingHorizontal={10}
                onPress={() => setUnitModalVisible(false)}>
                <TextX fontSize="sm" fontWeight="medium" color="accent">
                  Cancel
                </TextX>
              </TouchableX>
            </ViewX>

            <ViewX paddingVertical={8}>
              {TIME_UNITS.map(unit => (
                <TouchableX
                  key={unit.id}
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingVertical={14}
                  paddingHorizontal={16}
                  backgroundColor={
                    evaluation.unit === unit.id
                      ? withAlpha(accentColor, 0.07)
                      : 'transparent'
                  }
                  onPress={() => handleUpdateUnit(unit.id)}>
                  <TextX fontSize="sm" color="primary">
                    {unit.label}
                  </TextX>

                  {evaluation.unit === unit.id && (
                    <Check size={16} color={accentColor} strokeWidth={1.5} />
                  )}
                </TouchableX>
              ))}
            </ViewX>
          </ViewX>
        </ViewX>
      </Modal>

      {/* Numeric Units Selection Modal */}
      <Modal
        visible={unitsListModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setUnitsListModalVisible(false)}>
        <ViewX
          flex={1}
          justifyContent="flex-end"
          backgroundColor={withAlpha(bgColor, 0.9)}>
          <ViewX
            borderTopLeftRadius={16}
            borderTopRightRadius={16}
            borderWidth={1}
            maxHeight="70%"
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
                Select Unit
              </TextX>
              <TouchableX
                paddingVertical={6}
                paddingHorizontal={10}
                onPress={() => setUnitsListModalVisible(false)}>
                <TextX fontSize="sm" fontWeight="medium" color="accent">
                  Cancel
                </TextX>
              </TouchableX>
            </ViewX>

            <ViewX style={{maxHeight: 350}}>
              <LegendList
                data={COMMON_UNITS}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <TouchableX
                    key={item.id}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    paddingVertical={14}
                    paddingHorizontal={16}
                    backgroundColor={
                      evaluation.unit === item.label
                        ? withAlpha(accentColor, 0.07)
                        : 'transparent'
                    }
                    onPress={() => {
                      if (item.id === 'custom') {
                        // Just focus on custom input field
                      } else {
                        handleUpdateUnit(item.label);
                      }
                    }}>
                    <TextX fontSize="sm" color="primary">
                      {item.label}
                    </TextX>

                    {evaluation.unit === item.label && (
                      <Check size={16} color={accentColor} strokeWidth={1.5} />
                    )}
                  </TouchableX>
                )}
                ListFooterComponent={
                  <ViewX
                    paddingHorizontal={16}
                    paddingVertical={16}
                    borderTopWidth={StyleSheet.hairlineWidth}
                    borderTopColor={withAlpha(borderColor, 0.3)}>
                    <TextX
                      fontSize="sm"
                      fontWeight="medium"
                      color="secondary"
                      marginBottom={8}>
                      Custom Unit
                    </TextX>
                    <ViewX flexDirection="row" alignItems="center">
                      <TextInput
                        style={{
                          flex: 1,
                          height: 44,
                          borderWidth: 1,
                          borderColor: borderColor,
                          borderRadius: 8,
                          color: textPrimary,
                          padding: 8,
                          backgroundColor: withAlpha(fieldColor, 0.7),
                          marginRight: 8,
                        }}
                        value={customUnitInput}
                        onChangeText={setCustomUnitInput}
                        placeholder="Enter custom unit"
                        placeholderTextColor={textPlaceholder}
                      />
                      <TouchableX
                        paddingHorizontal={12}
                        paddingVertical={10}
                        backgroundColor={withAlpha(accentColor, 0.15)}
                        borderRadius={8}
                        onPress={handleCustomUnitSubmit}
                        disabled={!customUnitInput.trim()}>
                        <TextX fontSize="sm" color="accent">
                          Add
                        </TextX>
                      </TouchableX>
                    </ViewX>
                  </ViewX>
                }
              />
            </ViewX>
          </ViewX>
        </ViewX>
      </Modal>

      <Modal
        visible={checklistModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setChecklistModalVisible(false);
          setEditingChecklistItem(null);
          setNewItemText('');
        }}>
        <ViewX
          flex={1}
          justifyContent="flex-end"
          backgroundColor={withAlpha(bgColor, 0.9)}>
          <ViewX
            borderTopLeftRadius={16}
            borderTopRightRadius={16}
            borderWidth={1}
            height="70%"
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
                {editingChecklistItem ? 'Edit Task' : 'Manage Tasks'}
              </TextX>
              <TouchableX
                paddingVertical={6}
                paddingHorizontal={10}
                onPress={() => {
                  setChecklistModalVisible(false);
                  setEditingChecklistItem(null);
                  setNewItemText('');
                }}>
                <TextX fontSize="sm" fontWeight="medium" color="accent">
                  Done
                </TextX>
              </TouchableX>
            </ViewX>

            <ViewX flex={1} paddingHorizontal={16}>
              {/* Section 1: Add/Edit Task */}
              <ViewX paddingVertical={16}>
                <TextX
                  fontSize="sm"
                  fontWeight="medium"
                  color="secondary"
                  marginBottom={8}>
                  {editingChecklistItem ? 'Edit Task' : 'Add New Task'}
                </TextX>

                <ViewX flexDirection="row" alignItems="center">
                  <TextInput
                    style={{
                      flex: 1,
                      height: 40,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      borderWidth: 1,
                      fontSize: 14,
                      marginRight: 8,
                      backgroundColor: withAlpha(fieldColor, 0.7),
                      color: textPrimary,
                      borderColor: borderColor,
                    }}
                    value={newItemText}
                    onChangeText={setNewItemText}
                    placeholder={
                      editingChecklistItem ? 'Edit task' : 'Add a new task'
                    }
                    placeholderTextColor={textPlaceholder}
                    returnKeyType="done"
                    onSubmitEditing={handleEditChecklistItem}
                  />
                  <TouchableX
                    width={40}
                    height={40}
                    borderRadius={8}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor={withAlpha(accentColor, 0.15)}
                    onPress={handleAddChecklistItemSubmit}>
                    {editingChecklistItem ? (
                      <Check size={16} color={accentColor} strokeWidth={1.5} />
                    ) : (
                      <Plus size={16} color={accentColor} strokeWidth={1.5} />
                    )}
                  </TouchableX>
                </ViewX>

                {editingChecklistItem && (
                  <TouchableX
                    paddingVertical={8}
                    marginTop={8}
                    onPress={() => {
                      setEditingChecklistItem(null);
                      setNewItemText('');
                    }}>
                    <TextX fontSize="xs" color="accent" textAlign="center">
                      Cancel Editing
                    </TextX>
                  </TouchableX>
                )}
              </ViewX>

              {/* Section divider */}
              <ViewX
                height={1}
                backgroundColor={withAlpha(borderColor, 0.5)}
                marginVertical={4}
              />

              {/* Section 2: Task List */}
              <ViewX flex={1} paddingTop={16} paddingBottom={24}>
                <TextX
                  fontSize="sm"
                  fontWeight="medium"
                  color="secondary"
                  marginBottom={8}>
                  Task List
                </TextX>

                <LegendList
                  data={evaluation.checklistItems || []}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => (
                    <ViewX
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      paddingVertical={12}
                      paddingHorizontal={16}
                      borderRadius={10}
                      marginBottom={12}
                      backgroundColor={
                        editingChecklistItem &&
                        editingChecklistItem.id === item.id
                          ? withAlpha(accentColor, 0.1)
                          : withAlpha(fieldColor, 0.8)
                      }>
                      <ViewX flexDirection="row" alignItems="center" flex={1}>
                        <CheckCircle2
                          size={14}
                          color={textSecondary}
                          strokeWidth={1.5}
                        />
                        <TextX fontSize="sm" color="secondary" marginLeft={12}>
                          {item.text}
                        </TextX>
                      </ViewX>
                      <ViewX flexDirection="row">
                        {/* Edit button */}
                        <TouchableX
                          padding={8}
                          borderRadius={16}
                          marginRight={4}
                          onPress={() => handleEditChecklistItem(item)}>
                          <Edit2
                            size={16}
                            color={accentColor}
                            strokeWidth={2}
                          />
                        </TouchableX>

                        {/* Delete button */}
                        <TouchableX
                          padding={8}
                          borderRadius={16}
                          onPress={() => onRemoveChecklistItem(item.id)}>
                          <X size={16} color={accentColor} strokeWidth={2} />
                        </TouchableX>
                      </ViewX>
                    </ViewX>
                  )}
                  ListEmptyComponent={() => (
                    <ViewX
                      marginTop={20}
                      alignItems="center"
                      justifyContent="center"
                      paddingHorizontal={20}>
                      <TextX fontSize="sm" color="tertiary" textAlign="center">
                        No tasks added yet.
                      </TextX>
                      <TextX fontSize="xs" color="tertiary" textAlign="center">
                        Add tasks to create a checklist for this habit.
                      </TextX>
                    </ViewX>
                  )}
                  contentContainerStyle={{
                    flexGrow: 1,
                  }}
                />
              </ViewX>
            </ViewX>
          </ViewX>
        </ViewX>
      </Modal>
    </ViewX>
  );
};

export default EvaluationSection;
