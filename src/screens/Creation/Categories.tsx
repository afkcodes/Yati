import {
  Book,
  Brain,
  Briefcase,
  Check,
  ChevronRight,
  Coffee,
  Dumbbell,
  GraduationCap,
  Heart,
  Palette,
} from 'lucide-react-native';
import React, {useState} from 'react';
import {Modal, ScrollView} from 'react-native';
import {TextX, TouchableX, ViewX} from '~components/common';
import {styleUtils} from '~styles/theme';
import {h} from '~utils/screenUtil';

interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'health',
    name: 'Health',
    icon: Heart,
    color: '#FF2D55',
    description: 'Physical wellbeing and healthy habits',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: Dumbbell,
    color: '#5856D6',
    description: 'Exercise and physical activity',
  },
  {
    id: 'learning',
    name: 'Learning',
    icon: GraduationCap,
    color: '#FF9500',
    description: 'Education and skill development',
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    icon: Brain,
    color: '#34C759',
    description: 'Mental health and meditation',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: Coffee,
    color: '#007AFF',
    description: 'Time management and efficiency',
  },
  {
    id: 'creativity',
    name: 'Creativity',
    icon: Palette,
    color: '#AF52DE',
    description: 'Artistic and creative pursuits',
  },
  {
    id: 'career',
    name: 'Career',
    icon: Briefcase,
    color: '#5856D6',
    description: 'Professional development',
  },
  {
    id: 'reading',
    name: 'Reading',
    icon: Book,
    color: '#FF3B30',
    description: 'Books and literature',
  },
];

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [showModal, setShowModal] = useState(false);
  // const [recentCategories, setRecentCategories] = useState<Category[]>([]);

  const handleSelectCategory = (category: Category) => {
    onSelectCategory(category);
    updateRecentCategories(category);
    setShowModal(false);
  };

  const updateRecentCategories = (category: Category) => {
    // setRecentCategories(prev => {
    //   const newRecent = prev.filter(c => c.id !== category.id);
    //   newRecent.unshift(category);
    //   return newRecent.slice(0, 3);
    // });
    console.log(category);
  };

  return (
    <ViewX>
      <TextX
        fontSize="lg"
        fontWeight="semibold"
        marginBottom={styleUtils.spacing.sm}>
        Category
      </TextX>
      <TouchableX
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="#2C2C2E"
        padding={16}
        borderRadius={12}
        onPress={() => setShowModal(true)}>
        <ViewX
          flexDirection="row"
          gap={styleUtils.spacing.md}
          alignItems="center">
          {selectedCategory ? (
            <>
              <ViewX
                width={32}
                height={32}
                borderRadius={8}
                justifyContent="center"
                alignItems="center"
                backgroundColor={selectedCategory.color}>
                <selectedCategory.icon size={20} color="#FFFFFF" />
              </ViewX>
              <TextX fontSize="lg" color="primary">
                {selectedCategory.name}
              </TextX>
            </>
          ) : (
            <TextX fontSize="lg" color="tertiary">
              Select a category
            </TextX>
          )}
        </ViewX>
        <ChevronRight size={20} color="#8E8E93" />
      </TouchableX>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}>
        <ViewX
          flex={1}
          justifyContent="flex-end"
          backgroundColor="rgba(0, 0, 0, 0.5)">
          <ViewX
            maxHeight={h(90)}
            backgroundColor="#1C1C1E"
            borderTopLeftRadius={12}
            borderTopRightRadius={12}>
            {/* Fixed Header */}
            <ViewX
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              padding={16}
              borderBottomWidth={1}
              borderBottomColor="#2C2C2E">
              <TextX fontSize="lg" fontWeight="semibold">
                Choose Category
              </TextX>
              <TouchableX padding={8} onPress={() => setShowModal(false)}>
                <TextX fontSize="lg" fontWeight="semibold" color="accent">
                  Done
                </TextX>
              </TouchableX>
            </ViewX>

            {/* Content Container */}
            <ViewX flexShrink={1}>
              {/* Categories List - Scrollable */}
              <ScrollView>
                <ViewX padding={16}>
                  <TextX
                    fontSize="sm"
                    fontWeight="semibold"
                    color="tertiary"
                    marginBottom={12}
                    textTransform="uppercase">
                    All Categories
                  </TextX>
                  {CATEGORIES.map(category => (
                    <TouchableX
                      key={category.id}
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      paddingVertical={12}
                      borderBottomWidth={1}
                      borderBottomColor="#2C2C2E"
                      onPress={() => handleSelectCategory(category)}>
                      <ViewX
                        flexDirection="row"
                        alignItems="center"
                        gap={12}
                        flex={1}>
                        <ViewX
                          width={32}
                          height={32}
                          borderRadius={8}
                          justifyContent="center"
                          alignItems="center"
                          backgroundColor={category.color}>
                          <category.icon size={20} color="#FFFFFF" />
                        </ViewX>
                        <ViewX flex={1}>
                          <TextX fontSize="lg" color="primary" marginBottom={4}>
                            {category.name}
                          </TextX>
                          <TextX fontSize="sm" color="tertiary">
                            {category.description}
                          </TextX>
                        </ViewX>
                      </ViewX>
                      {selectedCategory?.id === category.id && (
                        <Check size={20} color={category.color} />
                      )}
                    </TouchableX>
                  ))}
                </ViewX>
              </ScrollView>
            </ViewX>
          </ViewX>
        </ViewX>
      </Modal>
    </ViewX>
  );
};
