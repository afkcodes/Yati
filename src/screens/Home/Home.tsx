/* eslint-disable react-native/no-inline-styles */
// // TodayScreen.js
// import {
//   Brain,
//   CheckCircle2,
//   Circle,
//   Clock,
//   Coffee,
//   Moon,
//   Plus,
//   Sun,
//   Trophy,
//   Zap,
// } from 'lucide-react-native';
// import {NavigationContext} from 'navigation-react';
// import {useContext, useState} from 'react';
// import {
//   Dimensions,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {TouchableX, ViewX} from '~components/common';
// import {CalendarStrip} from '~components/common/CalenderStrip';
// import {styleUtils, themes} from '~styles/theme';
// import {h, w} from '~utils/screenUtil';

// const {width} = Dimensions.get('window');

// const TodayScreen = () => {
//   const [expandedHabitId, setExpandedHabitId] = useState(null);
//   const [habits, setHabits] = useState([
//     {
//       id: 1,
//       name: 'Morning Meditation',
//       icon: Brain,
//       time: '07:00',
//       duration: 10,
//       streak: 15,
//       completed: false,
//       color: '#8B5CF6',
//       timer: {
//         running: false,
//         elapsed: 0,
//         total: 600,
//       },
//       notes: [],
//       todayMood: null,
//       recentMoods: ['😊', '😌', '😊', '😔', '😊'],
//     },
//     {
//       id: 2,
//       name: 'Read Fiction',
//       icon: Coffee,
//       time: '21:00',
//       duration: 30,
//       streak: 7,
//       completed: false,
//       color: '#EC4899',
//       progress: {
//         current: 0,
//         target: 20,
//         unit: 'pages',
//       },
//       notes: ['Great chapter!', 'Plot thickens'],
//       todayMood: null,
//       recentMoods: ['🤓', '🤔', '🤓', '😀', '🤓'],
//     },
//   ]);

//   const toggleExpand = habitId => {
//     setExpandedHabitId(expandedHabitId === habitId ? null : habitId);
//   };

//   const toggleHabit = habitId => {
//     setHabits(
//       habits.map(habit =>
//         habit.id === habitId ? {...habit, completed: !habit.completed} : habit,
//       ),
//     );
//   };

//   const insets = useSafeAreaInsets();

//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const startDate = new Date(2025, 0, 1); // Jan 1, 2024
//   const endDate = new Date(2025, 0, 31); // Dec 31, 2024

//   return (
//     <ViewX flex={1} variant="primary">
//       <ScrollView
//         contentContainerStyle={{paddingVertical: insets.top}}
//         showsVerticalScrollIndicator={false}>
//         {/* Stats Overview */}
//         <View style={styles.statsContainer}>
//           {/* Header */}
//           <View style={styles.header}>
//             <View>
//               <Text style={styles.title}>Today</Text>
//               <Text style={styles.date}>
//                 {new Date().toLocaleDateString('en-US', {
//                   weekday: 'long',
//                   month: 'long',
//                   day: 'numeric',
//                 })}
//               </Text>
//             </View>

//             <View style={styles.trophyContainer}>
//               <Trophy color="#F59E0B" size={20} style={styles.trophyIcon} />
//               <Text style={styles.trophyText}>15 day streak</Text>
//             </View>
//           </View>

//           {/* Weekly Progress */}
//           <ViewX padding={16}>
//             <View style={styles.weeklyProgress}>
//               <View style={styles.weeklyHeader}>
//                 <Text style={styles.weeklyTitle}>Weekly Progress</Text>
//                 <Text style={styles.weeklySubtitle}>Last 7 days</Text>
//               </View>
//               <View style={styles.weeklyChart}>
//                 {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(
//                   (day, index) => {
//                     const height = [70, 90, 85, 100, 75, 80, 60][index];
//                     return (
//                       <View key={day} style={styles.weeklyBar}>
//                         <View
//                           style={[styles.weeklyBarFill, {height: `${height}%`}]}
//                         />
//                         <Text style={styles.weeklyBarLabel}>{day}</Text>
//                       </View>
//                     );
//                   },
//                 )}
//               </View>
//             </View>
//           </ViewX>
//         </View>

