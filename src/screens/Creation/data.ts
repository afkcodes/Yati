import {
  Brain,
  Calendar,
  CalendarCheck,
  Clock,
  Dumbbell,
  GraduationCap,
  Heart,
  Sun,
  Target,
} from 'lucide-react-native';

export type Frequency = 'hourly' | 'daily' | 'weekly' | 'monthly';
export type EvaluationType = 'boolean' | 'numeric' | 'timer' | 'checklist';

export interface HabitData {
  name: string;
  description: string;
  category: Category | null;
  frequency: Frequency;
  frequencyDetails: {
    hourly: {interval: number};
    daily: {timeOfDay: Date};
    weekly: {days: string[]};
    monthly: {dates: number[]};
  };
  evaluationType: EvaluationType;
  evaluationDetails: {
    numeric: {goal: string; unit: string};
    timer: {goal: number; unit: 'minutes' | 'hours'};
    checklist: {items: string[]};
  };
  reminders: Date[];
  startDate: Date;
  endDate: Date | null;
  color: string;
  selectedIcon: any; // IconType from lucide-react-native
  goal: {
    enabled: boolean;
    target: string;
    deadline: Date | null;
  };
}

export interface Category {
  id: number;
  name: string;
  icon: any; // IconType from lucide-react-native
}

export const CATEGORIES: Category[] = [
  {id: 1, name: 'Health', icon: Heart},
  {id: 2, name: 'Fitness', icon: Dumbbell},
  {id: 3, name: 'Learning', icon: GraduationCap},
  {id: 4, name: 'Focus', icon: Brain},
  {id: 5, name: 'Mindfulness', icon: Sun},
];

export const ALL_ICONS = [
  Heart,
  Dumbbell,
  GraduationCap,
  Brain,
  Sun,
  Clock,
  Calendar,
  Target,
];

export const FREQUENCIES = [
  {id: 'hourly' as Frequency, label: 'Hourly', icon: Clock},
  {id: 'daily' as Frequency, label: 'Daily', icon: Calendar},
  {id: 'weekly' as Frequency, label: 'Weekly', icon: CalendarCheck},
  {id: 'monthly' as Frequency, label: 'Monthly', icon: Calendar},
];

export const EVALUATION_TYPES = [
  {
    id: 'boolean' as EvaluationType,
    label: 'Yes/No',
    description: 'Simple completion check',
  },
  {
    id: 'numeric' as EvaluationType,
    label: 'Numeric',
    description: 'Track quantities (e.g., steps, pages)',
    hasGoal: true,
  },
  {
    id: 'timer' as EvaluationType,
    label: 'Timer',
    description: 'Track duration',
    hasGoal: true,
  },
  {
    id: 'checklist' as EvaluationType,
    label: 'Checklist',
    description: 'Multiple sub-tasks',
    hasSubtasks: true,
  },
];

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const DEFAULT_HABIT_DATA: HabitData = {
  name: '',
  description: '',
  category: null,
  frequency: 'daily',
  frequencyDetails: {
    hourly: {interval: 1},
    daily: {timeOfDay: new Date()},
    weekly: {days: []},
    monthly: {dates: []},
  },
  evaluationType: 'boolean',
  evaluationDetails: {
    numeric: {goal: '', unit: ''},
    timer: {goal: 0, unit: 'minutes'},
    checklist: {items: []},
  },
  reminders: [],
  startDate: new Date(),
  endDate: null,
  color: '#34C759',
  selectedIcon: Heart,
  goal: {
    enabled: false,
    target: '',
    deadline: null,
  },
};
