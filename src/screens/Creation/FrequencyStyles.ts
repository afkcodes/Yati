import {StyleSheet} from 'react-native';

export const COLORS = {
  background: '#1C1C1E',
  surface: '#2C2C2E',
  surfaceHighlight: '#3A3A3C',
  primary: '#34C759',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#3A3A3C',
};

export const frequencyStyles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  // Header
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },

  // Frequency Selection
  frequencyButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  frequencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    gap: 6,
  },
  frequencyButtonActive: {
    backgroundColor: COLORS.primary,
  },
  frequencyText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  frequencyTextActive: {
    color: COLORS.text,
  },

  // Detail Container
  detailContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  detailLabel: {
    fontSize: 15,
    color: COLORS.text,
  },

  // Hourly Input
  hourlyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  intervalInput: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 60,
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Daily Time Selection
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  timeText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
  },

  // Weekly Selection
  weekDayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  weekDayButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    minWidth: '13%',
    alignItems: 'center',
  },
  weekDayButtonActive: {
    backgroundColor: COLORS.primary,
  },
  weekDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  weekDayTextActive: {
    color: COLORS.text,
  },

  // Monthly Selection
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  dateButton: {
    width: '13%',
    aspectRatio: 1,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButtonActive: {
    backgroundColor: COLORS.primary,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  dateTextActive: {
    color: COLORS.text,
  },
});
