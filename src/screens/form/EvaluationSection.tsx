/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {LegendList} from '@legendapp/list';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Edit2,
  Hash,
  ListChecks,
  Plus,
  Timer,
  X,
} from 'lucide-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {TextX, TouchableX, ViewX} from '~/components/common';
import {ChecklistItem, EvaluationType} from '~/types/habit.types';
import {COMMON_UNITS, TIME_UNITS} from '~/utils/constants/habitConstants';
import SquircleViewContainer from '~containers/SquircleViewContainer';
import {useTheme} from '~hooks/ThemeContext';
import {getThemeColor, withAlpha} from '~styles/theme';
import {s, vs} from '~utils/screenUtil';
import {SectionLabel} from './BasicInfo';

// Define evaluation types with detailed information
const EVALUATION_TYPES = [
  {
    id: 'boolean',
    label: 'Yes/No',
    icon: CheckCircle2,
    description: 'Simple completion tracking',
    example: 'Did you meditate today?',
  },
  {
    id: 'numeric',
    label: 'Numeric',
    icon: Hash,
    description: 'Track quantities',
    example: 'How many glasses of water did you drink?',
  },
  {
    id: 'timer',
    label: 'Timer',
    icon: Timer,
    description: 'Track time spent',
    example: 'How many minutes did you read?',
  },
  {
    id: 'checklist',
    label: 'Checklist',
    icon: ListChecks,
    description: 'Multiple tasks to complete',
    example: 'Complete your morning routine steps',
  },
];

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
  // State
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [checklistModalVisible, setChecklistModalVisible] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [customUnitInput, setCustomUnitInput] = useState('');
  const [editingChecklistItem, setEditingChecklistItem] =
    useState<ChecklistItem | null>(null);

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
  const textPrimary = getThemeColor(theme, 'text', 'primary');
  const textSecondary = getThemeColor(theme, 'text', 'secondary');
  const textTertiary = getThemeColor(theme, 'text', 'tertiary');
  const accentColor = getThemeColor(theme, 'text', 'accent');

  // Get current evaluation type details
  const evaluationType = EVALUATION_TYPES.find(t => t.id === evaluation.type);

  // Animate chevron rotation for dropdown
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: typeModalVisible ? 1 : 0,
      duration: 250,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();

    if (typeModalVisible || unitModalVisible || checklistModalVisible) {
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
  }, [
    typeModalVisible,
    unitModalVisible,
    checklistModalVisible,
    rotateAnim,
    overlayOpacity,
    modalY,
  ]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Handlers
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
    setTypeModalVisible(false);
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
      : Math.max(1, currentTarget - step);

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
  };

  const handleCustomUnitSubmit = () => {
    if (customUnitInput.trim()) {
      onUpdateEvaluation({
        ...evaluation,
        unit: customUnitInput.trim(),
      });
      setCustomUnitInput('');
      setUnitModalVisible(false);
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

  return (
    <ViewX>
      <SectionLabel
        title="Tracking Method"
        isRequired
        caption="How you'll measure your habit's progress"
      />

      {/* Tracking Method Selector */}
      <SquircleViewContainer
        borderRadius="md"
        backgroundColor={fieldColor}
        borderColor={error ? errorColor : borderColor}
        borderWidth={error ? 2 : 1}
        height={vs(64)}>
        <TouchableX
          onPress={() => setTypeModalVisible(true)}
          style={styles.selectorContainer}
          backgroundColor="transparent"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          accessibilityLabel="Select tracking method"
          accessibilityHint="Choose how to track your habit">
          <ViewX flexDirection="row" alignItems="center">
            {evaluationType ? (
              <>
                <ViewX
                  width={s(44)}
                  height={s(44)}
                  borderRadius={s(12)}
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor={withAlpha(accentColor, 0.15)}
                  marginRight={s(12)}>
                  <evaluationType.icon
                    size={22}
                    color={accentColor}
                    strokeWidth={1.5}
                  />
                </ViewX>
                <ViewX>
                  <TextX fontSize="md" fontWeight="medium" color="primary">
                    {evaluationType.label}
                  </TextX>
                  <TextX fontSize="xs" color="tertiary" marginTop={vs(2)}>
                    {evaluationType.description}
                  </TextX>
                </ViewX>
              </>
            ) : (
              <TextX fontSize="md" color="tertiary">
                Select tracking method
              </TextX>
            )}
          </ViewX>

          <Animated.View style={{transform: [{rotate: spin}]}}>
            <ChevronDown size={22} color={textSecondary} strokeWidth={1.5} />
          </Animated.View>
        </TouchableX>
      </SquircleViewContainer>

      {error && (
        <TextX fontSize="xs" color="error" marginTop={vs(6)} marginLeft={s(4)}>
          {error}
        </TextX>
      )}

      {/* Method-specific Configuration */}
      <ViewX marginTop={vs(20)}>
        {/* Numeric Target Config */}
        {evaluation.type === 'numeric' && (
          <SquircleViewContainer
            borderRadius="md"
            backgroundColor={withAlpha(fieldColor, 0.5)}
            padding="md">
            <ViewX style={styles.sectionHeader}>
              <Hash size={18} color={accentColor} strokeWidth={1.5} />
              <TextX
                fontSize="sm"
                fontWeight="semibold"
                color="accent"
                marginLeft={s(8)}>
                Numeric Target
              </TextX>
            </ViewX>

            <ViewX>
              <TextX
                fontSize="xs"
                color="tertiary"
                marginTop={vs(4)}
                marginBottom={vs(12)}>
                {evaluationType?.example ||
                  'How many units do you want to track?'}
              </TextX>

              <ViewX style={styles.targetInputContainer}>
                <ViewX style={styles.targetControls}>
                  <TouchableX
                    width={s(44)}
                    height={s(44)}
                    borderRadius={s(22)}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor={withAlpha(fieldColor, 0.7)}
                    onPress={() => handleUpdateTarget(false)}
                    disabled={evaluation.target <= 1}
                    opacity={evaluation.target <= 1 ? 0.5 : 1}>
                    <TextX
                      fontSize="2xl"
                      fontWeight="semibold"
                      color="tertiary">
                      -
                    </TextX>
                  </TouchableX>

                  <ViewX style={styles.targetValueContainer}>
                    <TextX fontSize="3xl" fontWeight="bold" color="accent">
                      {evaluation.target}
                    </TextX>
                  </ViewX>

                  <TouchableX
                    width={s(44)}
                    height={s(44)}
                    borderRadius={s(22)}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor={withAlpha(fieldColor, 0.7)}
                    onPress={() => handleUpdateTarget(true)}>
                    <TextX
                      fontSize="2xl"
                      fontWeight="semibold"
                      color="tertiary">
                      +
                    </TextX>
                  </TouchableX>
                </ViewX>

                {/* Unit selector */}
                <TouchableX
                  onPress={() => setUnitModalVisible(true)}
                  style={[styles.unitSelector, {borderColor: borderColor}]}>
                  <TextX
                    fontSize="md"
                    color={evaluation.unit ? 'primary' : 'tertiary'}
                    textAlign="center">
                    {evaluation.unit || 'Select unit'}
                  </TextX>
                </TouchableX>
              </ViewX>

              <TextX fontSize="xs" color="tertiary" marginTop={vs(16)}>
                {`You'll need to track ${evaluation.target} ${
                  evaluation.unit || 'units'
                } each time to mark this habit complete.`}
              </TextX>
            </ViewX>
          </SquircleViewContainer>
        )}

        {/* Timer Target Config */}
        {evaluation.type === 'timer' && (
          <SquircleViewContainer
            borderRadius="md"
            backgroundColor={withAlpha(fieldColor, 0.5)}
            padding="md">
            <ViewX style={styles.sectionHeader}>
              <Timer size={18} color={accentColor} strokeWidth={1.5} />
              <TextX
                fontSize="sm"
                fontWeight="semibold"
                color="accent"
                marginLeft={s(8)}>
                Time Target
              </TextX>
            </ViewX>

            <ViewX>
              <TextX
                fontSize="xs"
                color="tertiary"
                marginTop={vs(4)}
                marginBottom={vs(12)}>
                {evaluationType?.example ||
                  'How much time do you want to track?'}
              </TextX>

              <ViewX style={styles.targetInputContainer}>
                <ViewX style={styles.targetControls}>
                  <TouchableX
                    width={s(44)}
                    height={s(44)}
                    borderRadius={s(22)}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor={withAlpha(fieldColor, 0.7)}
                    onPress={() => handleUpdateTarget(false)}
                    disabled={evaluation.target <= 5}
                    opacity={evaluation.target <= 5 ? 0.5 : 1}>
                    <TextX
                      fontSize="2xl"
                      fontWeight="semibold"
                      color="tertiary">
                      -
                    </TextX>
                  </TouchableX>

                  <ViewX style={styles.targetValueContainer}>
                    <TextX fontSize="3xl" fontWeight="bold" color="accent">
                      {evaluation.target}
                    </TextX>
                  </ViewX>

                  <TouchableX
                    width={s(44)}
                    height={s(44)}
                    borderRadius={s(22)}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor={withAlpha(fieldColor, 0.7)}
                    onPress={() => handleUpdateTarget(true)}>
                    <TextX
                      fontSize="2xl"
                      fontWeight="semibold"
                      color="tertiary">
                      +
                    </TextX>
                  </TouchableX>
                </ViewX>

                {/* Unit selector */}
                <TouchableX
                  onPress={() => setUnitModalVisible(true)}
                  style={[styles.unitSelector, {borderColor: borderColor}]}>
                  <TextX
                    fontSize="md"
                    color={evaluation.unit ? 'primary' : 'tertiary'}
                    textAlign="center">
                    {evaluation.unit === 'minutes' ? 'Minutes' : 'Hours'}
                  </TextX>
                </TouchableX>
              </ViewX>

              <TextX fontSize="xs" color="tertiary" marginTop={vs(16)}>
                {`You'll need to spend ${evaluation.target} ${
                  evaluation.unit || 'minutes'
                } each time to mark this habit complete.`}
              </TextX>
            </ViewX>
          </SquircleViewContainer>
        )}

        {/* Checklist Config */}
        {evaluation.type === 'checklist' && (
          <SquircleViewContainer
            borderRadius="md"
            backgroundColor={withAlpha(fieldColor, 0.5)}
            padding="md">
            <ViewX style={styles.sectionHeader}>
              <ListChecks size={18} color={accentColor} strokeWidth={1.5} />
              <TextX
                fontSize="sm"
                fontWeight="semibold"
                color="accent"
                marginLeft={s(8)}>
                Checklist Tasks
              </TextX>
            </ViewX>

            <ViewX>
              <TextX
                fontSize="xs"
                color="tertiary"
                marginTop={vs(4)}
                marginBottom={vs(8)}>
                {evaluationType?.example ||
                  'Create a list of tasks to complete'}
              </TextX>

              <ViewX
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                marginBottom={vs(16)}>
                <ViewX style={{flex: 1}}>
                  <TextX fontSize="sm" color="secondary">
                    {`Complete ${evaluation.target || 0} of ${
                      evaluation.checklistItems?.length || 0
                    } tasks`}
                  </TextX>
                </ViewX>

                <TouchableX
                  onPress={() => setChecklistModalVisible(true)}
                  style={styles.manageTasks}
                  backgroundColor={withAlpha(accentColor, 0.1)}>
                  <Plus size={14} color={accentColor} strokeWidth={1.5} />
                  <TextX fontSize="xs" color="accent" marginLeft={s(4)}>
                    Manage Tasks
                  </TextX>
                </TouchableX>
              </ViewX>

              {evaluation.checklistItems &&
              evaluation.checklistItems.length > 0 ? (
                <ViewX style={styles.checklistPreview}>
                  {evaluation.checklistItems.slice(0, 3).map(item => (
                    <ViewX key={item.id} style={styles.checklistPreviewItem}>
                      <CheckCircle2
                        size={14}
                        color={textSecondary}
                        strokeWidth={1.5}
                      />
                      <TextX
                        fontSize="sm"
                        color="secondary"
                        marginLeft={s(8)}
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
                      fontStyle="italic"
                      marginTop={vs(8)}>
                      ...and {evaluation.checklistItems.length - 3} more tasks
                    </TextX>
                  )}
                </ViewX>
              ) : (
                <ViewX style={styles.emptyChecklist}>
                  <TextX fontSize="sm" color="tertiary" textAlign="center">
                    No tasks added yet
                  </TextX>
                  <TextX
                    fontSize="xs"
                    color="tertiary"
                    textAlign="center"
                    marginTop={vs(4)}>
                    Tap "Manage Tasks" to add items to your checklist
                  </TextX>
                </ViewX>
              )}

              {evaluation.checklistItems &&
                evaluation.checklistItems.length > 0 && (
                  <ViewX style={styles.targetControls} marginTop={vs(16)}>
                    <TextX fontSize="sm" color="secondary" marginRight={s(12)}>
                      Tasks needed:
                    </TextX>

                    <TouchableX
                      width={s(36)}
                      height={s(36)}
                      borderRadius={s(18)}
                      justifyContent="center"
                      alignItems="center"
                      backgroundColor={withAlpha(fieldColor, 0.7)}
                      onPress={() => handleUpdateTarget(false)}
                      disabled={evaluation.target <= 1}
                      opacity={evaluation.target <= 1 ? 0.5 : 1}>
                      <TextX
                        fontSize="lg"
                        fontWeight="semibold"
                        color="tertiary">
                        -
                      </TextX>
                    </TouchableX>

                    <ViewX width={s(40)} alignItems="center">
                      <TextX fontSize="xl" fontWeight="bold" color="accent">
                        {evaluation.target}
                      </TextX>
                    </ViewX>

                    <TouchableX
                      width={s(36)}
                      height={s(36)}
                      borderRadius={s(18)}
                      justifyContent="center"
                      alignItems="center"
                      backgroundColor={withAlpha(fieldColor, 0.7)}
                      onPress={() => handleUpdateTarget(true)}
                      disabled={
                        evaluation.target >= evaluation.checklistItems.length
                      }
                      opacity={
                        evaluation.target >= evaluation.checklistItems.length
                          ? 0.5
                          : 1
                      }>
                      <TextX
                        fontSize="lg"
                        fontWeight="semibold"
                        color="tertiary">
                        +
                      </TextX>
                    </TouchableX>
                  </ViewX>
                )}
            </ViewX>
          </SquircleViewContainer>
        )}
      </ViewX>

      {/* Tracking Method Selection Modal */}
      <Modal
        visible={typeModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setTypeModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setTypeModalVisible(false)}>
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
                    Select Tracking Method
                  </TextX>
                  <TouchableX
                    paddingVertical={vs(6)}
                    paddingHorizontal={s(12)}
                    borderRadius={s(20)}
                    backgroundColor={withAlpha(accentColor, 0.1)}
                    onPress={() => setTypeModalVisible(false)}>
                    <TextX fontSize="sm" fontWeight="medium" color="accent">
                      Cancel
                    </TextX>
                  </TouchableX>
                </ViewX>

                <ViewX
                  style={styles.modalDivider}
                  backgroundColor={withAlpha(borderColor, 0.5)}
                />

                <ViewX style={styles.typeOptions}>
                  {EVALUATION_TYPES.map(option => (
                    <TouchableX
                      key={option.id}
                      onPress={() =>
                        handleSelectType(option.id as EvaluationType)
                      }
                      backgroundColor={
                        evaluation.type === option.id
                          ? withAlpha(accentColor, 0.08)
                          : 'transparent'
                      }
                      style={styles.typeOption}
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      accessibilityLabel={option.label}
                      accessibilityRole="radio"
                      accessibilityState={{
                        checked: evaluation.type === option.id,
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
                          <TextX
                            fontSize="xs"
                            color="secondary"
                            marginTop={vs(4)}
                            fontStyle="italic">
                            Example: {option.example}
                          </TextX>
                        </ViewX>
                      </ViewX>

                      {evaluation.type === option.id && (
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

      {/* Unit Selection Modal */}
      <Modal
        visible={unitModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setUnitModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setUnitModalVisible(false)}>
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
                    {evaluation.type === 'timer'
                      ? 'Select Time Unit'
                      : 'Select Unit'}
                  </TextX>
                  <TouchableX
                    paddingVertical={vs(6)}
                    paddingHorizontal={s(12)}
                    borderRadius={s(20)}
                    backgroundColor={withAlpha(accentColor, 0.1)}
                    onPress={() => setUnitModalVisible(false)}>
                    <TextX fontSize="sm" fontWeight="medium" color="accent">
                      Cancel
                    </TextX>
                  </TouchableX>
                </ViewX>

                <ViewX
                  style={styles.modalDivider}
                  backgroundColor={withAlpha(borderColor, 0.5)}
                />

                <ViewX style={styles.unitOptions}>
                  {/* Render different units based on the evaluation type */}
                  {evaluation.type === 'timer'
                    ? TIME_UNITS.map(unit => (
                        <TouchableX
                          key={unit.id}
                          onPress={() => handleUpdateUnit(unit.id)}
                          backgroundColor={
                            evaluation.unit === unit.id
                              ? withAlpha(accentColor, 0.08)
                              : 'transparent'
                          }
                          style={styles.unitOption}
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <TextX fontSize="md" color="primary">
                            {unit.label}
                          </TextX>
                          {evaluation.unit === unit.id && (
                            <Check
                              size={16}
                              color={accentColor}
                              strokeWidth={2}
                            />
                          )}
                        </TouchableX>
                      ))
                    : COMMON_UNITS.map(unit => (
                        <TouchableX
                          key={unit.id}
                          onPress={() => {
                            if (unit.id === 'custom') {
                              // Just show the custom input field
                            } else {
                              handleUpdateUnit(unit.label);
                            }
                          }}
                          backgroundColor={
                            evaluation.unit === unit.label
                              ? withAlpha(accentColor, 0.08)
                              : 'transparent'
                          }
                          style={styles.unitOption}
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <TextX fontSize="md" color="primary">
                            {unit.label}
                          </TextX>
                          {evaluation.unit === unit.label && (
                            <Check
                              size={16}
                              color={accentColor}
                              strokeWidth={2}
                            />
                          )}
                        </TouchableX>
                      ))}

                  {evaluation.type === 'numeric' && (
                    <ViewX style={styles.customUnitContainer}>
                      <ViewX style={styles.customUnitDivider}>
                        <ViewX
                          style={styles.dividerLine}
                          backgroundColor={withAlpha(borderColor, 0.5)}
                        />
                        <TextX
                          fontSize="xs"
                          color="tertiary"
                          style={styles.dividerText}>
                          OR ADD CUSTOM
                        </TextX>
                        <ViewX
                          style={styles.dividerLine}
                          backgroundColor={withAlpha(borderColor, 0.5)}
                        />
                      </ViewX>

                      <ViewX flexDirection="row" marginTop={vs(16)}>
                        <TextInput
                          style={[
                            styles.customUnitInput,
                            {
                              color: textPrimary,
                              borderColor: borderColor,
                              backgroundColor: withAlpha(fieldColor, 0.7),
                            },
                          ]}
                          value={customUnitInput}
                          onChangeText={setCustomUnitInput}
                          placeholder="Enter custom unit"
                          placeholderTextColor={textTertiary}
                        />
                        <TouchableX
                          onPress={handleCustomUnitSubmit}
                          style={styles.customUnitButton}
                          backgroundColor={withAlpha(accentColor, 0.15)}
                          disabled={!customUnitInput.trim()}
                          opacity={!customUnitInput.trim() ? 0.5 : 1}>
                          <TextX fontSize="sm" color="accent">
                            Add
                          </TextX>
                        </TouchableX>
                      </ViewX>
                    </ViewX>
                  )}
                </ViewX>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Checklist Modal */}
      <Modal
        visible={checklistModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => {
          setChecklistModalVisible(false);
          setEditingChecklistItem(null);
          setNewItemText('');
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setChecklistModalVisible(false);
            setEditingChecklistItem(null);
            setNewItemText('');
          }}>
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
                    {editingChecklistItem ? 'Edit Task' : 'Manage Tasks'}
                  </TextX>
                  <TouchableX
                    paddingVertical={vs(6)}
                    paddingHorizontal={s(12)}
                    borderRadius={s(20)}
                    backgroundColor={withAlpha(accentColor, 0.1)}
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

                <ViewX
                  style={styles.modalDivider}
                  backgroundColor={withAlpha(borderColor, 0.5)}
                />

                <ViewX style={styles.checklistContainer}>
                  {/* Add/Edit Task Section */}
                  <ViewX style={styles.addTaskSection}>
                    <TextX
                      fontSize="sm"
                      fontWeight="medium"
                      color="secondary"
                      marginBottom={vs(8)}>
                      {editingChecklistItem ? 'Edit Task' : 'Add New Task'}
                    </TextX>

                    <ViewX flexDirection="row" alignItems="center">
                      <TextInput
                        style={[
                          styles.taskInput,
                          {
                            color: textPrimary,
                            borderColor: borderColor,
                            backgroundColor: withAlpha(fieldColor, 0.7),
                          },
                        ]}
                        value={newItemText}
                        onChangeText={setNewItemText}
                        placeholder={
                          editingChecklistItem ? 'Edit task' : 'Add a new task'
                        }
                        placeholderTextColor={textTertiary}
                        returnKeyType="done"
                        onSubmitEditing={handleAddChecklistItemSubmit}
                      />
                      <TouchableX
                        onPress={handleAddChecklistItemSubmit}
                        style={styles.taskButton}
                        backgroundColor={withAlpha(accentColor, 0.15)}
                        borderRadius={s(8)}
                        disabled={!newItemText.trim()}
                        opacity={!newItemText.trim() ? 0.5 : 1}>
                        {editingChecklistItem ? (
                          <Check
                            size={20}
                            color={accentColor}
                            strokeWidth={1.5}
                          />
                        ) : (
                          <Plus
                            size={20}
                            color={accentColor}
                            strokeWidth={1.5}
                          />
                        )}
                      </TouchableX>
                    </ViewX>

                    {editingChecklistItem && (
                      <TouchableX
                        onPress={() => {
                          setEditingChecklistItem(null);
                          setNewItemText('');
                        }}
                        style={styles.cancelEdit}>
                        <TextX fontSize="xs" color="accent" textAlign="center">
                          Cancel Editing
                        </TextX>
                      </TouchableX>
                    )}
                  </ViewX>

                  {/* Task List Section */}
                  <ViewX style={styles.taskListSection}>
                    <TextX
                      fontSize="sm"
                      fontWeight="medium"
                      color="secondary"
                      marginBottom={vs(12)}>
                      Task List
                    </TextX>

                    {evaluation.checklistItems &&
                    evaluation.checklistItems.length > 0 ? (
                      <LegendList
                        data={evaluation.checklistItems}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => (
                          <ViewX
                            style={[
                              styles.taskItem,
                              {
                                backgroundColor: withAlpha(fieldColor, 0.7),
                                borderColor:
                                  editingChecklistItem &&
                                  editingChecklistItem.id === item.id
                                    ? accentColor
                                    : 'transparent',
                              },
                            ]}>
                            <ViewX
                              flexDirection="row"
                              alignItems="center"
                              flex={1}>
                              <CheckCircle2
                                size={18}
                                color={textSecondary}
                                strokeWidth={1.5}
                              />
                              <TextX
                                fontSize="sm"
                                color="secondary"
                                marginLeft={s(12)}
                                flex={1}>
                                {item.text}
                              </TextX>
                            </ViewX>
                            <ViewX flexDirection="row">
                              <TouchableX
                                onPress={() => handleEditChecklistItem(item)}
                                style={styles.taskAction}>
                                <Edit2
                                  size={18}
                                  color={accentColor}
                                  strokeWidth={1.5}
                                />
                              </TouchableX>
                              <TouchableX
                                onPress={() => onRemoveChecklistItem(item.id)}
                                style={styles.taskAction}>
                                <X
                                  size={18}
                                  color={errorColor}
                                  strokeWidth={1.5}
                                />
                              </TouchableX>
                            </ViewX>
                          </ViewX>
                        )}
                        ListEmptyComponent={() => (
                          <ViewX style={styles.emptyTaskList}>
                            <TextX
                              fontSize="sm"
                              color="tertiary"
                              textAlign="center">
                              No tasks added yet
                            </TextX>
                            <TextX
                              fontSize="xs"
                              color="tertiary"
                              textAlign="center"
                              marginTop={vs(4)}>
                              Add tasks to create a checklist for your habit
                            </TextX>
                          </ViewX>
                        )}
                        contentContainerStyle={{paddingBottom: vs(16)}}
                      />
                    ) : (
                      <ViewX style={styles.emptyTaskList}>
                        <TextX
                          fontSize="sm"
                          color="tertiary"
                          textAlign="center">
                          No tasks added yet
                        </TextX>
                        <TextX
                          fontSize="xs"
                          color="tertiary"
                          textAlign="center"
                          marginTop={vs(4)}>
                          Add tasks to create a checklist for your habit
                        </TextX>
                      </ViewX>
                    )}
                  </ViewX>
                </ViewX>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
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
  targetInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetValueContainer: {
    paddingHorizontal: s(16),
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: s(60),
  },
  unitSelector: {
    height: vs(44),
    borderRadius: s(8),
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: s(12),
    minWidth: s(100),
  },
  manageTasks: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(6),
    paddingHorizontal: s(10),
    borderRadius: s(16),
  },
  checklistPreview: {
    backgroundColor: withAlpha('#000', 0.05),
    borderRadius: s(12),
    padding: s(12),
  },
  checklistPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  emptyChecklist: {
    borderWidth: 1,
    borderColor: withAlpha('#FFF', 0.1),
    borderStyle: 'dashed',
    borderRadius: s(12),
    padding: s(16),
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
  typeOptions: {
    paddingHorizontal: s(16),
    paddingBottom: vs(24),
  },
  typeOption: {
    paddingVertical: vs(12),
    paddingHorizontal: s(12),
    borderRadius: 12,
    marginBottom: vs(12),
  },
  unitOptions: {
    paddingHorizontal: s(16),
    paddingBottom: vs(24),
  },
  unitOption: {
    paddingVertical: vs(12),
    paddingHorizontal: s(12),
    borderRadius: 12,
    marginBottom: vs(8),
  },
  customUnitContainer: {
    marginTop: vs(16),
  },
  customUnitDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: vs(8),
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: s(8),
  },
  customUnitInput: {
    flex: 1,
    height: vs(44),
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: s(12),
    marginRight: s(8),
  },
  customUnitButton: {
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
    borderRadius: 8,
    justifyContent: 'center',
  },
  checklistContainer: {
    paddingHorizontal: s(16),
    paddingBottom: vs(16),
  },
  addTaskSection: {
    marginBottom: vs(20),
  },
  taskInput: {
    flex: 1,
    height: vs(44),
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: s(12),
    marginRight: s(8),
  },
  taskButton: {
    width: s(44),
    height: s(44),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelEdit: {
    paddingVertical: vs(8),
    marginTop: vs(8),
  },
  taskListSection: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(12),
    paddingHorizontal: s(12),
    borderRadius: 10,
    marginBottom: vs(8),
    borderWidth: 1,
  },
  taskAction: {
    padding: s(6),
    marginLeft: s(4),
  },
  emptyTaskList: {
    paddingVertical: vs(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EvaluationSection;
