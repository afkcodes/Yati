import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useCallback, useMemo, useRef} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {TextX, TouchableX, ViewX} from '~components/common';

const BottomSheetSlider = () => {
  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    [],
  );
  const snapPoints = useMemo(() => ['90%'], []);

  // callbacks
  const handleSheetChange = useCallback(index => {
    console.log('handleSheetChange', index);
  }, []);
  const handleSnapPress = useCallback(index => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  // render
  const renderItem = useCallback(
    item => (
      <View key={item} style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    [],
  );
  return (
    <>
      <ViewX flex={1} paddingTop={40} justifyContent="center">
        <Button title="Snap To 90%" onPress={() => handleSnapPress(0)} />
        <Button title="Close" onPress={() => handleClosePress()} />
      </ViewX>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        index={-1}
        enableDynamicSizing={false}
        onChange={handleSheetChange}>
        <ViewX
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          padding={16}
          borderBottomWidth={1}
          borderBottomColor="#2C2C2E">
          <TextX fontSize="lg" fontWeight="semibold">
            Track Progress
          </TextX>
          <TouchableX padding={8} onPress={() => sheetRef.current?.close()}>
            <TextX fontSize="lg" fontWeight="semibold" color="accent">
              Done
            </TextX>
          </TouchableX>
        </ViewX>
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          {data.map(renderItem)}
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'white',
    bottom: 0,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
  },
});

export default BottomSheetSlider;
