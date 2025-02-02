// //@ts-nocheck
// import {
//   Book,
//   BookOpen,
//   Brain,
//   Code,
//   Coffee,
//   Dumbbell,
//   Heart,
//   Moon,
//   Music,
//   Palette,
//   Pencil,
//   Plus,
//   Smartphone,
//   Star,
//   Sun,
//   Target,
// } from 'lucide-react-native';
// import {useState} from 'react';
// import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {TextX, TouchableX, ViewX} from '~components/common';
// import Input from '~components/common/Input';
// import CardContainer from '~containers/SquircleViewContainer';
// import {styleUtils, themes} from '~styles/theme';
// import {s, vs} from '~utils/screenUtil';

// const HabitCreationScreen = () => {
//   const [habitData, setHabitData] = useState({
//     name: '',
//     description: '',
//     category: '',
//     schedule: {
//       type: 'daily',
//       time: '',
//       repeat: 1,
//       selectedDays: [],
//       selectedDates: [],
//       interval: 1,
//     },
//     color: '#6366F1',
//     icon: 'target',
//     difficulty: 'medium',
//     priority: 'medium',
//     trackingMethod: 'binary',
//     motivationalQuote: '',
//   });

//   const icons = [
//     {name: 'target', component: Target},
//     {name: 'book', component: Book},
//     {name: 'brain', component: Brain},
//     {name: 'heart', component: Heart},
//     {name: 'dumbbell', component: Dumbbell},
//     {name: 'coffee', component: Coffee},
//     {name: 'sun', component: Sun},
//     {name: 'moon', component: Moon},
//     {name: 'music', component: Music},
//     {name: 'code', component: Code},
//     {name: 'pencil', component: Pencil},
//     {name: 'palette', component: Palette},
//     {name: 'star', component: Star},
//     {name: 'smartphone', component: Smartphone},
//     {name: 'book-open', component: BookOpen},
//   ];

//   const colors = [
//     '#6366F1', // Indigo
//     '#EF4444', // Red
//     '#10B981', // Green
//     '#F59E0B', // Yellow
//     '#EC4899', // Pink
//     '#8B5CF6', // Purple
//     '#06B6D4', // Cyan
//     '#F97316', // Orange
//   ];

//   const categories = [
//     'Fitness',
//     'Learning',
//     'Mindfulness',
//     'Career',
//     'Health',
//     'Social',
//     'Creativity',
//     'Productivity',
//   ];

//   const renderScheduleOptions = () => {
//     switch (habitData.schedule.type) {
//       case 'hourly':
//         return (
//           <ViewX style={styles.scheduleContainer}>
//             <View style={styles.inputRow}>
//               <TextInput
//                 style={[styles.input, {flex: 1}]}
//                 keyboardType="number-pad"
//                 placeholder="Every X hours"
//                 placeholderTextColor="#9CA3AF"
//                 value={habitData.schedule.interval.toString()}
//                 onChangeText={value =>
//                   setHabitData({
//                     ...habitData,
//                     schedule: {
//                       ...habitData.schedule,
//                       interval: parseInt(value) || 1,
//                     },
//                   })
//                 }
//               />
//               <Text style={styles.inputLabel}>hours</Text>
//             </View>
//           </ViewX>
//         );

//       case 'daily':
//         return (
//           <View style={styles.scheduleContainer}>
//             <TouchableX
//               style={styles.timePickerButton}
//               onPress={async () => {}}>
//               <Text style={styles.timePickerText}>
//                 {habitData.schedule.time || 'Select Time'}
//               </Text>
//             </TouchableX>

//             <View style={styles.inputRow}>
//               <TextInput
//                 style={[styles.input, {flex: 1}]}
//                 keyboardType="number-pad"
//                 placeholder="Repeat times per day"
//                 placeholderTextColor="#9CA3AF"
//                 value={habitData.schedule.repeat.toString()}
//                 onChangeText={value =>
//                   setHabitData({
//                     ...habitData,
//                     schedule: {
//                       ...habitData.schedule,
//                       repeat: parseInt(value) || 1,
//                     },
//                   })
//                 }
//               />
//               <Text style={styles.inputLabel}>times</Text>
//             </View>
//           </View>
//         );

//       case 'weekly':
//         const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
//         return (
//           <View style={styles.scheduleContainer}>
//             <View style={styles.daysContainer}>
//               {days.map(day => (
//                 <TouchableX
//                   key={day}
//                   style={[
//                     styles.dayButton,
//                     habitData.schedule.selectedDays.includes(day) &&
//                       styles.dayButtonSelected,
//                   ]}
//                   onPress={() => {
//                     const newDays = habitData.schedule.selectedDays.includes(
//                       day,
//                     )
//                       ? habitData.schedule.selectedDays.filter(d => d !== day)
//                       : [...habitData.schedule.selectedDays, day];
//                     setHabitData({
//                       ...habitData,
//                       schedule: {
//                         ...habitData.schedule,
//                         selectedDays: newDays,
//                       },
//                     });
//                   }}>
//                   <TextX
//                     style={[
//                       styles.dayButtonText,
//                       habitData.schedule.selectedDays.includes(day) &&
//                         styles.dayButtonTextSelected,
//                     ]}>
//                     {day}
//                   </TextX>
//                 </TouchableX>
//               ))}
//             </View>

//             <TouchableX
//               style={styles.timePickerButton}
//               onPress={async () => {
//                 // Handle time picker
//               }}>
//               <Text style={styles.timePickerText}>
//                 {habitData.schedule.time || 'Select Time'}
//               </Text>
//             </TouchableX>
//           </View>
//         );

//       case 'monthly':
//         return (
//           <View style={styles.scheduleContainer}>
//             <TextInput
//               style={styles.input}
//               keyboardType="number-pad"
//               placeholder="Day of month (1-31)"
//               placeholderTextColor="#9CA3AF"
//               value={habitData.schedule.selectedDates[0]?.toString() || ''}
//               onChangeText={value => {
//                 const day = parseInt(value);
//                 if (!isNaN(day) && day >= 1 && day <= 31) {
//                   setHabitData({
//                     ...habitData,
//                     schedule: {
//                       ...habitData.schedule,
//                       selectedDates: [day],
//                     },
//                   });
//                 }
//               }}
//             />