//         {/* Time Sections */}
//         <View style={styles.timeSections}>
//           {['Morning', 'Afternoon', 'Evening'].map((section, index) => (
//             <TouchableOpacity
//               key={section}
//               style={[
//                 styles.timeSection,
//                 index === 0 && styles.timeSectionActive,
//               ]}>
//               {index === 0 && <Sun size={16} color="#FFF" />}
//               {index === 1 && <Coffee size={16} color="#FFF" />}
//               {index === 2 && <Moon size={16} color="#FFF" />}
//               <Text style={styles.timeSectionText}>{section}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <View style={styles.habitsList}>
//           {habits.map(habit => (
//             <ViewX
//               flexDirection="row"
//               gap={8}
//               paddingVertical={12}
//               key={habit.id}>
//               <TouchableX
//                 style={[
//                   styles.checkButton,
//                   habit.completed && styles.checkButtonCompleted,
//                 ]}
//                 onPress={() => toggleHabit(habit.id)}>
//                 {habit.completed ? (
//                   <CheckCircle2 size={24} color="#FFF" />
//                 ) : (
//                   <Circle size={24} color="#9CA3AF" />
//                 )}
//               </TouchableX>

//               <View style={styles.habitInfo}>
//                 <View style={styles.habitNameRow}>
//                   <habit.icon size={16} color={habit.color} />
//                   <Text style={styles.habitName}>{habit.name}</Text>
//                 </View>

//                 <View style={styles.habitMetrics}>
//                   <View style={styles.habitMetric}>
//                     <Clock size={14} color="#9CA3AF" />
//                     <Text style={styles.habitMetricText}>{habit.time}</Text>
//                   </View>
//                   <View style={styles.habitMetric}>
//                     <Zap size={14} color="#9CA3AF" />
//                     <Text style={styles.habitMetricText}>
//                       {habit.streak} days
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             </ViewX>
//           ))}
//         </View>
//       </ScrollView>

//       {/* Add Habit FAB */}
//       <ViewX variant="secondary" width={w(100)}>
//         <ViewX
//           flexDirection="row"
//           justifyContent="space-between"
//           alignItems="center"
//           paddingVertical={4}
//           width={w(100)}>
//           <ViewX
//             overflow="hidden"
//             justifyContent="center"
//             alignItems="flex-start">
//             <CalendarStrip
//               selectedDate={selectedDate}
//               onDateSelect={setSelectedDate}
//               startDate={startDate}
//               endDate={endDate}
//             />
//           </ViewX>
//         </ViewX>
//       </ViewX>
//     </ViewX>
//   );
// };

// const styles = StyleSheet.create({
//   // Main Container
//   container: {
//     flex: 1,
//     backgroundColor: '#111827',
//   },

