import {
  Archive,
  BarChart,
  CheckCircle,
  Circle,
  Copy,
  Edit2,
  Trash2,
  X,
} from 'lucide-react-native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {TextX, TouchableX, ViewX} from '~/components/common';
import SquircleViewContainer from '~/containers/SquircleViewContainer';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, withAlpha} from '~/styles/theme';
import {Habit} from '~/types/habit.types';
import {formatTime12Hour, fromJSDate} from '~/utils/date/dateUtils';
import {s, vs} from '~utils/screenUtil';

// Memoized Toggle Button to prevent re-renders
const ToggleButton = memo(
  ({
    isCompleted,
    onPress,
    accentColor,
    textSecondary,
  }: {
    isCompleted: boolean;
    onPress: () => void;
    accentColor: string;
    textSecondary: string;
  }) => (
    <TouchableX onPress={onPress} padding={s(8)}>
      {isCompleted ? (
        <CheckCircle size={24} color={accentColor} strokeWidth={2} />
      ) : (
        <Circle size={24} color={textSecondary} strokeWidth={2} />
      )}
    </TouchableX>
  ),
);

interface HabitCardProps {
  habit: Habit;
  onPress: (habit: Habit) => void;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habit: Habit) => void;
  onArchive?: (habit: Habit) => void;
  onDuplicate?: (habit: Habit) => void;
  onViewStats?: (habit: Habit) => void;
  isCompleted?: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onPress,
  onEdit,
  onDelete,
  onArchive,
  onDuplicate,
  onViewStats,
  isCompleted = false,
}) => {
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const pressAnimValue = useRef(new Animated.Value(1)).current;
  const modalAnimValue = useRef(new Animated.Value(0)).current;

  // Theme colors
  const {theme} = useTheme();
  const accentColor = getThemeColor(theme, 'text', 'accent');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const textSecondary = getThemeColor(theme, 'text', 'secondary');
  const textTertiary = getThemeColor(theme, 'text', 'tertiary');
  const errorColor = getThemeColor(theme, 'text', 'error');
  const bgColor = getThemeColor(theme, 'background', 'base');

  // Animation for press feedback
  const animatePress = useCallback(
    (pressed: boolean, callback?: () => void) => {
      Animated.spring(pressAnimValue, {
        toValue: pressed ? 0.98 : 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start(callback);
    },
    [pressAnimValue],
  );

  // Modal animation with opacity for smoother transition
  const animateModal = useCallback(
    (visible: boolean, callback?: () => void) => {
      Animated.timing(modalAnimValue, {
        toValue: visible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (!visible) {
          setActionModalVisible(false);
          if (callback) {
            callback();
          }
        }
      });
    },
    [modalAnimValue],
  );

  const handlePressIn = useCallback(() => {
    animatePress(true);

    setIsLongPressing(false);
    longPressTimeout.current = setTimeout(() => {
      setIsLongPressing(true);
      setActionModalVisible(true);
      animatePress(false, () => animateModal(true));
    }, 500);
  }, [animatePress, animateModal]);

  const handlePressOut = useCallback(() => {
    animatePress(false);

    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  }, [animatePress]);

  const handlePress = useCallback(() => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }

    if (!isLongPressing) {
      onPress(habit);
    }
  }, [isLongPressing, onPress, habit]);

  const handleCloseModal = useCallback(() => {
    console.log('Closing modal for habit:', habit.id);
    animateModal(false);
  }, [animateModal, habit.id]);

  const handleDelete = useCallback(() => {
    console.log('Initiating delete for habit:', habit.id);
    animateModal(false, () => {
      console.log(
        'Modal animation complete, calling onDelete for habit:',
        habit.id,
      );
      if (onDelete) {
        onDelete(habit);
      }
    });
  }, [animateModal, onDelete, habit]);

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      // Stop any running animations
      pressAnimValue.stopAnimation();
      modalAnimValue.stopAnimation();
      if (longPressTimeout.current) {
        clearTimeout(longPressTimeout.current);
        longPressTimeout.current = null;
      }
    };
  }, [pressAnimValue, modalAnimValue]);

  // Format time string using dateUtilities
  const formatTimeOfDay = useCallback((date: Date | null) => {
    if (!date) {
      return '';
    }

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.warn('Invalid Date object passed to formatTimeOfDay:', date);
      return '';
    }

    const dt = fromJSDate(date, 'local');
    if (!dt.isValid) {
      console.warn('Invalid DateTime created from Date:', date);
      return '';
    }
    return formatTime12Hour(dt);
  }, []);

  return (
    <>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}>
        <Animated.View
          style={[
            styles.cardContainer,
            {transform: [{scale: pressAnimValue}]},
          ]}>
          <SquircleViewContainer
            borderRadius="md"
            variant="surface"
            padding="sm">
            <ViewX flexDirection="row" alignItems="center" gap={s(8)}>
              <ToggleButton
                isCompleted={isCompleted}
                onPress={() => onPress(habit)}
                accentColor={accentColor}
                textSecondary={textSecondary}
              />
              <ViewX flex={1}>
                <ViewX flexDirection="row" alignItems="center" gap={s(6)}>
                  <ViewX
                    width={s(6)}
                    height={s(6)}
                    borderRadius={s(3)}
                    backgroundColor={habit.color}
                  />
                  <TextX
                    fontSize="md"
                    fontWeight="semibold"
                    color="primary"
                    numberOfLines={1}
                    flex={1}>
                    {habit.title}
                  </TextX>
                </ViewX>
                <ViewX
                  flexDirection="row"
                  alignItems="center"
                  gap={s(6)}
                  marginTop={vs(2)}>
                  <TextX fontSize="xs" color="secondary">
                    {habit.frequency.type === 'daily'
                      ? 'Every day'
                      : habit.frequency.type}
                  </TextX>
                  {habit.frequency.timeOfDay && (
                    <TextX fontSize="xs" color="secondary">
                      • {formatTimeOfDay(habit.frequency.timeOfDay)}
                    </TextX>
                  )}
                </ViewX>
              </ViewX>
              <ViewX
                alignItems="center"
                backgroundColor={withAlpha(habit.color, 0.1)}
                borderRadius={s(10)}
                paddingHorizontal={s(6)}
                paddingVertical={vs(2)}>
                <TextX fontSize="sm" fontWeight="bold" color={habit.color}>
                  {habit.streak?.current || 0}
                </TextX>
                <TextX fontSize="2xs" color="secondary">
                  Streak
                </TextX>
              </ViewX>
            </ViewX>
          </SquircleViewContainer>
        </Animated.View>
      </Pressable>

      {actionModalVisible && (
        <Modal
          visible={actionModalVisible}
          transparent
          statusBarTranslucent
          animationType="none"
          onRequestClose={handleCloseModal}>
          <TouchableWithoutFeedback onPress={handleCloseModal}>
            <ViewX style={styles.modalOverlay}>
              <Animated.View
                style={[
                  styles.modalBackdrop,
                  {
                    backgroundColor: withAlpha(bgColor, 0.7),
                    opacity: modalAnimValue,
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    opacity: modalAnimValue,
                    transform: [
                      {
                        translateY: modalAnimValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [300, 0],
                        }),
                      },
                    ],
                  },
                ]}>
                <TouchableWithoutFeedback>
                  <ViewX>
                    <SquircleViewContainer
                      borderRadius="lg"
                      variant="surface"
                      padding="md">
                      <ViewX style={styles.modalHeader}>
                        <TextX
                          fontSize="lg"
                          fontWeight="semibold"
                          color="primary">
                          {habit.title}
                        </TextX>
                        <TouchableX
                          onPress={handleCloseModal}
                          style={styles.closeButton}>
                          <X size={20} color={textTertiary} strokeWidth={1.5} />
                        </TouchableX>
                      </ViewX>
                      <ViewX
                        style={styles.modalDivider}
                        backgroundColor={withAlpha(borderColor, 0.5)}
                      />
                      <ViewX style={styles.actionGrid}>
                        {onEdit && (
                          <TouchableX
                            style={styles.actionButton}
                            onPress={() => {
                              handleCloseModal();
                              onEdit(habit);
                            }}>
                            <ViewX
                              style={styles.actionIcon}
                              backgroundColor={withAlpha(accentColor, 0.1)}>
                              <Edit2
                                size={22}
                                color={accentColor}
                                strokeWidth={1.5}
                              />
                            </ViewX>
                            <TextX
                              fontSize="sm"
                              color="primary"
                              marginTop={vs(4)}>
                              Edit
                            </TextX>
                          </TouchableX>
                        )}
                        {onDelete && (
                          <TouchableX
                            style={styles.actionButton}
                            onPress={handleDelete}>
                            <ViewX
                              style={styles.actionIcon}
                              backgroundColor={withAlpha(errorColor, 0.1)}>
                              <Trash2
                                size={22}
                                color={errorColor}
                                strokeWidth={1.5}
                              />
                            </ViewX>
                            <TextX
                              fontSize="sm"
                              color="primary"
                              marginTop={vs(4)}>
                              Delete
                            </TextX>
                          </TouchableX>
                        )}
                        {onArchive && (
                          <TouchableX
                            style={styles.actionButton}
                            onPress={() => {
                              handleCloseModal();
                              onArchive(habit);
                            }}>
                            <ViewX
                              style={styles.actionIcon}
                              backgroundColor={withAlpha(textSecondary, 0.1)}>
                              <Archive
                                size={22}
                                color={textSecondary}
                                strokeWidth={1.5}
                              />
                            </ViewX>
                            <TextX
                              fontSize="sm"
                              color="primary"
                              marginTop={vs(4)}>
                              Archive
                            </TextX>
                          </TouchableX>
                        )}
                        {onDuplicate && (
                          <TouchableX
                            style={styles.actionButton}
                            onPress={() => {
                              handleCloseModal();
                              onDuplicate(habit);
                            }}>
                            <ViewX
                              style={styles.actionIcon}
                              backgroundColor={withAlpha(textSecondary, 0.1)}>
                              <Copy
                                size={22}
                                color={textSecondary}
                                strokeWidth={1.5}
                              />
                            </ViewX>
                            <TextX
                              fontSize="sm"
                              color="primary"
                              marginTop={vs(4)}>
                              Duplicate
                            </TextX>
                          </TouchableX>
                        )}
                        {onViewStats && (
                          <TouchableX
                            style={styles.actionButton}
                            onPress={() => {
                              handleCloseModal();
                              onViewStats(habit);
                            }}>
                            <ViewX
                              style={styles.actionIcon}
                              backgroundColor={withAlpha(accentColor, 0.1)}>
                              <BarChart
                                size={22}
                                color={accentColor}
                                strokeWidth={1.5}
                              />
                            </ViewX>
                            <TextX
                              fontSize="sm"
                              color="primary"
                              marginTop={vs(4)}>
                              Stats
                            </TextX>
                          </TouchableX>
                        )}
                      </ViewX>
                    </SquircleViewContainer>
                  </ViewX>
                </TouchableWithoutFeedback>
              </Animated.View>
            </ViewX>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: vs(8),
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    paddingHorizontal: s(16),
    paddingBottom: vs(40),
    paddingTop: vs(16),
  },
  modalContent: {
    padding: s(16),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  closeButton: {
    padding: s(4),
  },
  modalDivider: {
    height: 1,
    marginBottom: vs(16),
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: s(72),
    alignItems: 'center',
    marginBottom: vs(16),
  },
  actionIcon: {
    width: s(44),
    height: s(44),
    borderRadius: s(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HabitCard;