//             <TouchableX
//               style={styles.timePickerButton}
//               onPress={async () => {
//                 // Handle time picker
//               }}>
//               <Text style={styles.timePickerText}>
//                 {habitData.schedule.time || 'Select Time'}
//               </Text>
//             </TouchableX>
//           </View>
//         );
//     }
//   };

//   const insets = useSafeAreaInsets();

//   return (
//     <ViewX flex={1} variant="primary">
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={{paddingVertical: insets.top}}
//         showsVerticalScrollIndicator={false}>
//         {/* Header */}

//         <ViewX gap={styleUtils.spacing.sm}>
//           {/* <ViewX style={styles.header}>
//             <Text style={styles.title}>Create New Habit</Text>
//             <Text style={styles.subtitle}>Design your path to success</Text>
//           </ViewX> */}

//           {/* Basic Info Section */}
//           <CardContainer borderRadius="lg" padding="md">
//             <TextX
//               marginBottom={styleUtils.spacing.sm}
//               fontWeight="semibold"
//               fontSize="xl">
//               Basic Information
//             </TextX>
//             <Input
//               placeholder="Habit Name"
//               placeholderTextColor="#9CA3AF"
//               validate={text => {
//                 if (!text.includes('@')) {
//                   return 'Invalid email address';
//                 }
//                 return null;
//               }}
//               value={habitData.name}
//               bgColor="#3E3F43"
//               onChangeText={text => setHabitData({...habitData, name: text})}
//             />

//             <Input
//               placeholder="Description (Optional)"
//               placeholderTextColor="#9CA3AF"
//               validate={text => {
//                 if (!text.includes('@')) {
//                   return 'Invalid email address';
//                 }
//                 return null;
//               }}
//               multiline
//               numberOfLines={3}
//               value={habitData.description}
//               onChangeText={text =>
//                 setHabitData({...habitData, description: text})
//               }
//               bgColor="#3E3F43"
//               inputStyle={styles.textArea}
//             />
//           </CardContainer>

//           <CardContainer borderRadius="lg" padding="md">
//             <TextX
//               marginBottom={styleUtils.spacing.sm}
//               fontWeight="semibold"
//               fontSize="xl">
//               Category
//             </TextX>
//             <ViewX
//               flexDirection="row"
//               flexWrap="wrap"
//               gap={styleUtils.spacing.xs}>
//               {categories.map(category => (
//                 <TouchableX
//                   key={category}
//                   paddingHorizontal={styleUtils.spacing.sm}
//                   paddingVertical={styleUtils.spacing.xs}
//                   backgroundColor={
//                     habitData.category === category
//                       ? themes.dark.background.accent
//                       : '#3E3F43'
//                   }
//                   borderRadius={styleUtils.borderRadius.sm}
//                   onPress={() => setHabitData({...habitData, category})}>
//                   <TextX fontSize="sm" fontWeight="medium">
//                     {category}
//                   </TextX>
//                 </TouchableX>
//               ))}
//             </ViewX>
//           </CardContainer>

//           {/* Icon and Color Selection */}
//           <CardContainer borderRadius="lg" padding="md">
//             <TextX
//               marginBottom={styleUtils.spacing.sm}
//               fontWeight="semibold"
//               fontSize="xl">
//               Personalization
//             </TextX>

//             <ViewX
//               flexDirection="row"
//               flexWrap="wrap"
//               gap={styleUtils.spacing.xs}
//               marginBottom={styleUtils.spacing.md}>
//               <TextX fontWeight="medium" fontSize="sm" color="secondary">
//                 Choose an Icon
//               </TextX>
//               <ViewX
//                 flexDirection="row"
//                 flexWrap="wrap"
//                 gap={styleUtils.spacing.xs}>
//                 {icons.map(({name, component: IconComponent}) => (
//                   <TouchableX
//                     key={name}
//                     borderRadius={styleUtils.borderRadius.sm}
//                     justifyContent="center"
//                     alignItems="center"
//                     height={vs(50)}
//                     width={vs(50)}
//                     backgroundColor={
//                       habitData.icon === name
//                         ? themes.dark.background.accent
//                         : '#3E3F43'
//                     }
//                     onPress={() => setHabitData({...habitData, icon: name})}>
//                     <IconComponent size={24} color="#FFF" />
//                   </TouchableX>
//                 ))}
//               </ViewX>
//             </ViewX>

//             <ViewX gap={styleUtils.spacing.xs}>
//               <TextX fontWeight="medium" fontSize="sm" color="secondary">
//                 Choose a Color
//               </TextX>
//               <ViewX
//                 flexDirection="row"
//                 flexWrap="wrap"
//                 gap={styleUtils.spacing.xs}>
//                 {colors.map(color => (
//                   <TouchableX
//                     key={color}
//                     height={vs(40)}
//                     width={vs(40)}
//                     backgroundColor={color}
//                     borderRadius={styleUtils.borderRadius.full}
//                     borderColor={
//                       habitData.color === color
//                         ? '#FFF'
//                         : themes.dark.background.transparent
//                     }
//                     borderWidth={s(2)}
//                     onPress={() => setHabitData({...habitData, color})}
//                   />
//                 ))}
//               </ViewX>
//             </ViewX>
//           </CardContainer>

//           {/* Schedule Section */}
//           <CardContainer borderRadius="lg" padding="md">
//             <ViewX
//               flexDirection="row"
//               flexWrap="wrap"
//               gap={styleUtils.spacing.xs}
//               marginBottom={styleUtils.spacing.sm}>
//               <TextX
//                 marginBottom={styleUtils.spacing.sm}
//                 fontWeight="semibold"
//                 fontSize="xl">
//                 Schedule & Reminder
//               </TextX>
//             </ViewX>

