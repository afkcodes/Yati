import {ChevronRight} from 'lucide-react-native';
import {useState} from 'react';
import {TextX, TouchableX, ViewX} from '~components/common';
import {closeModal, useModalControl} from '~hooks/useModalControl';
import {styleUtils} from '~styles/theme';
import CategorySelectModal, {Category} from './CategorySelectModal';

const CategorySelectTrigger = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const handleSelectCategory = (category: any) => {
    setSelectedCategory(category as Category);
    closeModal();
  };

  const openCategoryModal = useModalControl(
    CategorySelectModal,
    {handleSelectCategory},
    {isOpen: true},
  );

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
        onPress={() => {
          openCategoryModal();
        }}>
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
              <TextX fontSize="lg">{selectedCategory.name}</TextX>
            </>
          ) : (
            <TextX fontSize="lg">Select a category</TextX>
          )}
        </ViewX>
        <ChevronRight size={20} color="#8E8E93" />
      </TouchableX>
    </ViewX>
  );
};

export default CategorySelectTrigger;
