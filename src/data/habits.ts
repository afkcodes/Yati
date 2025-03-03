export interface Habit {
  id: string;
  title: string;
  frequency: string;
  timePeriod: TimePeriod;
  color: string;
  weekDays: Array<{
    day: string;
    date: number;
    isCompleted?: boolean;
  }>;
  target: number;
  current: number;
  streak: number;
  startDate: string;
  description?: string;
  category: 'health' | 'learning' | 'productivity' | 'mindfulness';
}

export const habitData: Habit[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    frequency: 'Everyday',
    timePeriod: 'morning',
    color: '#FF6B6B', // Coral red
    weekDays: [
      {day: 'Tue', date: 15},
      {day: 'Mon', date: 14, isCompleted: true},
      {day: 'Sun', date: 13, isCompleted: true},
      {day: 'Sat', date: 12},
      {day: 'Fri', date: 11, isCompleted: true},
      {day: 'Thu', date: 10, isCompleted: true},
      {day: 'Wed', date: 9},
    ],
    target: 10,
    current: 7,
    streak: 2,
    startDate: '2024-01-01',
    description: '10 minutes mindful meditation',
    category: 'mindfulness',
  },
  {
    id: '2',
    title: 'Learn English',
    frequency: '4 times a week',
    timePeriod: 'evening',
    color: '#3478F6', // Blue
    weekDays: [
      {day: 'Tue', date: 15},
      {day: 'Mon', date: 14, isCompleted: true},
      {day: 'Sun', date: 13, isCompleted: true},
      {day: 'Sat', date: 12, isCompleted: true},
      {day: 'Fri', date: 11, isCompleted: true},
      {day: 'Thu', date: 10},
      {day: 'Wed', date: 9},
    ],
    target: 4,
    current: 4,
    streak: 4,
    startDate: '2024-01-05',
    description: '30 minutes language practice',
    category: 'learning',
  },
  {
    id: '3',
    title: 'Evening Yoga',
    frequency: '3 times a week',
    timePeriod: 'evening',
    color: '#32D74B', // Green
    weekDays: [
      {day: 'Tue', date: 15},
      {day: 'Mon', date: 14, isCompleted: true},
      {day: 'Sun', date: 13, isCompleted: true},
      {day: 'Sat', date: 12},
      {day: 'Fri', date: 11, isCompleted: true},
      {day: 'Thu', date: 10},
      {day: 'Wed', date: 9},
    ],
    target: 3,
    current: 3,
    streak: 3,
    startDate: '2024-01-10',
    description: '20 minutes yoga session',
    category: 'health',
  },
  {
    id: '4',
    title: 'Read Books',
    frequency: 'Everyday',
    timePeriod: 'night',
    color: '#BF5AF2', // Purple
    weekDays: [
      {day: 'Tue', date: 15},
      {day: 'Mon', date: 14, isCompleted: true},
      {day: 'Sun', date: 13, isCompleted: true},
      {day: 'Sat', date: 12, isCompleted: true},
      {day: 'Fri', date: 11, isCompleted: true},
      {day: 'Thu', date: 10, isCompleted: true},
      {day: 'Wed', date: 9, isCompleted: true},
    ],
    target: 7,
    current: 7,
    streak: 7,
    startDate: '2024-01-01',
    description: 'Read for 30 minutes',
    category: 'learning',
  },
  {
    id: '5',
    title: 'Morning Exercise',
    frequency: '5 times a week',
    timePeriod: 'morning',
    color: '#FF9F0A', // Orange
    weekDays: [
      {day: 'Tue', date: 15},
      {day: 'Mon', date: 14, isCompleted: true},
      {day: 'Sun', date: 13},
      {day: 'Sat', date: 12, isCompleted: true},
      {day: 'Fri', date: 11, isCompleted: true},
      {day: 'Thu', date: 10, isCompleted: true},
      {day: 'Wed', date: 9, isCompleted: true},
    ],
    target: 5,
    current: 4,
    streak: 4,
    startDate: '2024-01-03',
    description: '30 minutes workout',
    category: 'health',
  },
  {
    id: '6',
    title: 'Journal Writing',
    frequency: 'Everyday',
    timePeriod: 'night',
    color: '#64D2FF', // Light blue
    weekDays: [
      {day: 'Tue', date: 15},
      {day: 'Mon', date: 14, isCompleted: true},
      {day: 'Sun', date: 13, isCompleted: true},
      {day: 'Sat', date: 12, isCompleted: true},
      {day: 'Fri', date: 11},
      {day: 'Thu', date: 10, isCompleted: true},
      {day: 'Wed', date: 9, isCompleted: true},
    ],
    target: 7,
    current: 5,
    streak: 3,
    startDate: '2024-01-01',
    description: '15 minutes reflection',
    category: 'mindfulness',
  },
];

// Helper function to filter habits by time period
export const filterHabitsByTime = (
  habits: Habit[],
  timePeriod: TimePeriod | 'all',
) => {
  if (timePeriod === 'all') {
    return habits;
  }
  return habits.filter(habit => habit.timePeriod === timePeriod);
};

// Helper function to get stats for habits
export const getHabitStats = (habits: Habit[]) => {
  return {
    total: habits.length,
    completed: habits.filter(h => h.current >= h.target).length,
    streaks: Math.max(...habits.map(h => h.streak)),
    byCategory: habits.reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
};

// Types file (types.ts)
export type TimePeriod = 'morning' | 'evening' | 'night';
export type HabitCategory =
  | 'health'
  | 'learning'
  | 'productivity'
  | 'mindfulness';