//             <ViewX
//               flexDirection="row"
//               flexWrap="wrap"
//               gap={styleUtils.spacing.xs}
//               marginBottom={styleUtils.spacing.md}>
//               {['hourly', 'daily', 'weekly', 'monthly'].map(type => (
//                 <TouchableX
//                   key={type}
//                   style={[
//                     styles.scheduleTypeButton,
//                     habitData.schedule.type === type &&
//                       styles.scheduleTypeButtonSelected,
//                   ]}
//                   onPress={() =>
//                     setHabitData({
//                       ...habitData,
//                       schedule: {
//                         ...habitData.schedule,
//                         type,
//                       },
//                     })
//                   }>
//                   <TextX
//                     fontWeight="medium"
//                     style={[
//                       styles.scheduleTypeButtonText,
//                       habitData.schedule.type === type &&
//                         styles.scheduleTypeButtonTextSelected,
//                     ]}>
//                     {type.charAt(0).toUpperCase() + type.slice(1)}
//                   </TextX>
//                 </TouchableX>
//               ))}
//             </ViewX>
//             {renderScheduleOptions()}
//           </CardContainer>

//           {/* Create Button */}
//           <TouchableX
//             padding={styleUtils.spacing.md}
//             backgroundColor={themes.dark.background.accent}
//             borderRadius={styleUtils.borderRadius.md}
//             marginBottom={styleUtils.spacing.lg}
//             justifyContent="center"
//             alignItems="center"
//             flexDirection="row"
//             gap={styleUtils.spacing.xs}>
//             <Plus size={20} color="#FFF" />
//             <TextX fontSize="lg" fontWeight="semibold">
//               Create Habit
//             </TextX>
//           </TouchableX>
//         </ViewX>
//       </ScrollView>
//     </ViewX>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '',
//   },
//   scrollView: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FFF',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#9CA3AF', // text-gray-400
//   },
//   section: {
//     // backgroundColor: '#1F2937', // bg-gray-800
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 24,
//   },
//   sectionLabel: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: '#3E3F43',
//     borderRadius: 8,
//     padding: 12,
//     color: '#FFF',
//     marginBottom: 12,
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   categoryContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   categoryButton: {
//     backgroundColor: '#3E3F43',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   categoryButtonSelected: {
//     backgroundColor: '#5C63F6',
//   },
//   categoryButtonText: {
//     color: '#FFF',
//     fontSize: 14,
//   },
//   categoryButtonTextSelected: {
//     color: '#FFF',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#FFF',
//     marginBottom: 12,
//   },
//   sectionTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 12,
//   },
//   iconGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',

//     gap: 8,
//     marginBottom: 16,
//   },
//   iconButton: {
//     width: 48,
//     height: 48,
//     backgroundColor: '#3E3F43',
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   iconButtonSelected: {
//     backgroundColor: '#6366F1',
//   },
//   colorGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   colorButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   colorButtonSelected: {
//     borderColor: '#FFF',
//   },
//   scheduleTypeContainer: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 16,
//   },
//   scheduleTypeButton: {
//     flex: 1,
//     backgroundColor: '#3E3F43',
//     padding: styleUtils.spacing.xs,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   scheduleTypeButtonSelected: {
//     backgroundColor: '#6366F1',
//   },
//   scheduleTypeButtonText: {
//     color: '#FFF',
//     fontSize: 14,
//   },
//   scheduleTypeButtonTextSelected: {
//     color: '#FFF',
//   },
//   scheduleContainer: {
//     gap: 12,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   inputLabel: {
//     color: '#9CA3AF',
//     fontSize: 14,
//   },
//   timePickerButton: {
//     backgroundColor: '#3E3F43',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   timePickerText: {
//     color: '#FFF',
//     fontSize: 14,
//   },
//   daysContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginBottom: 12,
//   },
//   dayButton: {
//     backgroundColor: '#3E3F43',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   dayButtonSelected: {
//     backgroundColor: '#6366F1',
//   },
//   dayButtonText: {
//     color: '#FFF',
//     fontSize: 14,
//   },
//   dayButtonTextSelected: {
//     color: '#FFF',
//   },
//   createButton: {
//     backgroundColor: '#6366F1',
//     padding: 16,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     marginBottom: 24,
//   },
//   createButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default HabitCreationScreen;

// import {
//   Bell,
//   Book,
//   BookOpen,
//   Brain,
//   Calendar,
//   ChevronRight,
//   Clock,
//   X as CloseIcon,
//   Code,
//   Coffee,
//   Dumbbell,
//   Flag,
//   Gauge,
//   Heart,
//   Moon,
//   Music,
//   Palette,
//   Pencil,
//   Plus,
//   Quote,
//   Smartphone,
//   Star,
//   Sun,
//   Target,
// } from 'lucide-react-native';
// import React, {useState} from 'react';
// import {
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Switch,
//   Text,
//   TextInput,
//   View,
// } from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';

// const ICONS = [
//   {name: 'target', component: Target},
//   {name: 'book', component: Book},
//   {name: 'brain', component: Brain},
//   {name: 'heart', component: Heart},
//   {name: 'dumbbell', component: Dumbbell},
//   {name: 'coffee', component: Coffee},
//   {name: 'sun', component: Sun},
//   {name: 'moon', component: Moon},
//   {name: 'music', component: Music},
//   {name: 'code', component: Code},
//   {name: 'pencil', component: Pencil},
//   {name: 'palette', component: Palette},
//   {name: 'star', component: Star},
//   {name: 'smartphone', component: Smartphone},
//   {name: 'book-open', component: BookOpen},
// ];

// const COLORS = [
//   '#6366F1', // Indigo
//   '#EF4444', // Red
//   '#10B981', // Green
//   '#F59E0B', // Yellow
//   '#EC4899', // Pink
//   '#8B5CF6', // Purple
//   '#06B6D4', // Cyan
//   '#F97316', // Orange
// ];

// const CATEGORIES = [
//   {id: 'fitness', name: 'Fitness', icon: '🏃‍♂️'},
//   {id: 'learning', name: 'Learning', icon: '📚'},
//   {id: 'mindfulness', name: 'Mindfulness', icon: '🧘‍♂️'},
//   {id: 'career', name: 'Career', icon: '💼'},
//   {id: 'health', name: 'Health', icon: '❤️'},
//   {id: 'social', name: 'Social', icon: '👥'},
//   {id: 'creativity', name: 'Creativity', icon: '🎨'},
//   {id: 'productivity', name: 'Productivity', icon: '⚡'},
// ];

// const DIFFICULTIES = [
//   {id: 'easy', name: 'Easy', color: '#10B981'},
//   {id: 'medium', name: 'Medium', color: '#F59E0B'},
//   {id: 'hard', name: 'Hard', color: '#EF4444'},
// ];

// const PRIORITIES = [
//   {id: 'low', name: 'Low', color: '#10B981'},
//   {id: 'medium', name: 'Medium', color: '#F59E0B'},
//   {id: 'high', name: 'High', color: '#EF4444'},
// ];

// interface HabitData {
//   name: string;
//   description: string;
//   category: string;
//   schedule: {
//     type: 'hourly' | 'daily' | 'weekly' | 'monthly';
//     time: string;
//     repeat: number;
//     selectedDays: string[];
//     selectedDates: number[];
//     interval: number;
//   };
//   color: string;
//   icon: string;
//   difficulty: string;
//   priority: string;
//   trackingMethod: string;
//   motivationalQuote: string;
//   reminder: {
//     enabled: boolean;
//     times: string[];
//   };
//   dates: {
//     start: Date;
//     end?: Date;
//   };
// }

// const HabitCreationScreen: React.FC = () => {
//   const insets = useSafeAreaInsets();
//   const [habitData, setHabitData] = useState<HabitData>({
//     name: '',
//     description: '',
//     category: '',
//     schedule: {
//       type: 'daily',
//       time: '',
//       repeat: 1,
//       selectedDays: [],
//       selectedDates: [],
//       interval: 1,
//     },
//     color: COLORS[0],
//     icon: 'target',
//     difficulty: 'medium',
//     priority: 'medium',
//     trackingMethod: 'binary',
//     motivationalQuote: '',
//     reminder: {
//       enabled: false,
//       times: [],
//     },
//     dates: {
//       start: new Date(),
//     },
//   });

//   const renderSection = (title: string, children: React.ReactNode) => (
//     <View style={styles.section}>
//       <Text style={styles.sectionTitle}>{title}</Text>
//       <View style={styles.sectionContent}>{children}</View>
//     </View>
//   );

//   return (
//     <View style={[styles.container, {paddingTop: insets.top}]}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Pressable hitSlop={12} onPress={() => {}}>
//           <CloseIcon size={24} color="#8E8E93" />
//         </Pressable>
//         <Text style={styles.headerTitle}>New Habit</Text>
//         <Pressable
//           style={[
//             styles.createButton,
//             !habitData.name && styles.createButtonDisabled,
//           ]}
//           disabled={!habitData.name}>
//           <Plus size={20} color="#FFFFFF" />
//           <Text style={styles.createButtonText}>Create</Text>
//         </Pressable>
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}>
//         {/* Basic Information */}
//         <View style={styles.mainSection}>
//           <TextInput
//             style={styles.nameInput}
//             placeholder="What habit do you want to build?"
//             placeholderTextColor="#8E8E93"
//             value={habitData.name}
//             onChangeText={name => setHabitData(prev => ({...prev, name}))}
//           />
//           <View style={styles.separator} />
//           <TextInput
//             style={styles.descriptionInput}
//             placeholder="Why do you want to build this habit? (Optional)"
//             placeholderTextColor="#8E8E93"
//             multiline
//             numberOfLines={3}
//             value={habitData.description}
//             onChangeText={description =>
//               setHabitData(prev => ({...prev, description}))
//             }
//           />
//         </View>

//         {/* Category Selection
//         {renderSection(
//           'Category',
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.categoryContainer}>
//             {CATEGORIES.map(category => (
//               <Pressable
//                 key={category.id}
//                 style={[
//                   styles.categoryCard,
//                   habitData.category === category.id &&
//                     styles.categoryCardSelected,
//                 ]}
//                 onPress={() =>
//                   setHabitData(prev => ({...prev, category: category.id}))
//                 }>
//                 <Text style={styles.categoryIcon}>{category.icon}</Text>
//                 <Text style={styles.categoryName}>{category.name}</Text>
//               </Pressable>
//             ))}
//           </ScrollView>,
//         )} */}

