// TodayScreen.js
import {
  Brain,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Coffee,
  Moon,
  Pause,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Sun,
  Timer,
  Trophy,
  Zap,
} from 'lucide-react-native';
import {useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ViewX} from '~components/common';

const {width} = Dimensions.get('window');

const TodayScreen = () => {
  const [expandedHabitId, setExpandedHabitId] = useState(null);
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: 'Morning Meditation',
      icon: Brain,
      time: '07:00',
      duration: 10,
      streak: 15,
      completed: false,
      color: '#8B5CF6',
      timer: {
        running: false,
        elapsed: 0,
        total: 600,
      },
      notes: [],
      todayMood: null,
      recentMoods: ['😊', '😌', '😊', '😔', '😊'],
    },
    {
      id: 2,
      name: 'Read Fiction',
      icon: Coffee,
      time: '21:00',
      duration: 30,
      streak: 7,
      completed: false,
      color: '#EC4899',
      progress: {
        current: 0,
        target: 20,
        unit: 'pages',
      },
      notes: ['Great chapter!', 'Plot thickens'],
      todayMood: null,
      recentMoods: ['🤓', '🤔', '🤓', '😀', '🤓'],
    },
  ]);

  const toggleExpand = habitId => {
    setExpandedHabitId(expandedHabitId === habitId ? null : habitId);
  };

  const toggleHabit = habitId => {
    setHabits(
      habits.map(habit =>
        habit.id === habitId ? {...habit, completed: !habit.completed} : habit,
      ),
    );
  };

  const insets = useSafeAreaInsets();

  return (
    <ViewX flex={1}>
      <ScrollView
        contentContainerStyle={{paddingVertical: insets.top}}
        showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Today</Text>
              <Text style={styles.date}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.trophyContainer}>
              <Trophy color="#F59E0B" size={20} style={styles.trophyIcon} />
              <Text style={styles.trophyText}>15 day streak</Text>
            </View>
          </View>

          {/* Stats Cards */}
          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsCardsContainer}>
            <View style={styles.statsCard}>
              <View style={styles.statsIconContainer}>
                <View
                  style={[
                    styles.iconBackground,
                    {backgroundColor: 'rgba(34, 197, 94, 0.1)'},
                  ]}>
                  <CheckCircle2 color="#22C55E" size={20} />
                </View>
                <Text style={styles.statsLabel}>Completion</Text>
              </View>
              <View style={styles.statsValueContainer}>
                <Text style={styles.statsValue}>87%</Text>
                <Text style={styles.statsTrend}>↑ 12%</Text>
              </View>
            </View>

            <View style={styles.statsCard}>
              <View style={styles.statsIconContainer}>
                <View
                  style={[
                    styles.iconBackground,
                    {backgroundColor: 'rgba(168, 85, 247, 0.1)'},
                  ]}>
                  <Zap color="#A855F7" size={20} />
                </View>
                <Text style={styles.statsLabel}>Current Streak</Text>
              </View>
              <View style={styles.statsValueContainer}>
                <Text style={styles.statsValue}>15</Text>
                <Text style={styles.statsUnit}>days</Text>
              </View>
            </View>

            <View style={styles.statsCard}>
              <View style={styles.statsIconContainer}>
                <View
                  style={[
                    styles.iconBackground,
                    {backgroundColor: 'rgba(59, 130, 246, 0.1)'},
                  ]}>
                  <Clock color="#3B82F6" size={20} />
                </View>
                <Text style={styles.statsLabel}>Today's Progress</Text>
              </View>
              <View style={styles.statsValueContainer}>
                <Text style={styles.statsValue}>4/6</Text>
                <Text style={styles.statsUnit}>habits</Text>
              </View>
            </View>
          </ScrollView> */}

          {/* Weekly Progress */}
          <View style={styles.weeklyProgress}>
            <View style={styles.weeklyHeader}>
              <Text style={styles.weeklyTitle}>Weekly Progress</Text>
              <Text style={styles.weeklySubtitle}>Last 7 days</Text>
            </View>
            <View style={styles.weeklyChart}>
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(
                (day, index) => {
                  const height = [70, 90, 85, 100, 75, 80, 60][index];
                  return (
                    <View key={day} style={styles.weeklyBar}>
                      <View
                        style={[styles.weeklyBarFill, {height: `${height}%`}]}
                      />
                      <Text style={styles.weeklyBarLabel}>{day}</Text>
                    </View>
                  );
                },
              )}
            </View>
          </View>
        </View>

        {/* Time Sections */}
        <View style={styles.timeSections}>
          {['Morning', 'Afternoon', 'Evening'].map((section, index) => (
            <TouchableOpacity
              key={section}
              style={[
                styles.timeSection,
                index === 0 && styles.timeSectionActive,
              ]}>
              {index === 0 && <Sun size={16} color="#FFF" />}
              {index === 1 && <Coffee size={16} color="#FFF" />}
              {index === 2 && <Moon size={16} color="#FFF" />}
              <Text style={styles.timeSectionText}>{section}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Habits List */}
        <View style={styles.habitsList}>
          {habits.map(habit => (
            <View
              key={habit.id}
              style={[
                styles.habitCard,
                expandedHabitId === habit.id && styles.habitCardExpanded,
              ]}>
              {/* Habit Header */}
              <TouchableOpacity
                style={styles.habitHeader}
                onPress={() => toggleExpand(habit.id)}>
                <TouchableOpacity
                  style={[
                    styles.checkButton,
                    habit.completed && styles.checkButtonCompleted,
                  ]}
                  onPress={() => toggleHabit(habit.id)}>
                  {habit.completed ? (
                    <CheckCircle2 size={24} color="#FFF" />
                  ) : (
                    <Circle size={24} color="#9CA3AF" />
                  )}
                </TouchableOpacity>

                <View style={styles.habitInfo}>
                  <View style={styles.habitNameRow}>
                    <habit.icon size={16} color={habit.color} />
                    <Text style={styles.habitName}>{habit.name}</Text>
                  </View>

                  <View style={styles.habitMetrics}>
                    <View style={styles.habitMetric}>
                      <Clock size={14} color="#9CA3AF" />
                      <Text style={styles.habitMetricText}>{habit.time}</Text>
                    </View>
                    <View style={styles.habitMetric}>
                      <Zap size={14} color="#9CA3AF" />
                      <Text style={styles.habitMetricText}>
                        {habit.streak} days
                      </Text>
                    </View>
                  </View>
                </View>

                <ChevronDown
                  size={20}
                  color="#9CA3AF"
                  style={[
                    styles.expandIcon,
                    expandedHabitId === habit.id && styles.expandIconRotated,
                  ]}
                />
              </TouchableOpacity>

              {/* Expanded Content */}
              {expandedHabitId === habit.id && (
                <View style={styles.expandedContent}>
                  {/* Timer or Progress */}
                  {habit.timer ? (
                    <View style={styles.timerContainer}>
                      <View style={styles.timerHeader}>
                        <Text style={styles.timerTitle}>Timer</Text>
                        <Text style={styles.timerValue}>
                          {Math.floor(habit.timer.elapsed / 60)}:
                          {String(habit.timer.elapsed % 60).padStart(2, '0')}
                        </Text>
                      </View>
                      <View style={styles.timerControls}>
                        <TouchableOpacity style={styles.timerButton}>
                          <RotateCcw size={20} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.timerButton,
                            styles.timerButtonPrimary,
                          ]}>
                          {habit.timer.running ? (
                            <Pause size={20} color="#FFF" />
                          ) : (
                            <Play size={20} color="#FFF" />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>Progress</Text>
                        <Text style={styles.progressValue}>
                          {habit.progress.current}/{habit.progress.target}{' '}
                          {habit.progress.unit}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Mood Tracking */}
                  <View style={styles.moodSection}>
                    <Text style={styles.moodTitle}>How did it feel?</Text>
                    <View style={styles.moodButtons}>
                      {['😊', '😌', '😐', '😔', '😤'].map(mood => (
                        <TouchableOpacity
                          key={mood}
                          style={[
                            styles.moodButton,
                            habit.todayMood === mood &&
                              styles.moodButtonSelected,
                          ]}>
                          <Text style={styles.moodEmoji}>{mood}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Recent Moods */}
                  <View style={styles.recentMoods}>
                    <Text style={styles.recentMoodsTitle}>Recent Moods</Text>
                    <View style={styles.recentMoodsGrid}>
                      {habit.recentMoods.map((mood, idx) => (
                        <View key={idx} style={styles.recentMoodItem}>
                          <Text style={styles.recentMoodEmoji}>{mood}</Text>
                          <Text style={styles.recentMoodDay}>
                            {idx === 0 ? 'Today' : `${idx}d ago`}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Quick Actions */}
                  <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.quickActionButton}>
                      <Timer size={16} color="#FFF" />
                      <Text style={styles.quickActionText}>Set Reminder</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionButton}>
                      <Pencil size={16} color="#FFF" />
                      <Text style={styles.quickActionText}>Add Note</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Habit FAB */}
      <TouchableOpacity style={styles.fabButton}>
        <Plus size={24} color="#FFF" />
      </TouchableOpacity>
    </ViewX>
  );
};

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },

  // Stats Section
  statsContainer: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  date: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  trophyContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  trophyIcon: {
    marginBottom: 4,
  },
  trophyText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },

  // Stats Cards
  statsCardsContainer: {
    paddingRight: 16,
    gap: 12,
  },
  statsCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: 12,
    padding: 16,
    width: width * 0.4,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)',
  },
  statsIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  iconBackground: {
    padding: 8,
    borderRadius: 8,
  },
  statsLabel: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  statsValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statsTrend: {
    color: '#22C55E',
    fontSize: 14,
  },
  statsUnit: {
    color: '#9CA3AF',
    fontSize: 14,
  },

  // Weekly Progress
  weeklyProgress: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)',
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  weeklyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },
  weeklySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 60,
  },
  weeklyBar: {
    flex: 1,
    alignItems: 'center',
  },
  weeklyBarFill: {
    width: 8,
    backgroundColor: '#6366F1',
    borderRadius: 4,
  },
  weeklyBarLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Time Sections
  timeSections: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  timeSection: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  timeSectionActive: {
    backgroundColor: '#6366F1',
  },
  timeSectionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },

  // Habits List
  habitsList: {
    padding: 16,
    gap: 16,
  },
  habitCard: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
  },
  habitCardExpanded: {
    borderColor: '#6366F1',
    borderWidth: 2,
  },
  habitHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  checkButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#374151',
  },
  checkButtonCompleted: {
    backgroundColor: '#22C55E',
  },
  habitInfo: {
    flex: 1,
  },
  habitNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  habitMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  habitMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  habitMetricText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  expandIcon: {
    transform: [{rotate: '0deg'}],
  },
  expandIconRotated: {
    transform: [{rotate: '180deg'}],
  },

  // Expanded Content
  expandedContent: {
    padding: 16,
    gap: 16,
  },
  timerContainer: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 8,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timerTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFF',
  },
  timerValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  timerButton: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: '#4B5563',
  },
  timerButtonPrimary: {
    backgroundColor: '#6366F1',
  },

  // Mood Section
  moodSection: {
    gap: 8,
  },
  moodTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  moodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  moodButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  moodButtonSelected: {
    backgroundColor: '#6366F1',
  },
  moodEmoji: {
    fontSize: 20,
  },

  // Recent Moods
  recentMoods: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
  },
  recentMoodsTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
    fontWeight: '500',
  },
  recentMoodsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recentMoodItem: {
    alignItems: 'center',
  },
  recentMoodEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  recentMoodDay: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionText: {
    color: '#FFF',
    fontSize: 14,
  },

  // FAB
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default TodayScreen;
