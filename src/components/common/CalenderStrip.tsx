/* eslint-disable react-native/no-inline-styles */
import {LegendList} from '@legendapp/list';
import {format, startOfDay, subDays} from 'date-fns';
import React, {Fragment, useMemo, useRef} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useTheme} from '~hooks/ThemeContext';
import {getThemeColor} from '~styles/theme';
import {getLocalToday, isSameLocalDay} from '~utils/date/dateUtils';
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
  const today = getLocalToday(); // Use our consistent utility
  const dateList: DateItem[] = [];

  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = startOfDay(subDays(today, i)); // Ensure date is normalized
    dateList.push({
      date,
      dayName: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
      isToday: isSameLocalDay(date, today), // Use our consistent comparison
      isDisabled: false,
    });
  }

  return dateList;
};

const CalendarStrip: React.FC<CalendarStripProps> = ({
  onDateSelect,
  selectedDate,
  daysToShow = 30,
  style,
}) => {
  const listRef = useRef<any>(null);
  const {theme} = useTheme();

  const normalizedSelectedDate = useMemo(
    () => (selectedDate ? startOfDay(selectedDate) : getLocalToday()),
    [selectedDate],
  );

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
    const isSelected = isSameLocalDay(item.date, normalizedSelectedDate);

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

  console.log('rendering Calendar Strip');

  return (
    <View style={[styles.container, {backgroundColor}, style]}>
      <Fragment>
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
          extraData={selectedDate}
        />
      </Fragment>
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

export default React.memo(CalendarStrip);