//         <CategorySection />

//         {/* Icons & Colors */}
//         {renderSection(
//           'Personalization',
//           <View style={styles.personalizationContainer}>
//             {/* Icons */}
//             <Text style={styles.subsectionTitle}>Choose an Icon</Text>
//             <View style={styles.iconGrid}>
//               {ICONS.map(({name, component: Icon}) => (
//                 <Pressable
//                   key={name}
//                   style={[
//                     styles.iconButton,
//                     habitData.icon === name && styles.iconButtonSelected,
//                     habitData.icon === name && {borderColor: habitData.color},
//                   ]}
//                   onPress={() => setHabitData(prev => ({...prev, icon: name}))}>
//                   <Icon
//                     size={24}
//                     color={
//                       habitData.icon === name ? habitData.color : '#8E8E93'
//                     }
//                   />
//                 </Pressable>
//               ))}
//             </View>

//             {/* Colors */}
//             <Text style={styles.subsectionTitle}>Choose a Color</Text>
//             <View style={styles.colorGrid}>
//               {COLORS.map(color => (
//                 <Pressable
//                   key={color}
//                   style={[
//                     styles.colorButton,
//                     {backgroundColor: color},
//                     habitData.color === color && styles.colorButtonSelected,
//                   ]}
//                   onPress={() =>
//                     setHabitData(prev => ({...prev, color: color}))
//                   }
//                 />
//               ))}
//             </View>
//           </View>,
//         )}

//         {/* Schedule */}
//         {renderSection(
//           'Schedule',
//           <View style={styles.scheduleContainer}>
//             {/* Schedule Type */}
//             <View style={styles.scheduleTypeRow}>
//               {['hourly', 'daily', 'weekly', 'monthly'].map(type => (
//                 <Pressable
//                   key={type}
//                   style={[
//                     styles.scheduleTypeButton,
//                     habitData.schedule.type === type &&
//                       styles.scheduleTypeButtonSelected,
//                     habitData.schedule.type === type && {
//                       borderColor: habitData.color,
//                     },
//                   ]}
//                   onPress={() =>
//                     setHabitData(prev => ({
//                       ...prev,
//                       schedule: {
//                         ...prev.schedule,
//                         type: type as HabitData['schedule']['type'],
//                       },
//                     }))
//                   }>
//                   <Text
//                     style={[
//                       styles.scheduleTypeText,
//                       habitData.schedule.type === type &&
//                         styles.scheduleTypeTextSelected,
//                     ]}>
//                     {type.charAt(0).toUpperCase() + type.slice(1)}
//                   </Text>
//                 </Pressable>
//               ))}
//             </View>

