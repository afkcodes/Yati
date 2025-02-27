import {
  Book,
  Brain,
  Briefcase,
  Check,
  Coffee,
  Dumbbell,
  GraduationCap,
  Heart,
  Palette,
} from 'lucide-react-native';
import {TextX, TouchableX, ViewX} from '~components/common';
import {closeModal} from '~hooks/useModalControl';
import {h} from '~utils/screenUtil';

export interface Category {
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

const CategorySelectModal = ({selectedCategory, handleSelectCategory}: any) => {
  return (
    <ViewX
      flex={1}
      justifyContent="flex-end"
      backgroundColor="rgba(0, 0, 0, 0.5)">
      <ViewX maxHeight={h(90)} backgroundColor="#1C1C1E">
        {/* Fixed Header */}
        <ViewX
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={16}
          paddingVertical={8}
          borderBottomWidth={1}
          borderBottomColor="#2C2C2E">
          <TextX fontSize="lg" fontWeight="semibold">
            Choose Category
          </TextX>
          <TouchableX
            padding={8}
            onPress={() => {
              closeModal();
            }}>
            <TextX fontSize="lg" fontWeight="semibold" color="accent">
              Done
            </TextX>
          </TouchableX>
        </ViewX>

        {/* Content Container */}
        <ViewX flexShrink={1}>
          {/* Categories List - Scrollable */}
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
        </ViewX>
      </ViewX>
    </ViewX>
  );
};

export default CategorySelectModal;
