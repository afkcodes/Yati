import {Bell, Plus, Trash2} from 'lucide-react-native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {baseStyles, COLORS} from './styles';

interface RemindersProps {
  reminders: Date[];
  onAddReminder: () => void;
  onRemoveReminder: (index: number) => void;
}

export const Reminders: React.FC<RemindersProps> = ({
  reminders,
  onAddReminder,
  onRemoveReminder,
}) => {
  return (
    <View style={baseStyles.inputGroup}>
      <View style={styles.reminderHeader}>
        <Text style={baseStyles.label}>Reminders</Text>
        <TouchableOpacity style={baseStyles.addButton} onPress={onAddReminder}>
          <Plus size={20} color={COLORS.primary} />
          <Text style={baseStyles.addButtonText}>Add Reminder</Text>
        </TouchableOpacity>
      </View>

      {reminders.length > 0 && (
        <View style={styles.remindersList}>
          {reminders.map((reminder, index) => (
            <View key={index} style={styles.reminderItem}>
              <View style={styles.reminderTime}>
                <Bell size={20} color={COLORS.text} />
                <Text style={styles.reminderTimeText}>
                  {reminder.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => onRemoveReminder(index)}
                style={styles.removeButton}>
                <Trash2 size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  remindersList: {
    gap: 8,
    marginTop: 8,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
  },
  reminderTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reminderTimeText: {
    color: COLORS.text,
    fontSize: 15,
  },
  removeButton: {
    padding: 4,
  },
});
