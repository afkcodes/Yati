// types/common.types.ts
export type HabitType = 'YesNo' | 'Measurable' | 'TimeBased';

export interface Habit {
  id: string;
  type: HabitType;
  title: string;
  frequency: string;
  goal?: number;
  unit?: string;
  color: string;
  isCompleted: boolean;
  streak: number;
  createdAt: string;
}
