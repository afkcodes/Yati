/* eslint-disable react-native/no-inline-styles */
import type React from 'react';
import {useEffect, useMemo, useState} from 'react';
import {Dimensions, StyleSheet, View, type ViewStyle} from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface MasonryGridProps {
  data: any[];
  renderItem: (item: any) => React.ReactNode;
  numColumns?: number;
  containerStyle?: ViewStyle;
  scrollDuration?: number;
  columnGap?: number;
  itemGap?: number;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({
  data,
  renderItem,
  numColumns = 2,
  containerStyle,
  scrollDuration = 50000,
  columnGap = 8,
  itemGap = 8,
}) => {
  const [columns, setColumns] = useState<any[][]>(
    Array.from({length: numColumns}, () => []),
  );
  const [contentHeight, setContentHeight] = useState(0);
  const scrollY = useSharedValue(0);
  const isResetNeeded = useSharedValue(false);

  // Memoize the distribution of items into columns
  const distributeItems = useMemo(() => {
    const columnData: any[][] = Array.from({length: numColumns}, () => []);
    const heights: number[] = Array.from({length: numColumns}, () => 0);

    const tripleData = [...data, ...data, ...data];
    tripleData.forEach((item, index) => {
      const shortestColumnIndex = heights.indexOf(Math.min(...heights));
      columnData[shortestColumnIndex].push({
        ...item,
        uniqueKey: `${item.id}-${index}-${shortestColumnIndex}`,
      });

      heights[shortestColumnIndex] += 100; // Adjust this height calculation as needed
    });

    setContentHeight(Math.max(...heights));
    return columnData;
  }, [data, numColumns]);

  useEffect(() => {
    setColumns(distributeItems);
  }, [distributeItems]);

  // Animate scrolling
  useEffect(() => {
    if (contentHeight > 0) {
      // Reset animation
      cancelAnimation(scrollY);
      scrollY.value = 0;

      // Start animation
      scrollY.value = withRepeat(
        withTiming(-contentHeight / 3, {
          duration: scrollDuration,
          easing: Easing.linear,
        }),
        -1, // Infinite loop
        false,
      );
    }
  }, [contentHeight, scrollDuration, scrollY]);

  // Reset scroll position when it reaches the end
  useAnimatedReaction(
    () => scrollY.value < -contentHeight / 3,
    shouldReset => {
      if (shouldReset) {
        isResetNeeded.value = true;
      }
    },
    [contentHeight],
  );

  const animatedStyle = useAnimatedStyle(() => {
    if (isResetNeeded.value) {
      scrollY.value = scrollY.value + contentHeight / 3;
      isResetNeeded.value = false;
    }
    return {
      transform: [{translateY: scrollY.value}],
    };
  });

  const onLayout = (event: {nativeEvent: {layout: {height: number}}}) => {
    const {height} = event.nativeEvent.layout;
    setContentHeight(height);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[styles.masonryContainer, animatedStyle]}
        onLayout={onLayout}>
        {columns.map((column, columnIndex) => (
          <View
            key={`column-${columnIndex}`}
            style={[
              styles.column,
              {
                width: SCREEN_WIDTH / numColumns - columnGap,
                marginRight: columnIndex < numColumns - 1 ? columnGap : 0,
              },
            ]}>
            {column.map((item: any) => (
              <View key={item.uniqueKey} style={{marginBottom: itemGap}}>
                {renderItem(item)}
              </View>
            ))}
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  masonryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH,
  },
  column: {
    flexDirection: 'column',
  },
});

export default MasonryGrid;
