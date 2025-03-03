/* eslint-disable react-native/no-inline-styles */
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
import {useTheme} from '~hooks/ThemeContext';
import {getThemeColor} from '~styles/theme';
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
  const {theme} = useTheme();
  const dateList = useMemo(
    () => generateDateList(startDate, endDate),
    [startDate, endDate],
  );

  // Get theme colors
  const backgroundColor = getThemeColor(theme, 'background', 'primary');
  const dateItemBg = getThemeColor(theme, 'background', 'secondary');
  const todayBg = getThemeColor(theme, 'background', 'accent');
  const disabledBg = getThemeColor(theme, 'background', 'highlight');
  const accentColor = getThemeColor(theme, 'background', 'accent');
  const disabledTextColor = getThemeColor(theme, 'text', 'disabled');

  const renderItem = useCallback(
    ({item}: {item: DateItem}) => {
      const isSelected = isSameDay(item.date, selectedDate);
      return (
        <TouchableX
          onPress={() => !item.isDisabled && onDateSelect(item.date)}
          disabled={item.isDisabled}
          style={[
            styles.dateItem,
            {backgroundColor: dateItemBg},
            isSelected && {
              backgroundColor: dateItemBg,
              borderWidth: 1,
              borderColor: accentColor,
            },
            item.isToday && {backgroundColor: todayBg},
            item.isDisabled && {backgroundColor: disabledBg, opacity: 0.6},
          ]}>
          <TextX
            style={[
              styles.dayName,
              isSelected && styles.selectedText,
              item.isDisabled && {color: disabledTextColor},
            ]}>
            {item.dayName}
          </TextX>
          <TextX
            style={[
              styles.dayNumber,
              isSelected && styles.selectedText,
              item.isDisabled && {color: disabledTextColor},
            ]}>
            {item.dayNumber}
          </TextX>
        </TouchableX>
      );
    },
    [
      selectedDate,
      onDateSelect,
      dateItemBg,
      todayBg,
      disabledBg,
      accentColor,
      disabledTextColor,
    ],
  );

  return (
    <View style={[styles.container, {backgroundColor}, style]}>
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
  },
  dayName: {
    fontSize: 14,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '600',
  },
  selectedText: {},
});