//   // Stats Section
//   statsContainer: {
//     // padding: 16,
//     backgroundColor: 'transparent',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24,
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FFF',
//   },
//   date: {
//     color: '#9CA3AF',
//     fontSize: 14,
//   },
//   trophyContainer: {
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   trophyIcon: {
//     marginBottom: 4,
//   },
//   trophyText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: '500',
//   },

//   // Stats Cards
//   statsCardsContainer: {
//     paddingRight: 16,
//     gap: 12,
//   },
//   statsCard: {
//     backgroundColor: 'rgba(31, 41, 55, 0.5)',
//     borderRadius: 12,
//     padding: 16,
//     width: width * 0.4,
//     borderWidth: 1,
//     borderColor: 'rgba(75, 85, 99, 0.5)',
//   },
//   statsIconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 12,
//   },
//   iconBackground: {
//     padding: 8,
//     borderRadius: 8,
//   },
//   statsLabel: {
//     color: '#9CA3AF',
//     fontSize: 14,
//   },
//   statsValueContainer: {
//     flexDirection: 'row',
//     alignItems: 'baseline',
//     gap: 4,
//   },
//   statsValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FFF',
//   },
//   statsTrend: {
//     color: '#22C55E',
//     fontSize: 14,
//   },
//   statsUnit: {
//     color: '#9CA3AF',
//     fontSize: 14,
//   },

//   // Weekly Progress
//   weeklyProgress: {
//     backgroundColor: 'rgba(31, 41, 55, 0.5)',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(75, 85, 99, 0.5)',
//   },
//   weeklyHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   weeklyTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#FFF',
//   },
//   weeklySubtitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//   },
//   weeklyChart: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end',
//     height: 60,
//   },
//   weeklyBar: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   weeklyBarFill: {
//     width: 8,
//     backgroundColor: '#6366F1',
//     borderRadius: 4,
//   },
//   weeklyBarLabel: {
//     marginTop: 8,
//     fontSize: 12,
//     color: '#9CA3AF',
//   },

//   // Time Sections
//   timeSections: {
//     flexDirection: 'row',
//     padding: 16,
//     gap: 8,
//   },
//   timeSection: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: '#374151',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   timeSectionActive: {
//     backgroundColor: '#6366F1',
//   },
//   timeSectionText: {
//     color: '#FFF',
//     fontSize: 14,
//     fontWeight: '500',
//   },

//   // Habits List
//   habitsList: {
//     padding: 16,
//     gap: 16,
//   },
//   habitCard: {
//     backgroundColor: 'transparent',
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   habitCardExpanded: {
//     borderColor: '#6366F1',
//     borderWidth: 2,
//   },
//   habitHeader: {
//     flexDirection: 'row',
//     padding: 16,
//     alignItems: 'center',
//     gap: 12,
//   },
//   checkButton: {
//     padding: 8,
//     borderRadius: 50,
//     backgroundColor: '#374151',
//     height: 40,
//     width: 40,
//   },
//   checkButtonCompleted: {
//     backgroundColor: '#22C55E',
//   },
//   habitInfo: {
//     flex: 1,
//   },
//   habitNameRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 4,
//   },
//   habitName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#FFF',
//   },
//   habitMetrics: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   habitMetric: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   habitMetricText: {
//     fontSize: 14,
//     color: '#9CA3AF',
//   },
//   expandIcon: {
//     transform: [{rotate: '0deg'}],
//   },
//   expandIconRotated: {
//     transform: [{rotate: '180deg'}],
//   },

//   // Expanded Content
//   expandedContent: {
//     padding: 16,
//     gap: 16,
//   },
//   timerContainer: {
//     backgroundColor: '#374151',
//     padding: 16,
//     borderRadius: 8,
//   },
//   timerHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   timerTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#FFF',
//   },
//   timerValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFF',
//   },
//   timerControls: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 16,
//   },
//   timerButton: {
//     padding: 12,
//     borderRadius: 24,
//     backgroundColor: '#4B5563',
//   },
//   timerButtonPrimary: {
//     backgroundColor: '#6366F1',
//   },

//   // Mood Section
//   moodSection: {
//     gap: 8,
//   },
//   moodTitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     fontWeight: '500',
//   },
//   moodButtons: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   moodButton: {
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: '#374151',
//   },
//   moodButtonSelected: {
//     backgroundColor: '#6366F1',
//   },
//   moodEmoji: {
//     fontSize: 20,
//   },

//   // Recent Moods
//   recentMoods: {
//     backgroundColor: '#374151',
//     padding: 12,
//     borderRadius: 8,
//   },
//   recentMoodsTitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginBottom: 8,
//     fontWeight: '500',
//   },
//   recentMoodsGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   recentMoodItem: {
//     alignItems: 'center',
//   },
//   recentMoodEmoji: {
//     fontSize: 20,
//     marginBottom: 4,
//   },
//   recentMoodDay: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },

//   // Quick Actions
//   quickActions: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   quickActionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: '#374151',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   quickActionText: {
//     color: '#FFF',
//     fontSize: 14,
//   },

//   // FAB
//   fabButton: {
//     // position: 'absolute',
//     // bottom: 24,
//     // right: 24,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#6366F1',
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
// });

// const Home = () => {
//   const {stateNavigator} = useContext(NavigationContext);

//   return (
//     <ViewX variant="primary" flex={1} position="relative">
//       <TodayScreen />
//       <TouchableX
//         position="absolute"
//         justifyContent="center"
//         alignItems="center"
//         bottom={h(10)}
//         right={w(2)}
//         onPress={() => {
//           stateNavigator.navigate('create');
//         }}
//         height={56}
//         width={56}
//         backgroundColor={themes.dark.background.accent}
//         borderRadius={styleUtils.borderRadius.lg}>
//         <Plus size={24} color="#FFF" />
//       </TouchableX>
//     </ViewX>
//   );
// };

// export default Home;

import {Plus} from 'lucide-react-native';
import {NavigationContext} from 'navigation-react';
import {useContext, useState} from 'react';
import {ScrollView} from 'react-native';
import {TouchableX, ViewX} from '~components/common';
import {CalendarStrip} from '~components/common/CalenderStrip';
import GreetingHeader from '~components/specific/home/Greeting';
import HabitCard from '~components/specific/home/Habit';
import TimeFilter from '~components/specific/home/TimFilter';
import {habitData} from '~data/habits';

import {styleUtils, themes} from '~styles/theme';
import {h, w} from '~utils/screenUtil';

const historyData = [
  {date: '2024-01-30', completed: true},
  {date: '2024-01-29', completed: true},
  {date: '2024-01-28', completed: false},
  {date: '2024-01-27', completed: true},
  {date: '2024-01-26', completed: true},
];

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const startDate = new Date(2025, 0, 1); // Jan 1, 2024
  const endDate = new Date(2025, 1, 8); // Dec 31, 2024
  const {stateNavigator} = useContext(NavigationContext);

  const [selectedTime, setSelectedTime] = useState<any>('all');
  const [habits, setHabits] = useState(habitData);

  const filteredHabits = habits.filter(
    habit => selectedTime === 'all' || habit.timePeriod === selectedTime,
  );

  return (
    <ViewX variant="primary" flex={1}>
      <GreetingHeader
        username="Ashish"
        avatar="https://scontent.fblr20-3.fna.fbcdn.net/v/t39.30808-6/465060097_27423369417308920_7431623941390111522_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4Eg-13Pt4rIQ7kNvgFXRQe6&_nc_zt=23&_nc_ht=scontent.fblr20-3.fna&_nc_gid=AHN09A_YGpMOyzUiUEtmbUZ&oh=00_AYApkwAunJronsyYoln5bKE1Hvc-pG33DlD3nUAq4JF61A&oe=67A28901"
        streakCount={5}
        hasUnreadNotifications={true}
        onPressNotification={() => {
          // Show notifications screen/modal
        }}
        onPressStreak={() => {
          // Show streak details/achievements
        }}
      />
      <ViewX
        variant="nav"
        width={w(100)}
        position="absolute"
        bottom={0}
        zIndex={100}
        paddingVertical={styleUtils.spacing['2xs']}>
        <ViewX
          overflow="hidden"
          justifyContent="center"
          alignItems="flex-start">
          <CalendarStrip
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            startDate={startDate}
            endDate={endDate}
          />
        </ViewX>
      </ViewX>
      <TouchableX
        position="absolute"
        justifyContent="center"
        alignItems="center"
        bottom={h(10)}
        right={w(2)}
        zIndex={100}
        onPress={() => {
          stateNavigator.navigate('create');
        }}
        height={56}
        width={56}
        backgroundColor={themes.dark.background.accent}
        borderRadius={styleUtils.borderRadius.lg}>
        <Plus size={24} color="#FFF" />
      </TouchableX>

      <ViewX flex={1} paddingTop={12}>
        <ViewX paddingTop={12}>
          <TimeFilter
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
          />
        </ViewX>
        <ScrollView
          style={{flex: 1, paddingTop: 12}}
          contentContainerStyle={{paddingBottom: 72, paddingTop: 16}}>
          {filteredHabits.map(habit => (
            <HabitCard
              period={habit.timePeriod}
              isCompleted={false}
              key={habit.id}
              {...habit}
              // onToggleComplete={date => handleToggleComplete(habit.title, date)}
              onToggleComplete={() => {}}
            />
          ))}
        </ScrollView>
      </ViewX>
    </ViewX>
  );
};

export default Home;
