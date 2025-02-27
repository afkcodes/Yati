import {Bell, Plus, Trash2} from 'lucide-react-native';
import React from 'react';
import {TextX, TouchableX, ViewX} from '~components/common';
import {themes} from '~styles/theme';

const COLORS = {
  background: themes.dark.background.primary,
  surface: '#2C2C2E',
  primary: '#34C759',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  danger: '#FF3B30',
};

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
    <ViewX marginBottom={24}>
      <ViewX
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={8}>
        <TextX
          fontSize="lg"
          fontWeight="semibold"
          color="primary"
          marginBottom={8}>
          Reminders
        </TextX>
        <TouchableX
          flexDirection="row"
          alignItems="center"
          gap={8}
          padding={8}
          onPress={onAddReminder}>
          <Plus size={20} color={COLORS.primary} />
          <TextX fontSize="md" fontWeight="medium" color="accent">
            Add Reminder
          </TextX>
        </TouchableX>
      </ViewX>

      {reminders.length > 0 && (
        <ViewX gap={8} marginTop={8}>
          {reminders.map((reminder, index) => (
            <ViewX
              key={index}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              backgroundColor={COLORS.surface}
              padding={12}
              borderRadius={8}>
              <ViewX flexDirection="row" alignItems="center" gap={8}>
                <Bell size={20} color={COLORS.text} />
                <TextX fontSize="md" color="primary">
                  {reminder.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TextX>
              </ViewX>
              <TouchableX padding={4} onPress={() => onRemoveReminder(index)}>
                <Trash2 size={20} color={COLORS.danger} />
              </TouchableX>
            </ViewX>
          ))}
        </ViewX>
      )}
    </ViewX>
  );
};
