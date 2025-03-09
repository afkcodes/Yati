// components/habit/form/CategorySection.tsx
import {LegendList} from '@legendapp/list';
import * as Icons from 'lucide-react-native';
import {Check, ChevronRight} from 'lucide-react-native';
import React, {useState} from 'react';
import {Modal, StyleSheet} from 'react-native';
import {TextX, TouchableX, ViewX} from '~/components/common';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';
import {HabitCategory} from '~/types/habit.types';
import {HABIT_CATEGORIES} from '~/utils/constants/habitConstants';
import {SectionLabel} from './BasicInfo';

interface CategorySectionProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: HabitCategory) => void;
  error?: string;
}

// Helper to dynamically get the icon component
const getIconComponent = (iconName: string) => {
  return (Icons as any)[iconName] || Icons.HelpCircle;
};

const CategorySection: React.FC<CategorySectionProps> = ({
  selectedCategoryId,
  onSelectCategory,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {theme} = useTheme();

  const bgColor = getThemeColor(theme, 'background', 'base');
  const surfaceColor = getThemeColor(theme, 'background', 'surface');
  const fieldColor = getThemeColor(theme, 'background', 'field');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const errorColor = getThemeColor(theme, 'text', 'error');
  const textPlaceholder = getThemeColor(theme, 'text', 'tertiary');

  const selectedCategory = HABIT_CATEGORIES.find(
    c => c.id === selectedCategoryId,
  );

  const handleSelect = (categoryId: HabitCategory) => {
    onSelectCategory(categoryId);
    setModalVisible(false);
  };

  return (
    <ViewX marginBottom={styleUtils.spacing.xl}>
      <SectionLabel title="Category" />

      <TouchableX
        height={44}
        borderRadius={styleUtils.borderRadius.xs}
        borderWidth={error ? 2 : 1}
        paddingHorizontal={styleUtils.spacing.sm}
        justifyContent="space-between"
        flexDirection="row"
        alignItems="center"
        backgroundColor={fieldColor}
        borderColor={error ? errorColor : borderColor}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Select category"
        accessibilityHint="Choose a category for your habit">
        <ViewX flexDirection="row" alignItems="center">
          {selectedCategory ? (
            <>
              <ViewX
                width={28}
                height={28}
                borderRadius={6}
                justifyContent="center"
                alignItems="center"
                marginRight={8}
                backgroundColor={withAlpha(selectedCategory.color, 0.1)}>
                {React.createElement(getIconComponent(selectedCategory.icon), {
                  size: 16,
                  color: selectedCategory.color,
                  strokeWidth: 1.5,
                })}
              </ViewX>
              <TextX fontSize="sm" color="primary">
                {selectedCategory.name}
              </TextX>
            </>
          ) : (
            <TextX fontSize="sm" color="tertiary">
              Select a category
            </TextX>
          )}
        </ViewX>
        <ChevronRight size={16} color={textPlaceholder} strokeWidth={1.5} />
      </TouchableX>

      {error && (
        <TextX fontSize="xs" color="error" marginTop={styleUtils.spacing.xs}>
          {error}
        </TextX>
      )}

      {/* Category selection modal */}
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
                Select Category
              </TextX>
              <TouchableX
                paddingVertical={6}
                paddingHorizontal={10}
                onPress={() => setModalVisible(false)}>
                <TextX fontSize="sm" fontWeight="medium" color="accent">
                  Done
                </TextX>
              </TouchableX>
            </ViewX>

            {/* Categories list */}
            <ViewX paddingTop={styleUtils.spacing.xs}>
              <TextX
                fontSize="xs"
                color="tertiary"
                fontWeight="medium"
                textTransform="uppercase"
                paddingHorizontal={styleUtils.spacing.md}
                marginBottom={styleUtils.spacing.xs}
                marginTop={styleUtils.spacing.xs}>
                All Categories
              </TextX>
            </ViewX>

            <LegendList
              data={HABIT_CATEGORIES}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TouchableX
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingVertical={styleUtils.spacing.sm}
                  paddingHorizontal={styleUtils.spacing.md}
                  backgroundColor={
                    selectedCategoryId === item.id
                      ? withAlpha(item.color, 0.07)
                      : 'transparent'
                  }
                  onPress={() => handleSelect(item.id)}
                  accessibilityLabel={item.name}
                  accessibilityRole="radio"
                  accessibilityState={{
                    checked: selectedCategoryId === item.id,
                  }}>
                  <ViewX flexDirection="row" alignItems="center" flex={1}>
                    <ViewX
                      width={40}
                      height={40}
                      borderRadius={12}
                      justifyContent="center"
                      alignItems="center"
                      marginRight={styleUtils.spacing.sm}
                      backgroundColor={withAlpha(item.color, 0.1)}>
                      {React.createElement(getIconComponent(item.icon), {
                        size: 20,
                        color: item.color,
                        strokeWidth: 1.5,
                      })}
                    </ViewX>
                    <ViewX flex={1}>
                      <TextX fontSize="md" color="primary" marginBottom={2}>
                        {item.name}
                      </TextX>
                      <TextX fontSize="xs" color="tertiary">
                        {item.description}
                      </TextX>
                    </ViewX>
                  </ViewX>

                  {selectedCategoryId === item.id && (
                    <Check size={20} color={item.color} strokeWidth={1.5} />
                  )}
                </TouchableX>
              )}
              contentContainerStyle={{paddingBottom: 30}}
            />
          </ViewX>
        </ViewX>
      </Modal>
    </ViewX>
  );
};

export default CategorySection;
