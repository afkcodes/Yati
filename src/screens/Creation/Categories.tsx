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
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

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
  const [recentCategories, setRecentCategories] = useState<Category[]>([]);

  const handleSelectCategory = (category: Category) => {
    onSelectCategory(category);
    updateRecentCategories(category);
    setShowModal(false);
  };

  const updateRecentCategories = (category: Category) => {
    setRecentCategories(prev => {
      const newRecent = prev.filter(c => c.id !== category.id);
      newRecent.unshift(category);
      return newRecent.slice(0, 3);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>

      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => setShowModal(true)}>
        <View style={styles.selectedCategory}>
          {selectedCategory ? (
            <>
              <View
                style={[
                  styles.iconContainer,
                  {backgroundColor: selectedCategory.color},
                ]}>
                <selectedCategory.icon size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.selectedText}>{selectedCategory.name}</Text>
            </>
          ) : (
            <Text style={styles.placeholderText}>Select a category</Text>
          )}
        </View>
        <ChevronRight size={20} color="#8E8E93" />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Category</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}>
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>

            {recentCategories.length > 0 && (
              <View style={styles.recentSection}>
                <Text style={styles.sectionTitle}>Recent</Text>
                <View style={styles.recentGrid}>
                  {recentCategories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.recentItem}
                      onPress={() => handleSelectCategory(category)}>
                      <View
                        style={[
                          styles.iconContainer,
                          {backgroundColor: category.color},
                        ]}>
                        <category.icon size={20} color="#FFFFFF" />
                      </View>
                      <Text style={styles.recentItemText}>{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.categoriesList}>
              <Text style={styles.sectionTitle}>All Categories</Text>
              {CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryItem}
                  onPress={() => handleSelectCategory(category)}>
                  <View style={styles.categoryInfo}>
                    <View
                      style={[
                        styles.iconContainer,
                        {backgroundColor: category.color},
                      ]}>
                      <category.icon size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.categoryText}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categoryDescription}>
                        {category.description}
                      </Text>
                    </View>
                  </View>
                  {selectedCategory?.id === category.id && (
                    <Check size={20} color={category.color} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
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
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 17,
    color: '#FFFFFF',
  },
  placeholderText: {
    fontSize: 17,
    color: '#8E8E93',
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
    maxHeight: '90%',
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
  recentSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  recentGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  recentItem: {
    alignItems: 'center',
    gap: 8,
  },
  recentItemText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  categoriesList: {
    padding: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryText: {
    flex: 1,
  },
  categoryName: {
    fontSize: 17,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
    color: '#8E8E93',
  },
});
