/* eslint-disable react-native/no-inline-styles */
import {LegendList} from '@legendapp/list';
import {format, isSameDay, subDays} from 'date-fns';
import React, {useMemo, useRef} from 'react';
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
  daysToShow?: number;
  style?: object;
}

const ITEM_WIDTH = 50;
const ITEM_MARGIN = 4;
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + ITEM_MARGIN * 2;
const SCREEN_WIDTH = Dimensions.get('window').width;

const generateDateList = (daysToShow: number): DateItem[] => {
  const today = new Date();
  const dateList: DateItem[] = [];

  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = subDays(today, i);
    dateList.push({
      date,
      dayName: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
      isToday: isSameDay(date, today),
      isDisabled: false,
    });
  }

  return dateList;
};

export const CalendarStrip: React.FC<CalendarStripProps> = ({
  onDateSelect,
  selectedDate,
  daysToShow = 30,
  style,
}) => {
  const listRef = useRef<any>(null);
  const {theme} = useTheme();

  // Generate list of dates ending with today
  const dateList = useMemo(() => generateDateList(daysToShow), [daysToShow]);

  // Get theme colors
  const backgroundColor = getThemeColor(theme, 'background', 'surface');
  const dateItemBg = getThemeColor(theme, 'background', 'secondary');
  const todayBg = getThemeColor(theme, 'background', 'accent');
  const disabledBg = getThemeColor(theme, 'background', 'highlight');
  const accentColor = getThemeColor(theme, 'background', 'accent');
  const disabledTextColor = getThemeColor(theme, 'text', 'disabled');

  const renderItem = ({item}: {item: DateItem}) => {
    const isSelected = isSameDay(item.date, selectedDate);

    return (
      <TouchableX
        onPress={() => {
          console.log('Selected date:', item.date.toISOString());
          onDateSelect(item.date);
        }}
        disabled={item.isDisabled}
        style={[
          styles.dateItem,
          {backgroundColor: dateItemBg},
          isSelected && {
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
  };

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
        initialScrollIndex={
          dateList.length - Math.floor(SCREEN_WIDTH / TOTAL_ITEM_WIDTH)
        }
        contentContainerStyle={{
          paddingHorizontal: s(4),
        }}
        key={selectedDate.toISOString()}
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
