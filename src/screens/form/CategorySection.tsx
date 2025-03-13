import {LegendList} from '@legendapp/list';
import {Check, ChevronDown} from 'lucide-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {TextX, TouchableX, ViewX} from '~/components/common';
import {HabitCategory} from '~/types/habit.types';
import {HABIT_CATEGORIES} from '~/utils/constants/habitConstants';
import SquircleViewContainer from '~containers/SquircleViewContainer';
import {useTheme} from '~hooks/ThemeContext';
import {getThemeColor, withAlpha} from '~styles/theme';
import {s, vs} from '~utils/screenUtil';
import {SectionLabel} from './BasicInfo';

interface CategorySectionProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: HabitCategory) => void;
  error?: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  selectedCategoryId,
  onSelectCategory,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {theme} = useTheme();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const modalY = useRef(new Animated.Value(300)).current;

  // Theme colors
  const bgColor = getThemeColor(theme, 'background', 'base');
  const surfaceColor = getThemeColor(theme, 'background', 'surface');
  const fieldColor = getThemeColor(theme, 'background', 'field');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const errorColor = getThemeColor(theme, 'text', 'error');
  const textSecondary = getThemeColor(theme, 'text', 'secondary');
  const accentColor = getThemeColor(theme, 'text', 'accent');

  const selectedCategory = HABIT_CATEGORIES.find(
    c => c.id === selectedCategoryId,
  );

  // Animate chevron rotation
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: modalVisible ? 1 : 0,
      duration: 250,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();

    if (modalVisible) {
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
  }, [modalVisible, rotateAnim, overlayOpacity, modalY]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handleCategorySelect = (categoryId: HabitCategory) => {
    onSelectCategory(categoryId);
    setModalVisible(false);
  };

  // LegendList renderItem function for categories
  const renderCategoryItem = ({item}: {item: (typeof HABIT_CATEGORIES)[0]}) => {
    const isSelected = item.id === selectedCategoryId;

    return (
      <TouchableX
        onPress={() => handleCategorySelect(item.id as HabitCategory)}
        backgroundColor={
          isSelected ? withAlpha(item.color, 0.08) : 'transparent'
        }
        style={styles.categoryOption}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        accessibilityLabel={item.name}
        accessibilityRole="radio"
        accessibilityState={{checked: isSelected}}>
        <ViewX flexDirection="row" alignItems="center">
          <SquircleViewContainer
            borderRadius="md"
            backgroundColor={withAlpha(item.color, 0.12)}
            width={s(48)}
            height={s(48)}>
            <ViewX style={styles.categoryIconContainer}>
              <item.icon size={24} color={item.color} strokeWidth={1.5} />
            </ViewX>
          </SquircleViewContainer>

          <ViewX marginLeft={s(12)}>
            <TextX fontSize="md" fontWeight="medium" color="primary">
              {item.name}
            </TextX>
            <TextX fontSize="xs" color="tertiary" marginTop={vs(2)}>
              {item.description}
            </TextX>
          </ViewX>
        </ViewX>

        {isSelected && (
          <ViewX
            width={s(28)}
            height={s(28)}
            borderRadius={s(14)}
            backgroundColor={withAlpha(item.color, 0.15)}
            justifyContent="center"
            alignItems="center">
            <Check size={16} color={item.color} strokeWidth={2} />
          </ViewX>
        )}
      </TouchableX>
    );
  };

  return (
    <ViewX>
      <SectionLabel
        title="Category"
        isRequired
        caption="Categorize your habit to keep things organized"
      />

      {/* Category Selector */}
      <SquircleViewContainer
        borderRadius="md"
        backgroundColor={fieldColor}
        borderColor={error ? errorColor : borderColor}
        borderWidth={error ? 2 : 1}
        height={vs(64)}>
        <TouchableX
          onPress={() => setModalVisible(true)}
          style={styles.selectorContainer}
          backgroundColor="transparent"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          accessibilityLabel="Select category"
          accessibilityHint="Tap to choose a category for your habit">
          <ViewX flexDirection="row" alignItems="center">
            {selectedCategory ? (
              <>
                <ViewX
                  width={s(44)}
                  height={s(44)}
                  borderRadius={s(12)}
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor={withAlpha(selectedCategory.color, 0.15)}
                  marginRight={s(12)}>
                  {/* {React.createElement(
                    getIconComponent(selectedCategory.icon),
                    {
                      size: 22,
                      color: selectedCategory.color,
                      strokeWidth: 1.5,
                    },
                  )} */}
                  <selectedCategory.icon
                    size={22}
                    color={selectedCategory.color}
                    strokeWidth={1.5}
                  />
                </ViewX>
                <ViewX>
                  <TextX fontSize="md" fontWeight="medium" color="primary">
                    {selectedCategory.name}
                  </TextX>
                  <TextX fontSize="xs" color="tertiary" marginTop={vs(2)}>
                    {selectedCategory.description}
                  </TextX>
                </ViewX>
              </>
            ) : (
              <TextX fontSize="md" color="tertiary">
                Select a category
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

      {/* Category Grid */}
      <ViewX style={styles.categoryGridContainer}>
        <ViewX style={styles.categoryGrid}>
          {HABIT_CATEGORIES.slice(0, 4).map(category => (
            <CategoryGridItem
              key={category.id}
              category={category}
              isSelected={category.id === selectedCategoryId}
              onSelect={() =>
                handleCategorySelect(category.id as HabitCategory)
              }
            />
          ))}
        </ViewX>
      </ViewX>

      {/* Category Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
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
                    Select Category
                  </TextX>
                  <TouchableX
                    paddingVertical={vs(6)}
                    paddingHorizontal={s(12)}
                    borderRadius={s(20)}
                    backgroundColor={withAlpha(accentColor, 0.1)}
                    onPress={() => setModalVisible(false)}>
                    <TextX fontSize="sm" fontWeight="medium" color="accent">
                      Done
                    </TextX>
                  </TouchableX>
                </ViewX>

                <ViewX
                  style={styles.modalDivider}
                  backgroundColor={withAlpha(borderColor, 0.5)}
                />

                {/* Using LegendList for scrollable, efficient rendering */}
                <LegendList
                  data={HABIT_CATEGORIES}
                  keyExtractor={item => item.id}
                  renderItem={renderCategoryItem}
                  contentContainerStyle={styles.legendListContent}
                  showsVerticalScrollIndicator={false}
                  estimatedItemSize={vs(84)} // Approximate height of each item
                />
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </ViewX>
  );
};

// Category grid item component for the quick selection grid
interface CategoryGridItemProps {
  category: (typeof HABIT_CATEGORIES)[0];
  isSelected: boolean;
  onSelect: () => void;
}

const CategoryGridItem: React.FC<CategoryGridItemProps> = ({
  category,
  isSelected,
  onSelect,
}) => {
  const itemRef = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isSelected) {
      Animated.sequence([
        Animated.timing(itemRef, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(itemRef, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSelected, itemRef]);

  return (
    <Animated.View style={{transform: [{scale: itemRef}]}}>
      <SquircleViewContainer
        borderRadius="md"
        backgroundColor={withAlpha(category.color, isSelected ? 0.2 : 0.1)}
        borderColor={isSelected ? category.color : 'transparent'}
        borderWidth={isSelected ? 1.5 : 0}
        width={s(76)}
        height={s(76)}>
        <TouchableX
          onPress={onSelect}
          style={styles.gridItem}
          backgroundColor="transparent"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          accessibilityLabel={category.name}
          accessibilityRole="radio"
          accessibilityState={{checked: isSelected}}>
          <category.icon size={22} color={category.color} strokeWidth={1.5} />
          <TextX
            fontSize="xs"
            fontWeight={isSelected ? 'semibold' : 'medium'}
            color={category.color}
            marginTop={vs(8)}
            numberOfLines={1}>
            {category.name}
          </TextX>
        </TouchableX>
      </SquircleViewContainer>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  selectorContainer: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
  },
  categoryGridContainer: {
    marginTop: vs(16),
    marginBottom: vs(8),
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '100%',
    height: '100%',
    padding: s(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  legendListContent: {
    paddingHorizontal: s(16),
    paddingBottom: vs(24),
  },
  categoryOption: {
    paddingVertical: vs(12),
    paddingHorizontal: s(12),
    borderRadius: 12,
    marginBottom: vs(8),
  },
});

export default CategorySection;