//             {/* Schedule Options based on type */}
//             {habitData.schedule.type === 'hourly' && (
//               <View style={styles.scheduleOptionContainer}>
//                 <View style={styles.inputRow}>
//                   <TextInput
//                     style={styles.scheduleInput}
//                     keyboardType="number-pad"
//                     placeholder="Every X hours"
//                     placeholderTextColor="#8E8E93"
//                     value={habitData.schedule.interval.toString()}
//                     onChangeText={value =>
//                       setHabitData(prev => ({
//                         ...prev,
//                         schedule: {
//                           ...prev.schedule,
//                           interval: parseInt(value) || 1,
//                         },
//                       }))
//                     }
//                   />
//                   <Text style={styles.inputLabel}>hours</Text>
//                 </View>
//               </View>
//             )}

//             {habitData.schedule.type === 'daily' && (
//               <View style={styles.scheduleOptionContainer}>
//                 <Pressable style={styles.timeButton}>
//                   <Clock size={20} color={habitData.color} />
//                   <Text style={styles.timeButtonText}>
//                     {habitData.schedule.time || 'Set time'}
//                   </Text>
//                   <ChevronRight size={20} color="#8E8E93" />
//                 </Pressable>
//                 <View style={styles.inputRow}>
//                   <TextInput
//                     style={styles.scheduleInput}
//                     keyboardType="number-pad"
//                     placeholder="Repeat times per day"
//                     placeholderTextColor="#8E8E93"
//                     value={habitData.schedule.repeat.toString()}
//                     onChangeText={value =>
//                       setHabitData(prev => ({
//                         ...prev,
//                         schedule: {
//                           ...prev.schedule,
//                           repeat: parseInt(value) || 1,
//                         },
//                       }))
//                     }
//                   />
//                   <Text style={styles.inputLabel}>times</Text>
//                 </View>
//               </View>
//             )}

//             {habitData.schedule.type === 'weekly' && (
//               <View style={styles.scheduleOptionContainer}>
//                 <View style={styles.daysContainer}>
//                   {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
//                     day => (
//                       <Pressable
//                         key={day}
//                         style={[
//                           styles.dayButton,
//                           habitData.schedule.selectedDays.includes(day) &&
//                             styles.dayButtonSelected,
//                           habitData.schedule.selectedDays.includes(day) && {
//                             backgroundColor: habitData.color,
//                           },
//                         ]}
//                         onPress={() => {
//                           const selectedDays =
//                             habitData.schedule.selectedDays.includes(day)
//                               ? habitData.schedule.selectedDays.filter(
//                                   d => d !== day,
//                                 )
//                               : [...habitData.schedule.selectedDays, day];
//                           setHabitData(prev => ({
//                             ...prev,
//                             schedule: {...prev.schedule, selectedDays},
//                           }));
//                         }}>
//                         <Text
//                           style={[
//                             styles.dayButtonText,
//                             habitData.schedule.selectedDays.includes(day) &&
//                               styles.dayButtonTextSelected,
//                           ]}>
//                           {day}
//                         </Text>
//                       </Pressable>
//                     ),
//                   )}
//                 </View>
//                 <Pressable style={styles.timeButton}>
//                   <Clock size={20} color={habitData.color} />
//                   <Text style={styles.timeButtonText}>
//                     {habitData.schedule.time || 'Set time'}
//                   </Text>
//                   <ChevronRight size={20} color="#8E8E93" />
//                 </Pressable>
//               </View>
//             )}

//             {habitData.schedule.type === 'monthly' && (
//               <View style={styles.scheduleOptionContainer}>
//                 <TextInput
//                   style={styles.scheduleInput}
//                   keyboardType="number-pad"
//                   placeholder="Day of month (1-31)"
//                   placeholderTextColor="#8E8E93"
//                   value={habitData.schedule.selectedDates[0]?.toString()}
//                   onChangeText={value => {
//                     const day = parseInt(value);
//                     if (!isNaN(day) && day >= 1 && day <= 31) {
//                       setHabitData(prev => ({
//                         ...prev,
//                         schedule: {...prev.schedule, selectedDates: [day]},
//                       }));
//                     }
//                   }}
//                 />
//                 <Pressable style={styles.timeButton}>
//                   <Clock size={20} color={habitData.color} />
//                   <Text style={styles.timeButtonText}>
//                     {habitData.schedule.time || 'Set time'}
//                   </Text>
//                   <ChevronRight size={20} color="#8E8E93" />
//                 </Pressable>
//               </View>
//             )}
//           </View>,
//         )}

//         {/* Difficulty & Priority */}
//         {renderSection(
//           'Challenge Level',
//           <View style={styles.challengeContainer}>
//             {/* Difficulty */}
//             <View style={styles.challengeSection}>
//               <Text style={styles.subsectionTitle}>Difficulty</Text>
//               <View style={styles.challengeOptions}>
//                 {DIFFICULTIES.map(diff => (
//                   <Pressable
//                     key={diff.id}
//                     style={[
//                       styles.challengeButton,
//                       habitData.difficulty === diff.id &&
//                         styles.challengeButtonSelected,
//                       habitData.difficulty === diff.id && {
//                         borderColor: diff.color,
//                       },
//                     ]}
//                     onPress={() =>
//                       setHabitData(prev => ({...prev, difficulty: diff.id}))
//                     }>
//                     <Gauge
//                       size={20}
//                       color={
//                         habitData.difficulty === diff.id
//                           ? diff.color
//                           : '#8E8E93'
//                       }
//                     />
//                     <Text
//                       style={[
//                         styles.challengeButtonText,
//                         habitData.difficulty === diff.id && {color: diff.color},
//                       ]}>
//                       {diff.name}
//                     </Text>
//                   </Pressable>
//                 ))}
//               </View>
//             </View>

