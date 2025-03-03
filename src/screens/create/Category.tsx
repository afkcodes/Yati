/* eslint-disable react-native/no-inline-styles */
import {
  Book,
  Brain,
  Briefcase,
  Check,
  Coffee,
  Dumbbell,
  Heart,
  Moon,
  Target,
} from 'lucide-react-native';
import {useState} from 'react';
import {FlatList, Modal, StyleSheet} from 'react-native';
import {TextX, TouchableX, ViewX} from '~/components/common';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';

// Category definitions
const CATEGORIES = [
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    icon: Brain,
    color: '#8B5CF6',
    description: 'Meditation, awareness, calm',
  },
  {
    id: 'learning',
    name: 'Learning',
    icon: Book,
    color: '#3B82F6',
    description: 'Education, skills, knowledge',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: Dumbbell,
    color: '#10B981',
    description: 'Exercise, strength, movement',
  },
  {
    id: 'health',
    name: 'Health',
    icon: Heart,
    color: '#EF4444',
    description: 'Wellness, nutrition, self-care',
  },
  {
    id: 'sleep',
    name: 'Sleep',
    icon: Moon,
    color: '#6366F1',
    description: 'Rest, recovery, schedule',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: Coffee,
    color: '#F59E0B',
    description: 'Focus, efficiency, organization',
  },
  {
    id: 'goals',
    name: 'Goals',
    icon: Target,
    color: '#EC4899',
    description: 'Achievements, targets, progress',
  },
  {
    id: 'career',
    name: 'Career',
    icon: Briefcase,
    color: '#14B8A6',
    description: 'Work, professional growth',
  },
];

interface CategorySectionProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategorySection = ({
  selectedCategoryId,
  onSelectCategory,
}: CategorySectionProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {theme} = useTheme();

  const bgColor = getThemeColor(theme, 'background', 'base');
  const surfaceColor = getThemeColor(theme, 'background', 'surface');
  const fieldColor = getThemeColor(theme, 'background', 'field');
  const borderColor = getThemeColor(theme, 'border', 'subtle');

  const selectedCategory = CATEGORIES.find(c => c.id === selectedCategoryId);

  const handleSelect = (categoryId: string) => {
    onSelectCategory(categoryId);
    setModalVisible(false);
  };

  return (
    <ViewX marginBottom={styleUtils.spacing.xl}>
      <TextX
        fontSize="sm"
        fontWeight="medium"
        color="secondary"
        marginBottom={styleUtils.spacing.xs}
        accessibilityRole="header">
        Category
      </TextX>

      <TouchableX
        height={44}
        borderRadius={styleUtils.borderRadius.xs}
        borderWidth={1}
        paddingHorizontal={styleUtils.spacing.sm}
        justifyContent="center"
        backgroundColor={fieldColor}
        borderColor={borderColor}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Select category"
        accessibilityHint="Choose a category for your habit">
        {selectedCategory ? (
          <ViewX flexDirection="row" alignItems="center">
            <ViewX
              width={28}
              height={28}
              borderRadius={6}
              justifyContent="center"
              alignItems="center"
              marginRight={8}
              backgroundColor={withAlpha(selectedCategory.color, 0.1)}>
              <selectedCategory.icon
                size={16}
                color={selectedCategory.color}
                strokeWidth={1.5}
              />
            </ViewX>
            <TextX fontSize="sm" color="primary">
              {selectedCategory.name}
            </TextX>
          </ViewX>
        ) : (
          <TextX fontSize="sm" color="tertiary">
            Select a category
          </TextX>
        )}
      </TouchableX>

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

            {/* Categories by group */}
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

            <FlatList
              data={CATEGORIES}
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
                      <item.icon
                        size={20}
                        color={item.color}
                        strokeWidth={1.5}
                      />
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
