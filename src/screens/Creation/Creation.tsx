//@ts-nocheck
import {
  Book,
  BookOpen,
  Brain,
  Code,
  Coffee,
  Dumbbell,
  Heart,
  Moon,
  Music,
  Palette,
  Pencil,
  Plus,
  Smartphone,
  Star,
  Sun,
  Target,
} from 'lucide-react-native';
import {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextX, TouchableX, ViewX} from '~components/common';
import Input from '~components/common/Input';
import CardContainer from '~containers/SquircleViewContainer';
import {styleUtils, themes} from '~styles/theme';
import {s, vs} from '~utils/screenUtil';

const HabitCreationScreen = () => {
  const [habitData, setHabitData] = useState({
    name: '',
    description: '',
    category: '',
    schedule: {
      type: 'daily',
      time: '',
      repeat: 1,
      selectedDays: [],
      selectedDates: [],
      interval: 1,
    },
    color: '#6366F1',
    icon: 'target',
    difficulty: 'medium',
    priority: 'medium',
    trackingMethod: 'binary',
    motivationalQuote: '',
  });

  const icons = [
    {name: 'target', component: Target},
    {name: 'book', component: Book},
    {name: 'brain', component: Brain},
    {name: 'heart', component: Heart},
    {name: 'dumbbell', component: Dumbbell},
    {name: 'coffee', component: Coffee},
    {name: 'sun', component: Sun},
    {name: 'moon', component: Moon},
    {name: 'music', component: Music},
    {name: 'code', component: Code},
    {name: 'pencil', component: Pencil},
    {name: 'palette', component: Palette},
    {name: 'star', component: Star},
    {name: 'smartphone', component: Smartphone},
    {name: 'book-open', component: BookOpen},
  ];

  const colors = [
    '#6366F1', // Indigo
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EC4899', // Pink
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
  ];

  const categories = [
    'Fitness',
    'Learning',
    'Mindfulness',
    'Career',
    'Health',
    'Social',
    'Creativity',
    'Productivity',
  ];

  const renderScheduleOptions = () => {
    switch (habitData.schedule.type) {
      case 'hourly':
        return (
          <ViewX style={styles.scheduleContainer}>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, {flex: 1}]}
                keyboardType="number-pad"
                placeholder="Every X hours"
                placeholderTextColor="#9CA3AF"
                value={habitData.schedule.interval.toString()}
                onChangeText={value =>
                  setHabitData({
                    ...habitData,
                    schedule: {
                      ...habitData.schedule,
                      interval: parseInt(value) || 1,
                    },
                  })
                }
              />
              <Text style={styles.inputLabel}>hours</Text>
            </View>
          </ViewX>
        );

      case 'daily':
        return (
          <View style={styles.scheduleContainer}>
            <TouchableX
              style={styles.timePickerButton}
              onPress={async () => {}}>
              <Text style={styles.timePickerText}>
                {habitData.schedule.time || 'Select Time'}
              </Text>
            </TouchableX>

            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, {flex: 1}]}
                keyboardType="number-pad"
                placeholder="Repeat times per day"
                placeholderTextColor="#9CA3AF"
                value={habitData.schedule.repeat.toString()}
                onChangeText={value =>
                  setHabitData({
                    ...habitData,
                    schedule: {
                      ...habitData.schedule,
                      repeat: parseInt(value) || 1,
                    },
                  })
                }
              />
              <Text style={styles.inputLabel}>times</Text>
            </View>
          </View>
        );

      case 'weekly':
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return (
          <View style={styles.scheduleContainer}>
            <View style={styles.daysContainer}>
              {days.map(day => (
                <TouchableX
                  key={day}
                  style={[
                    styles.dayButton,
                    habitData.schedule.selectedDays.includes(day) &&
                      styles.dayButtonSelected,
                  ]}
                  onPress={() => {
                    const newDays = habitData.schedule.selectedDays.includes(
                      day,
                    )
                      ? habitData.schedule.selectedDays.filter(d => d !== day)
                      : [...habitData.schedule.selectedDays, day];
                    setHabitData({
                      ...habitData,
                      schedule: {
                        ...habitData.schedule,
                        selectedDays: newDays,
                      },
                    });
                  }}>
                  <TextX
                    style={[
                      styles.dayButtonText,
                      habitData.schedule.selectedDays.includes(day) &&
                        styles.dayButtonTextSelected,
                    ]}>
                    {day}
                  </TextX>
                </TouchableX>
              ))}
            </View>

            <TouchableX
              style={styles.timePickerButton}
              onPress={async () => {
                // Handle time picker
              }}>
              <Text style={styles.timePickerText}>
                {habitData.schedule.time || 'Select Time'}
              </Text>
            </TouchableX>
          </View>
        );

      case 'monthly':
        return (
          <View style={styles.scheduleContainer}>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              placeholder="Day of month (1-31)"
              placeholderTextColor="#9CA3AF"
              value={habitData.schedule.selectedDates[0]?.toString() || ''}
              onChangeText={value => {
                const day = parseInt(value);
                if (!isNaN(day) && day >= 1 && day <= 31) {
                  setHabitData({
                    ...habitData,
                    schedule: {
                      ...habitData.schedule,
                      selectedDates: [day],
                    },
                  });
                }
              }}
            />

            <TouchableX
              style={styles.timePickerButton}
              onPress={async () => {
                // Handle time picker
              }}>
              <Text style={styles.timePickerText}>
                {habitData.schedule.time || 'Select Time'}
              </Text>
            </TouchableX>
          </View>
        );
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <ViewX flex={1} variant="primary">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{paddingVertical: insets.top}}
        showsVerticalScrollIndicator={false}>
        {/* Header */}

        <ViewX gap={styleUtils.spacing.sm}>
          {/* <ViewX style={styles.header}>
            <Text style={styles.title}>Create New Habit</Text>
            <Text style={styles.subtitle}>Design your path to success</Text>
          </ViewX> */}

          {/* Basic Info Section */}
          <CardContainer borderRadius="lg" padding="md">
            <TextX
              marginBottom={styleUtils.spacing.sm}
              fontWeight="semibold"
              fontSize="xl">
              Basic Information
            </TextX>
            <Input
              placeholder="Habit Name"
              placeholderTextColor="#9CA3AF"
              validate={text => {
                if (!text.includes('@')) {
                  return 'Invalid email address';
                }
                return null;
              }}
              value={habitData.name}
              bgColor="#3E3F43"
              onChangeText={text => setHabitData({...habitData, name: text})}
            />

            <Input
              placeholder="Description (Optional)"
              placeholderTextColor="#9CA3AF"
              validate={text => {
                if (!text.includes('@')) {
                  return 'Invalid email address';
                }
                return null;
              }}
              multiline
              numberOfLines={3}
              value={habitData.description}
              onChangeText={text =>
                setHabitData({...habitData, description: text})
              }
              bgColor="#3E3F43"
              inputStyle={styles.textArea}
            />
          </CardContainer>

          <CardContainer borderRadius="lg" padding="md">
            <TextX
              marginBottom={styleUtils.spacing.sm}
              fontWeight="semibold"
              fontSize="xl">
              Category
            </TextX>
            <ViewX
              flexDirection="row"
              flexWrap="wrap"
              gap={styleUtils.spacing.xs}>
              {categories.map(category => (
                <TouchableX
                  key={category}
                  paddingHorizontal={styleUtils.spacing.sm}
                  paddingVertical={styleUtils.spacing.xs}
                  backgroundColor={
                    habitData.category === category
                      ? themes.dark.background.accent
                      : '#3E3F43'
                  }
                  borderRadius={styleUtils.borderRadius.sm}
                  onPress={() => setHabitData({...habitData, category})}>
                  <TextX fontSize="sm" fontWeight="medium">
                    {category}
                  </TextX>
                </TouchableX>
              ))}
            </ViewX>
          </CardContainer>

          {/* Icon and Color Selection */}
          <CardContainer borderRadius="lg" padding="md">
            <TextX
              marginBottom={styleUtils.spacing.sm}
              fontWeight="semibold"
              fontSize="xl">
              Personalization
            </TextX>

            <ViewX
              flexDirection="row"
              flexWrap="wrap"
              gap={styleUtils.spacing.xs}
              marginBottom={styleUtils.spacing.md}>
              <TextX fontWeight="medium" fontSize="sm" color="secondary">
                Choose an Icon
              </TextX>
              <ViewX
                flexDirection="row"
                flexWrap="wrap"
                gap={styleUtils.spacing.xs}>
                {icons.map(({name, component: IconComponent}) => (
                  <TouchableX
                    key={name}
                    borderRadius={styleUtils.borderRadius.sm}
                    justifyContent="center"
                    alignItems="center"
                    height={vs(50)}
                    width={vs(50)}
                    backgroundColor={
                      habitData.icon === name
                        ? themes.dark.background.accent
                        : '#3E3F43'
                    }
                    onPress={() => setHabitData({...habitData, icon: name})}>
                    <IconComponent size={24} color="#FFF" />
                  </TouchableX>
                ))}
              </ViewX>
            </ViewX>

            <ViewX gap={styleUtils.spacing.xs}>
              <TextX fontWeight="medium" fontSize="sm" color="secondary">
                Choose a Color
              </TextX>
              <ViewX
                flexDirection="row"
                flexWrap="wrap"
                gap={styleUtils.spacing.xs}>
                {colors.map(color => (
                  <TouchableX
                    key={color}
                    height={vs(40)}
                    width={vs(40)}
                    backgroundColor={color}
                    borderRadius={styleUtils.borderRadius.full}
                    borderColor={
                      habitData.color === color
                        ? '#FFF'
                        : themes.dark.background.transparent
                    }
                    borderWidth={s(2)}
                    onPress={() => setHabitData({...habitData, color})}
                  />
                ))}
              </ViewX>
            </ViewX>
          </CardContainer>

          {/* Schedule Section */}
          <CardContainer borderRadius="lg" padding="md">
            <ViewX
              flexDirection="row"
              flexWrap="wrap"
              gap={styleUtils.spacing.xs}
              marginBottom={styleUtils.spacing.sm}>
              <TextX
                marginBottom={styleUtils.spacing.sm}
                fontWeight="semibold"
                fontSize="xl">
                Schedule & Reminder
              </TextX>
            </ViewX>

            <ViewX
              flexDirection="row"
              flexWrap="wrap"
              gap={styleUtils.spacing.xs}
              marginBottom={styleUtils.spacing.md}>
              {['hourly', 'daily', 'weekly', 'monthly'].map(type => (
                <TouchableX
                  key={type}
                  style={[
                    styles.scheduleTypeButton,
                    habitData.schedule.type === type &&
                      styles.scheduleTypeButtonSelected,
                  ]}
                  onPress={() =>
                    setHabitData({
                      ...habitData,
                      schedule: {
                        ...habitData.schedule,
                        type,
                      },
                    })
                  }>
                  <TextX
                    fontWeight="medium"
                    style={[
                      styles.scheduleTypeButtonText,
                      habitData.schedule.type === type &&
                        styles.scheduleTypeButtonTextSelected,
                    ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </TextX>
                </TouchableX>
              ))}
            </ViewX>
            {renderScheduleOptions()}
          </CardContainer>

          {/* Create Button */}
          <TouchableX
            padding={styleUtils.spacing.md}
            backgroundColor={themes.dark.background.accent}
            borderRadius={styleUtils.borderRadius.md}
            marginBottom={styleUtils.spacing.lg}
            justifyContent="center"
            alignItems="center"
            flexDirection="row"
            gap={styleUtils.spacing.xs}>
            <Plus size={20} color="#FFF" />
            <TextX fontSize="lg" fontWeight="semibold">
              Create Habit
            </TextX>
          </TouchableX>
        </ViewX>
      </ScrollView>
    </ViewX>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF', // text-gray-400
  },
  section: {
    // backgroundColor: '#1F2937', // bg-gray-800
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#3E3F43',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: '#3E3F43',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  categoryButtonSelected: {
    backgroundColor: '#5C63F6',
  },
  categoryButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  categoryButtonTextSelected: {
    color: '#FFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,
    marginBottom: 16,
  },
  iconButton: {
    width: 48,
    height: 48,
    backgroundColor: '#3E3F43',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonSelected: {
    backgroundColor: '#6366F1',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: '#FFF',
  },
  scheduleTypeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  scheduleTypeButton: {
    flex: 1,
    backgroundColor: '#3E3F43',
    padding: styleUtils.spacing.xs,
    borderRadius: 8,
    alignItems: 'center',
  },
  scheduleTypeButtonSelected: {
    backgroundColor: '#6366F1',
  },
  scheduleTypeButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  scheduleTypeButtonTextSelected: {
    color: '#FFF',
  },
  scheduleContainer: {
    gap: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputLabel: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  timePickerButton: {
    backgroundColor: '#3E3F43',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  timePickerText: {
    color: '#FFF',
    fontSize: 14,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  dayButton: {
    backgroundColor: '#3E3F43',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dayButtonSelected: {
    backgroundColor: '#6366F1',
  },
  dayButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  dayButtonTextSelected: {
    color: '#FFF',
  },
  createButton: {
    backgroundColor: '#6366F1',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HabitCreationScreen;