//             {/* Priority */}
//             <View style={styles.challengeSection}>
//               <Text style={styles.subsectionTitle}>Priority</Text>
//               <View style={styles.challengeOptions}>
//                 {PRIORITIES.map(prio => (
//                   <Pressable
//                     key={prio.id}
//                     style={[
//                       styles.challengeButton,
//                       habitData.priority === prio.id &&
//                         styles.challengeButtonSelected,
//                       habitData.priority === prio.id && {
//                         borderColor: prio.color,
//                       },
//                     ]}
//                     onPress={() =>
//                       setHabitData(prev => ({...prev, priority: prio.id}))
//                     }>
//                     <Flag
//                       size={20}
//                       color={
//                         habitData.priority === prio.id ? prio.color : '#8E8E93'
//                       }
//                     />
//                     <Text
//                       style={[
//                         styles.challengeButtonText,
//                         habitData.priority === prio.id && {color: prio.color},
//                       ]}>
//                       {prio.name}
//                     </Text>
//                   </Pressable>
//                 ))}
//               </View>
//             </View>
//           </View>,
//         )}

//         {/* Tracking Method */}
//         {renderSection(
//           'Tracking Method',
//           <View style={styles.trackingContainer}>
//             <Pressable
//               style={[
//                 styles.trackingOption,
//                 habitData.trackingMethod === 'binary' &&
//                   styles.trackingOptionSelected,
//               ]}
//               onPress={() =>
//                 setHabitData(prev => ({...prev, trackingMethod: 'binary'}))
//               }>
//               <View style={styles.trackingContent}>
//                 <Text style={styles.trackingTitle}>Yes/No</Text>
//                 <Text style={styles.trackingDescription}>
//                   Simple completion tracking
//                 </Text>
//               </View>
//               <View
//                 style={[
//                   styles.radioButton,
//                   habitData.trackingMethod === 'binary' &&
//                     styles.radioButtonSelected,
//                 ]}
//               />
//             </Pressable>

//             <View style={styles.trackingDivider} />

//             <Pressable
//               style={[
//                 styles.trackingOption,
//                 habitData.trackingMethod === 'numeric' &&
//                   styles.trackingOptionSelected,
//               ]}
//               onPress={() =>
//                 setHabitData(prev => ({...prev, trackingMethod: 'numeric'}))
//               }>
//               <View style={styles.trackingContent}>
//                 <Text style={styles.trackingTitle}>Count</Text>
//                 <Text style={styles.trackingDescription}>
//                   Track with numbers (reps, minutes, etc.)
//                 </Text>
//               </View>
//               <View
//                 style={[
//                   styles.radioButton,
//                   habitData.trackingMethod === 'numeric' &&
//                     styles.radioButtonSelected,
//                 ]}
//               />
//             </Pressable>
//           </View>,
//         )}

//         {/* Motivational Quote */}
//         {renderSection(
//           'Motivation',
//           <View style={styles.quoteContainer}>
//             <View style={styles.quoteHeader}>
//               <Quote size={20} color={habitData.color} />
//               <Text style={styles.quoteTitle}>Add a motivational quote</Text>
//             </View>
//             <TextInput
//               style={styles.quoteInput}
//               placeholder="What motivates you to build this habit?"
//               placeholderTextColor="#8E8E93"
//               multiline
//               numberOfLines={2}
//               value={habitData.motivationalQuote}
//               onChangeText={quote =>
//                 setHabitData(prev => ({...prev, motivationalQuote: quote}))
//               }
//             />
//           </View>,
//         )}

//         {/* Reminders */}
//         {renderSection(
//           'Reminders',
//           <View style={styles.reminderContainer}>
//             <View style={styles.reminderHeader}>
//               <View style={styles.reminderInfo}>
//                 <Bell size={20} color={habitData.color} />
//                 <Text style={styles.reminderText}>Daily Reminder</Text>
//               </View>
//               <Switch
//                 value={habitData.reminder.enabled}
//                 onValueChange={enabled =>
//                   setHabitData(prev => ({
//                     ...prev,
//                     reminder: {...prev.reminder, enabled},
//                   }))
//                 }
//                 trackColor={{false: '#3A3A3C', true: habitData.color}}
//                 thumbColor="#FFFFFF"
//               />
//             </View>
//             {habitData.reminder.enabled && (
//               <>
//                 <View style={styles.reminderDivider} />
//                 <Pressable style={styles.reminderTimeButton}>
//                   <Clock size={20} color="#8E8E93" />
//                   <Text style={styles.reminderTimeText}>Set reminder time</Text>
//                   <ChevronRight size={20} color="#8E8E93" />
//                 </Pressable>
//               </>
//             )}
//           </View>,
//         )}

//         {/* Start/End Dates */}
//         {renderSection(
//           'Schedule',
//           <View style={styles.datesContainer}>
//             <Pressable style={styles.dateButton}>
//               <View style={styles.dateLeft}>
//                 <Calendar size={20} color={habitData.color} />
//                 <Text style={styles.dateText}>Start Date</Text>
//               </View>
//               <View style={styles.dateRight}>
//                 <Text style={styles.dateValue}>Today</Text>
//                 <ChevronRight size={20} color="#8E8E93" />
//               </View>
//             </Pressable>
//             <View style={styles.dateDivider} />
//             <Pressable style={styles.dateButton}>
//               <View style={styles.dateLeft}>
//                 <Calendar size={20} color={habitData.color} />
//                 <Text style={styles.dateText}>End Date (Optional)</Text>
//               </View>
//               <View style={styles.dateRight}>
//                 <Text style={styles.dateValue}>None</Text>
//                 <ChevronRight size={20} color="#8E8E93" />
//               </View>
//             </Pressable>
//           </View>,
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// export default HabitCreationScreen;

// import {Dimensions} from 'react-native';
// import {CategorySection} from './Categories';

// const {width} = Dimensions.get('window');

// const styles = StyleSheet.create({
//   // Main Container
//   container: {
//     flex: 1,
//     backgroundColor: '#000000',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: Platform.OS === 'ios' ? 40 : 24,
//   },

