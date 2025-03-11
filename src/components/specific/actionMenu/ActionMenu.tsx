import {Edit2, Settings, Trash2, X} from 'lucide-react-native';
import {Alert, Modal, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {TextX, TouchableX, ViewX} from '~components/common';
import {getThemeColor, withAlpha} from '~styles/theme';

// Define ActionMenu outside the main component
interface ActionMenuProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onArchive: () => void;
  theme: 'dark' | 'light';
  insets: {
    bottom: number;
  };
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  visible,
  onClose,
  onEdit,
  onDelete,
  onArchive,
  theme,
  insets,
}) => {
  const bgColor = getThemeColor(theme, 'background', 'base');
  const surfaceColor = getThemeColor(theme, 'background', 'surface');
  const textPrimary = getThemeColor(theme, 'text', 'primary');
  const borderColor = getThemeColor(theme, 'border', 'subtle');

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <ViewX
          flex={1}
          backgroundColor={withAlpha(bgColor, 0.7)}
          justifyContent="flex-end">
          <ViewX
            backgroundColor={surfaceColor}
            borderTopLeftRadius={16}
            borderTopRightRadius={16}
            paddingBottom={insets.bottom || 16}>
            <ViewX
              paddingHorizontal={16}
              paddingVertical={14}
              borderBottomWidth={StyleSheet.hairlineWidth}
              borderBottomColor={borderColor}>
              <TextX fontSize="lg" fontWeight="semibold" color="primary">
                Habit Options
              </TextX>
            </ViewX>

            <TouchableX
              flexDirection="row"
              alignItems="center"
              paddingVertical={16}
              paddingHorizontal={20}
              onPress={onEdit}>
              <Edit2 size={20} color={textPrimary} strokeWidth={1.5} />
              <TextX fontSize="md" color="primary" marginLeft={16}>
                Edit Habit
              </TextX>
            </TouchableX>

            <TouchableX
              flexDirection="row"
              alignItems="center"
              paddingVertical={16}
              paddingHorizontal={20}
              onPress={() => {
                onClose();
                Alert.alert('Coming Soon', 'This feature is not yet available');
              }}>
              <Settings size={20} color={textPrimary} strokeWidth={1.5} />
              <TextX fontSize="md" color="primary" marginLeft={16}>
                Habit Settings
              </TextX>
            </TouchableX>

            <TouchableX
              flexDirection="row"
              alignItems="center"
              paddingVertical={16}
              paddingHorizontal={20}
              onPress={onArchive}>
              <X size={20} color={textPrimary} strokeWidth={1.5} />
              <TextX fontSize="md" color="primary" marginLeft={16}>
                Archive Habit
              </TextX>
            </TouchableX>

            <TouchableX
              flexDirection="row"
              alignItems="center"
              paddingVertical={16}
              paddingHorizontal={20}
              onPress={onDelete}>
              <Trash2
                size={20}
                color={getThemeColor(theme, 'text', 'error')}
                strokeWidth={1.5}
              />
              <TextX fontSize="md" color="error" marginLeft={16}>
                Delete Habit
              </TextX>
            </TouchableX>
          </ViewX>
        </ViewX>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ActionMenu;
