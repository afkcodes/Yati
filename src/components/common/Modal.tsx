/* eslint-disable react-native/no-inline-styles */
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {Fragment, useCallback, useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {SpringConfig} from 'react-native-reanimated/lib/typescript/animation/springUtils';
import {themes} from '~styles/theme';
import {create} from '~utils/store/createStore';

const springAnimationConfig: SpringConfig = {
  damping: 45,
  stiffness: 650,
  mass: 0.9,
  overshootClamping: false,
  restSpeedThreshold: 0.3,
  restDisplacementThreshold: 0.3,
};

const {
  useStore: useModalStore,
  set: setModal,
  subscribe: subscribeModalState,
} = create('MODAL', {isOpen: false, children: null} as {
  isOpen: boolean;
  children: React.ReactNode | null;
});

interface AnimatedModalProps {
  handleModalChanges?: (state: {isOpen: boolean; index: number}) => void;
}

const AnimatedModal: React.FC<AnimatedModalProps> = ({handleModalChanges}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [modalState] = useModalStore();

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        setModal({isOpen: false, children: null});
      }
      if (handleModalChanges) {
        handleModalChanges({isOpen: modalState.isOpen, index});
      }
    },
    [handleModalChanges, modalState],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="none"
        opacity={0.5}
      />
    ),
    [],
  );

  useEffect(() => {
    if (modalState.isOpen && modalState.children) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
      setModal({isOpen: false, children: null});
    }
  }, [modalState]);

  return (
    <Fragment>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        animationConfigs={springAnimationConfig}
        handleIndicatorStyle={{
          backgroundColor: themes.dark.background.surface,
        }}
        backgroundStyle={{backgroundColor: '#1C1C1E'}}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}>
        <BottomSheetView style={styles.contentContainer}>
          {modalState.children}
        </BottomSheetView>
      </BottomSheetModal>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    zIndex: 999,
  },
});

export default AnimatedModal;
export {setModal, subscribeModalState, useModalStore};