//   // Header
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 0.5,
//     borderBottomColor: '#2C2C2E',
//   },
//   headerTitle: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   createButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: '#0A84FF',
//     borderRadius: 8,
//   },
//   createButtonDisabled: {
//     opacity: 0.5,
//   },
//   createButtonText: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },

//   // Sections
//   section: {
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//   },
//   sectionTitle: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#8E8E93',
//     marginBottom: 12,
//     textTransform: 'uppercase',
//     letterSpacing: 0.8,
//   },
//   sectionContent: {
//     backgroundColor: '#1C1C1E',
//     borderRadius: 12,
//     overflow: 'hidden',
//   },

//   // Main Input Section
//   mainSection: {
//     paddingHorizontal: 16,
//     paddingVertical: 24,
//   },
//   nameInput: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     padding: 0,
//     marginBottom: 16,
//   },
//   descriptionInput: {
//     fontSize: 17,
//     color: '#8E8E93',
//     padding: 0,
//     minHeight: 60,
//     textAlignVertical: 'top',
//   },
//   separator: {
//     height: 0.5,
//     backgroundColor: '#2C2C2E',
//     marginVertical: 16,
//   },

//   // Category Section
//   categoryContainer: {
//     padding: 12,
//     gap: 12,
//   },
//   categoryCard: {
//     width: 88,
//     aspectRatio: 1,
//     backgroundColor: '#2C2C2E',
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   categoryCardSelected: {
//     backgroundColor: '#3A3A3C',
//   },
//   categoryIcon: {
//     fontSize: 24,
//     marginBottom: 8,
//   },
//   categoryName: {
//     fontSize: 13,
//     color: '#FFFFFF',
//     textAlign: 'center',
//   },

//   // Personalization Section
//   personalizationContainer: {
//     padding: 16,
//     gap: 24,
//   },
//   subsectionTitle: {
//     fontSize: 15,
//     color: '#8E8E93',
//     marginBottom: 12,
//   },
//   iconGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//     marginBottom: 8,
//   },
//   iconButton: {
//     width: 44,
//     height: 44,
//     backgroundColor: '#2C2C2E',
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   iconButtonSelected: {
//     backgroundColor: '#3A3A3C',
//   },
//   colorGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//   },
//   colorButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   colorButtonSelected: {
//     borderColor: '#FFFFFF',
//   },

//   // Schedule Section
//   scheduleContainer: {
//     padding: 12,
//   },
//   scheduleTypeRow: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 16,
//   },
//   scheduleTypeButton: {
//     flex: 1,
//     backgroundColor: '#2C2C2E',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   scheduleTypeButtonSelected: {
//     backgroundColor: '#3A3A3C',
//   },
//   scheduleTypeText: {
//     fontSize: 15,
//     color: '#8E8E93',
//     textAlign: 'center',
//   },
//   scheduleTypeTextSelected: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   scheduleOptionContainer: {
//     gap: 12,
//   },
//   scheduleInput: {
//     backgroundColor: '#2C2C2E',
//     borderRadius: 8,
//     padding: 12,
//     color: '#FFFFFF',
//     fontSize: 17,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   inputLabel: {
//     color: '#8E8E93',
//     fontSize: 17,
//   },
//   timeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#2C2C2E',
//     padding: 12,
//     borderRadius: 8,
//     gap: 12,
//   },
//   timeButtonText: {
//     fontSize: 17,
//     color: '#8E8E93',
//     flex: 1,
//   },

//   // Days Selection
//   daysContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginBottom: 12,
//   },
//   dayButton: {
//     backgroundColor: '#2C2C2E',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//     minWidth: 48,
//     alignItems: 'center',
//   },
//   dayButtonSelected: {
//     backgroundColor: '#3A3A3C',
//   },
//   dayButtonText: {
//     color: '#8E8E93',
//     fontSize: 15,
//   },
//   dayButtonTextSelected: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },

//   // Challenge Section
//   challengeContainer: {
//     padding: 16,
//     gap: 24,
//   },
//   challengeSection: {
//     gap: 12,
//   },
//   challengeOptions: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   challengeButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     backgroundColor: '#2C2C2E',
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   challengeButtonSelected: {
//     backgroundColor: '#3A3A3C',
//   },
//   challengeButtonText: {
//     fontSize: 15,
//     color: '#8E8E93',
//   },

//   // Tracking Section
//   trackingContainer: {
//     padding: 4,
//   },
//   trackingOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//   },
//   trackingOptionSelected: {
//     backgroundColor: '#2C2C2E',
//   },
//   trackingContent: {
//     flex: 1,
//   },
//   trackingTitle: {
//     fontSize: 17,
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   trackingDescription: {
//     fontSize: 13,
//     color: '#8E8E93',
//   },
//   radioButton: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#8E8E93',
//   },
//   radioButtonSelected: {
//     backgroundColor: '#0A84FF',
//     borderColor: '#0A84FF',
//   },
//   trackingDivider: {
//     height: 0.5,
//     backgroundColor: '#2C2C2E',
//   },

//   // Quote Section
//   quoteContainer: {
//     padding: 16,
//     gap: 16,
//   },
//   quoteHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   quoteTitle: {
//     fontSize: 17,
//     color: '#FFFFFF',
//   },
//   quoteInput: {
//     backgroundColor: '#2C2C2E',
//     borderRadius: 8,
//     padding: 12,
//     color: '#FFFFFF',
//     fontSize: 17,
//     minHeight: 80,
//     textAlignVertical: 'top',
//   },

//   // Reminder Section
//   reminderContainer: {
//     padding: 4,
//   },
//   reminderHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//   },
//   reminderInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   reminderText: {
//     fontSize: 17,
//     color: '#FFFFFF',
//   },
//   reminderDivider: {
//     height: 0.5,
//     backgroundColor: '#2C2C2E',
//   },
//   reminderTimeButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     gap: 12,
//   },
//   reminderTimeText: {
//     fontSize: 17,
//     color: '#8E8E93',
//     flex: 1,
//   },

//   // Dates Section
//   datesContainer: {
//     padding: 4,
//   },
//   dateButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//   },
//   dateLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   dateText: {
//     fontSize: 17,
//     color: '#FFFFFF',
//   },
//   dateRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   dateValue: {
//     fontSize: 17,
//     color: '#8E8E93',
//   },
//   dateDivider: {
//     height: 0.5,
//     backgroundColor: '#2C2C2E',
//   },

//   // Platform Specific Adjustments
//   ...Platform.select({
//     ios: {
//       nameInput: {
//         fontWeight: '600',
//       },
//     },
//     android: {
//       nameInput: {
//         fontWeight: '500',
//       },
//     },
//   }),
// });

import DateTimePicker from '@react-native-community/datetimepicker';
import {Calendar} from 'lucide-react-native';
import {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import {CategorySelector} from './Categories';
import {DEFAULT_HABIT_DATA, HabitData} from './data';
import {EvaluationTypeSelector} from './Evaluation';
import {FrequencySelector} from './Frequency';
import {GoalSettings} from './Goal';
import {Reminders} from './Reminders';
import {baseStyles, COLORS} from './styles';

const CreateHabitScreen = () => {
  const [habitData, setHabitData] = useState<HabitData>(DEFAULT_HABIT_DATA);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentReminder, setCurrentReminder] = useState<Date | null>(null);

  const handleSave = () => {
    // Validate and save habit data
    console.log('Saving habit:', habitData);
  };

  const addReminder = (time: Date) => {
    setHabitData(prev => ({
      ...prev,
      reminders: [...prev.reminders, time],
    }));
  };

  const removeReminder = (index: number) => {
    setHabitData(prev => ({
      ...prev,
      reminders: prev.reminders.filter((_, i) => i !== index),
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create New Habit</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        {/* Basic Information */}
        <View style={baseStyles.inputGroup}>
          <Text style={baseStyles.label}>Name</Text>
          <TextInput
            style={baseStyles.input}
            value={habitData.name}
            onChangeText={name => setHabitData(prev => ({...prev, name}))}
            placeholder="Enter habit name"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <View style={baseStyles.inputGroup}>
          <Text style={baseStyles.label}>Description</Text>
          <TextInput
            style={[baseStyles.input, styles.textArea]}
            value={habitData.description}
            onChangeText={description =>
              setHabitData(prev => ({...prev, description}))
            }
            placeholder="Enter description"
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Color and Icon Selection */}
        <View style={baseStyles.inputGroup}>
          <Text style={baseStyles.label}>Appearance</Text>
          <View style={styles.appearanceContainer}>
            <TouchableOpacity
              style={[styles.colorPreview, {backgroundColor: habitData.color}]}
              onPress={() => setShowColorPicker(true)}
            />
          </View>
        </View>

        {/* Category Selector */}
        <CategorySelector
          selectedCategory={habitData.category}
          onSelectCategory={category =>
            setHabitData(prev => ({...prev, category}))
          }
        />

        {/* Frequency Selector */}
        <FrequencySelector
          frequency={habitData.frequency}
          frequencyDetails={habitData.frequencyDetails}
          onFrequencyChange={frequency => {
            setHabitData(prev => ({...prev, frequency}));
          }}
          onFrequencyDetailsChange={details => {
            setHabitData(prev => ({
              ...prev,
              frequencyDetails: {...prev.frequencyDetails, ...details},
            }));
          }}
        />

        {/* Evaluation Type Selector */}
        <EvaluationTypeSelector
          evaluationType={habitData.evaluationType}
          evaluationDetails={habitData.evaluationDetails}
          onTypeChange={type => {
            setHabitData(prev => ({
              ...prev,
              evaluationType: type,
            }));
          }}
          onDetailsChange={details => {
            setHabitData(prev => ({
              ...prev,
              evaluationDetails: {
                ...prev.evaluationDetails,
                ...details,
              },
            }));
          }}
        />

        {/* Goal Settings */}
        <GoalSettings
          goal={habitData.goal}
          onGoalChange={goal =>
            setHabitData(prev => ({
              ...prev,
              goal: {...prev.goal, ...goal},
            }))
          }
          onDeadlinePicker={() => setShowEndPicker(true)}
        />

        {/* Reminders */}
        <Reminders
          reminders={habitData.reminders}
          onAddReminder={() => {
            setCurrentReminder(new Date());
            setShowTimePicker(true);
          }}
          onRemoveReminder={removeReminder}
        />

        {/* Date Range */}
        <View style={baseStyles.inputGroup}>
          <Text style={baseStyles.label}>Date Range</Text>
          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartPicker(true)}>
              <Calendar size={20} color={COLORS.text} />
              <Text style={styles.dateButtonText}>
                {habitData.startDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <Text style={styles.dateSeperator}>to</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndPicker(true)}>
              <Calendar size={20} color={COLORS.text} />
              <Text style={styles.dateButtonText}>
                {habitData.endDate
                  ? habitData.endDate.toLocaleDateString()
                  : 'No end date'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={habitData.startDate}
          mode="date"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) {
              setHabitData(prev => ({...prev, startDate: date}));
            }
          }}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={habitData.endDate || new Date()}
          mode="date"
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) {
              setHabitData(prev => ({...prev, endDate: date}));
            }
          }}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={currentReminder || new Date()}
          mode="time"
          onChange={(event, date) => {
            setShowTimePicker(false);
            if (date) {
              addReminder(date);
              setCurrentReminder(null);
            }
          }}
        />
      )}

      {/* Color Picker Modal */}
      {showColorPicker && (
        <View style={styles.colorPickerContainer}>
          <ColorPicker
            color={habitData.color}
            onColorChange={color => setHabitData(prev => ({...prev, color}))}
            thumbSize={40}
            sliderSize={40}
            noSnap={true}
            row={false}
          />
          <TouchableOpacity
            style={styles.colorPickerDone}
            onPress={() => setShowColorPicker(false)}>
            <Text style={styles.colorPickerDoneText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  formContainer: {
    padding: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  appearanceContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.text,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateButton: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButtonText: {
    color: COLORS.text,
    fontSize: 15,
  },
  dateSeperator: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  colorPickerContainer: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    margin: 16,
  },
  colorPickerDone: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  colorPickerDoneText: {
    color: COLORS.text,
    fontWeight: '600',
  },
});

export default CreateHabitScreen;
