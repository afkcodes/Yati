import {HabitCategory} from '~/types/habit.types';

// Category definitions with icons, colors, and descriptions
export const HABIT_CATEGORIES = [
  {
    id: 'mindfulness' as HabitCategory,
    name: 'Mindfulness',
    icon: 'Brain',
    color: '#8B5CF6',
    description: 'Meditation, awareness, calm',
  },
  {
    id: 'learning' as HabitCategory,
    name: 'Learning',
    icon: 'Book',
    color: '#3B82F6',
    description: 'Education, skills, knowledge',
  },
  {
    id: 'fitness' as HabitCategory,
    name: 'Fitness',
    icon: 'Dumbbell',
    color: '#10B981',
    description: 'Exercise, strength, movement',
  },
  {
    id: 'health' as HabitCategory,
    name: 'Health',
    icon: 'Heart',
    color: '#EF4444',
    description: 'Wellness, nutrition, self-care',
  },
  {
    id: 'sleep' as HabitCategory,
    name: 'Sleep',
    icon: 'Moon',
    color: '#6366F1',
    description: 'Rest, recovery, schedule',
  },
  {
    id: 'productivity' as HabitCategory,
    name: 'Productivity',
    icon: 'Coffee',
    color: '#F59E0B',
    description: 'Focus, efficiency, organization',
  },
  {
    id: 'goals' as HabitCategory,
    name: 'Goals',
    icon: 'Target',
    color: '#EC4899',
    description: 'Achievements, targets, progress',
  },
  {
    id: 'career' as HabitCategory,
    name: 'Career',
    icon: 'Briefcase',
    color: '#14B8A6',
    description: 'Work, professional growth',
  },
];

export const COLOR_PALETTE = [
  '#1E40AF', // Vivid Royal Blue (Productivity) - Sharp, electric, and focused
  '#2ECC71', // Bright Emerald Green (Health) - Lively and invigorating
  '#9B59B6', // Radiant Amethyst (Mindfulness) - Bold yet calming
  '#F1C40F', // Electric Gold (Fitness) - High-energy and striking
  '#FF6B6B', // Vivid Coral (Self-care) - Warm, punchy, and welcoming
  '#FFB107', // Bright Amber (Morning) - Bold and wake-up worthy
  '#6B7280', // Slate Gray (Neutral) - Strong but understated
  '#E91E63', // Hot Pink (Urgent tasks) - Eye-catching and intense
  '#00CED1', // Turquoise Blast (Hydration) - Cool, crisp, and refreshing
  '#D4A017', // Golden Sand (Routines) - Warm, grounded pop
  '#7D3C98', // Deep Violet (Learning) - Rich and inspiring
  '#27AE60', // Lime Forest (Nature) - Zesty and earthy
  '#E67E22', // Fiery Orange (Nutrition) - Bold and appetizing
  '#8E44AD', // Vibrant Plum (Evening) - Deep, cozy, and captivating
  '#FF5733', // Tangerine Glow (Social) - Fun and outgoing
  '#16A085', // Teal Surge (Long-term goals) - Steady, powerful, and unique
];

// Days of the week for frequency selection
export const WEEKDAYS = [
  {id: 'mon', label: 'Mon'},
  {id: 'tue', label: 'Tue'},
  {id: 'wed', label: 'Wed'},
  {id: 'thu', label: 'Thu'},
  {id: 'fri', label: 'Fri'},
  {id: 'sat', label: 'Sat'},
  {id: 'sun', label: 'Sun'},
];

// Frequency type options
export const FREQUENCY_TYPES = [
  {id: 'hourly', label: 'Hourly', icon: 'Clock'},
  {id: 'daily', label: 'Daily', icon: 'Calendar'},
  {id: 'weekly', label: 'Weekly', icon: 'Calendar'},
  {id: 'monthly', label: 'Monthly', icon: 'Calendar'},
];

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
];

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
];

// Units for timer
export const TIME_UNITS = [
  {id: 'minutes', label: 'Minutes'},
  {id: 'hours', label: 'Hours'},
];
