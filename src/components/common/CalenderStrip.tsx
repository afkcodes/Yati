import {LegendList} from '@legendapp/list';
import {
  addDays,
  differenceInDays,
  format,
  isSameDay,
  isWithinInterval,
} from 'date-fns';
import React, {useCallback, useMemo, useRef} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {themes} from '~styles/theme';
import {s} from '~utils/screenUtil';
import TextX from './TextX';
import TouchableX from './TouchableX';

interface DateItem {
  date: Date;
  dayName: string;
  dayNumber: string;
  isToday: boolean;
  isDisabled: boolean;
}

interface CalendarStripProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
  startDate: Date;
  endDate: Date;
  style?: object;
}

const ITEM_WIDTH = 50;
const ITEM_MARGIN = 4;
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + ITEM_MARGIN * 2;
const SCREEN_WIDTH = Dimensions.get('window').width;
// const VISIBLE_ITEMS = 7;
// const TOTAL_LIST_WIDTH = VISIBLE_ITEMS * (ITEM_WIDTH + ITEM_MARGIN * 2);
// const CENTER_PADDING = (SCREEN_WIDTH - TOTAL_LIST_WIDTH) / 2;

const generateDateList = (start: Date, end: Date): DateItem[] => {
  const today = new Date();
  const daysCount = differenceInDays(end, start) + 1;

  return Array.from({length: daysCount}, (_, index) => {
    const date = addDays(start, index);
    return {
      date,
      dayName: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
      isToday: isSameDay(date, today),
      isDisabled: !isWithinInterval(date, {start, end}),
    };
  });
};

export const CalendarStrip: React.FC<CalendarStripProps> = ({
  onDateSelect,
  selectedDate,
  startDate,
  endDate,
  style,
}) => {
  const listRef = useRef<any>(null);
  const dateList = useMemo(
    () => generateDateList(startDate, endDate),
    [startDate, endDate],
  );

  // const todayIndex = useMemo(
  //   () => Math.max(0, dateList.findIndex(item => item.isToday) - 3),
  //   [dateList],
  // );

  const renderItem = useCallback(
    ({item}: {item: DateItem}) => {
      const isSelected = isSameDay(item.date, selectedDate);
      return (
        <TouchableX
          onPress={() => !item.isDisabled && onDateSelect(item.date)}
          disabled={item.isDisabled}
          style={[
            styles.dateItem,
            isSelected && styles.selectedItem,
            item.isToday && styles.todayItem,
            item.isDisabled && styles.disabledItem,
          ]}>
          <TextX
            style={[
              styles.dayName,
              isSelected && styles.selectedText,
              item.isDisabled && styles.disabledText,
            ]}>
            {item.dayName}
          </TextX>
          <TextX
            style={[
              styles.dayNumber,
              isSelected && styles.selectedText,
              item.isDisabled && styles.disabledText,
            ]}>
            {item.dayNumber}
          </TextX>
        </TouchableX>
      );
    },
    [selectedDate, onDateSelect],
  );

  return (
    <View style={[styles.container, style]}>
      <LegendList
        ref={listRef}
        data={dateList}
        renderItem={renderItem}
        keyExtractor={item => item.date.toISOString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={TOTAL_ITEM_WIDTH}
        initialScrollIndex={dateList.length}
        contentContainerStyle={{
          paddingHorizontal: s(4),
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 55,
    width: SCREEN_WIDTH,
  },
  dateItem: {
    width: ITEM_WIDTH,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: ITEM_MARGIN,
    borderRadius: 10,
    backgroundColor: themes.dark.background.tertiary,
  },
  selectedItem: {
    backgroundColor: themes.dark.background.secondary,
    borderWidth: 1,
    borderColor: themes.dark.text.accent,
  },
  todayItem: {
    backgroundColor: themes.dark.background.accent,
    borderColor: themes.dark.background.accent,
  },
  disabledItem: {
    backgroundColor: '#e0e0e0',
    opacity: 0.6,
  },
  dayName: {
    fontSize: 14,
    marginBottom: 4,
    color: '#fff',
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '600',
  },
  selectedText: {
    color: themes.dark.text.primary,
  },
  disabledText: {
    color: '#999',
  },
});
