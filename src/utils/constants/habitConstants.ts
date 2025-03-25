// utils/constants/habitConstants.ts
import {
  Book,
  Brain,
  Briefcase,
  Coffee,
  Dumbbell,
  Heart,
  Moon,
  Target,
} from 'lucide-react-native';
import {HabitCategory} from '~types/habit.types';

// Category definitions with icons, colors, and descriptions
export const HABIT_CATEGORIES = [
  {
    id: 'mindfulness' as HabitCategory,
    name: 'Mindfulness',
    icon: Brain,
    color: '#8B5CF6',
    description: 'Meditation, awareness, calm',
  },
  {
    id: 'learning' as HabitCategory,
    name: 'Learning',
    icon: Book,
    color: '#3B82F6',
    description: 'Education, skills, knowledge',
  },
  {
    id: 'fitness' as HabitCategory,
    name: 'Fitness',
    icon: Dumbbell,
    color: '#10B981',
    description: 'Exercise, strength, movement',
  },
  {
    id: 'health' as HabitCategory,
    name: 'Health',
    icon: Heart,
    color: '#EF4444',
    description: 'Wellness, nutrition, self-care',
  },
  {
    id: 'sleep' as HabitCategory,
    name: 'Sleep',
    icon: Moon,
    color: '#6366F1',
    description: 'Rest, recovery, schedule',
  },
  {
    id: 'productivity' as HabitCategory,
    name: 'Productivity',
    icon: Coffee,
    color: '#F59E0B',
    description: 'Focus, efficiency, organization',
  },
  {
    id: 'goals' as HabitCategory,
    name: 'Goals',
    icon: Target,
    color: '#EC4899',
    description: 'Achievements, targets, progress',
  },
  {
    id: 'career' as HabitCategory,
    name: 'Career',
    icon: Briefcase,
    color: '#14B8A6',
    description: 'Work, professional growth',
  },
] as const;

export type HabitCategoryType = (typeof HABIT_CATEGORIES)[number]['id'];

// Predefined colors for habits
export const COLOR_PALETTE = [
  '#1E40AF', // Vivid Royal Blue (Productivity)
  '#2ECC71', // Bright Emerald Green (Health)
  '#9B59B6', // Radiant Amethyst (Mindfulness)
  '#F1C40F', // Electric Gold (Fitness)
  '#FF6B6B', // Vivid Coral (Self-care)
  '#6366F1', // Bright Amber (Morning)
  '#6B7280', // Slate Gray (Neutral)
  '#E91E63', // Hot Pink (Urgent tasks)
  '#00CED1', // Turquoise Blast (Hydration)
  '#D4A017', // Golden Sand (Routines)
  '#7D3C98', // Deep Violet (Learning)
  '#8B5CF6', // Lime Forest (Nature)
  '#E67E22', // Fiery Orange (Nutrition)
  '#8E44AD', // Vibrant Plum (Evening)
  '#FF5733', // Tangerine Glow (Social)
  '#16A085', // Teal Surge (Long-term goals)
] as const;

export type HabitColor = (typeof COLOR_PALETTE)[number];

// Days of the week for frequency selection
export const WEEKDAYS = [
  {id: 'mon', label: 'Mon'},
  {id: 'tue', label: 'Tue'},
  {id: 'wed', label: 'Wed'},
  {id: 'thu', label: 'Thu'},
  {id: 'fri', label: 'Fri'},
  {id: 'sat', label: 'Sat'},
  {id: 'sun', label: 'Sun'},
] as const;

export type WeeklyDay = (typeof WEEKDAYS)[number]['id'];

// Frequency type options
export const FREQUENCY_TYPES = [
  {id: 'hourly', label: 'Hourly', icon: 'Clock'},
  {id: 'daily', label: 'Daily', icon: 'Calendar'},
  {id: 'weekly', label: 'Weekly', icon: 'Calendar'},
  {id: 'monthly', label: 'Monthly', icon: 'Calendar'},
] as const;

export type FrequencyType = (typeof FREQUENCY_TYPES)[number]['id'];

// Evaluation type options
export const EVALUATION_TYPES = [
  {
    id: 'boolean',
    label: 'Yes/No',
    icon: 'CheckCircle2',
    description: 'Simple completion check',
  },
  {
    id: 'numeric',
    label: 'Numeric',
    icon: 'Hash',
    description: 'Track quantities (e.g., steps, glasses of water)',
  },
  {
    id: 'timer',
    label: 'Timer',
    icon: 'Timer',
    description: 'Track time spent (e.g., minutes reading)',
  },
  {
    id: 'checklist',
    label: 'Checklist',
    icon: 'ListChecks',
    description: 'Multiple tasks to complete',
  },
] as const;

export type EvaluationType = (typeof EVALUATION_TYPES)[number]['id'];

// Common units for numeric tracking
export const COMMON_UNITS = [
  {id: 'steps', label: 'Steps'},
  {id: 'glasses', label: 'Glasses'},
  {id: 'pages', label: 'Pages'},
  {id: 'calories', label: 'Calories'},
  {id: 'kilometers', label: 'Kilometers'},
  {id: 'miles', label: 'Miles'},
  {id: 'minutes', label: 'Minutes'},
  {id: 'times', label: 'Times'},
  {id: 'custom', label: 'Custom...'},
] as const;

export type CommonUnit = (typeof COMMON_UNITS)[number]['id'];

// Units for timer
export const TIME_UNITS = [
  {id: 'minutes', label: 'Minutes'},
  {id: 'hours', label: 'Hours'},
] as const;

export type TimeUnit = (typeof TIME_UNITS)[number]['id'];

// Time of day options
export const TIME_OF_DAY_OPTIONS = [
  {id: 'morning', label: 'Morning'},
  {id: 'afternoon', label: 'Afternoon'},
  {id: 'evening', label: 'Evening'},
  {id: 'night', label: 'Night'},
  {id: 'anytime', label: 'Anytime'},
] as const;

export type TimeOfDayOption = (typeof TIME_OF_DAY_OPTIONS)[number]['id'];

// Default values
export const DEFAULT_CATEGORY = HABIT_CATEGORIES[0].id; // 'mindfulness'
export const DEFAULT_COLOR = COLOR_PALETTE[0]; // '#1E40AF'
