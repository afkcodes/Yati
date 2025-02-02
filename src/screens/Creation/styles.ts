import {StyleSheet} from 'react-native';
import {themes} from '~styles/theme';

export const COLORS = {
  background: themes.dark.background.primary,
  surface: '#2C2C2E',
  primary: '#34C759',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  danger: '#FF3B30',
};

export const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 15,
  },
  button: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  buttonTextSelected: {
    color: COLORS.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '500',
  },
});
