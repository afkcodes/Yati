import {DateTime} from 'luxon';
import {Habit, HabitFormData, HabitFormErrors} from '~types/habit.types';
import {DEFAULT_CATEGORY, DEFAULT_COLOR} from '~utils/constants/habitConstants';
import {getLocalToday} from '~utils/date/dateUtils';
import {loadHabits} from '~utils/storage/storageUtils';
import {create} from '~utils/store/createStore';

// Define the store's state interface
export interface HabitStoreState {
  habits: Habit[];
  formData: HabitFormData;
  formErrors: HabitFormErrors;
  selectedDate: DateTime;
  timeFilter: 'morning' | 'evening' | 'night' | 'all';
}

// Initial form data
export const initialFormData: HabitFormData = {
  title: '',
  description: '',
  category: DEFAULT_CATEGORY,
  color: DEFAULT_COLOR,
  frequency: {type: 'daily', value: [], timeOfDay: null},
  evaluation: {type: 'boolean', target: 1, unit: ''},
  goal: {
    enabled: false,
    timeframe: 'weekly',
    target: 7,
    deadline: null,
    progress: 0,
  },
  reminders: [], // Already string[]
  timePeriod: 'morning', // Default to 'morning'
};

// Load habits from MMKV on initialization
export const persistedHabits = loadHabits();

// Initial state with persisted habits
export const initialState: HabitStoreState = {
  habits: persistedHabits,
  formData: initialFormData,
  formErrors: {},
  selectedDate: getLocalToday(),
  timeFilter: 'all',
};
/**
 * Habit store using the custom create function
 */
const {
  getStoreSnapshot: getHabitStoreSnapshot,
  set: setHabitStore,
  subscribe: subscribeToHabitStore,
  useStore: useHabitStore,
} = create('habit', initialState);

export {
  getHabitStoreSnapshot,
  setHabitStore,
  subscribeToHabitStore,
  useHabitStore,
};
