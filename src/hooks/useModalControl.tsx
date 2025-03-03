import {useCallback, useMemo} from 'react';
import {setModal} from '~components/common/Modal';

export const useModalControl = <P extends object>(
  ModalComponent: React.ComponentType<P>,
  props: P,
  {isOpen}: {isOpen: boolean},
) => {
  const modalContent = useMemo(
    () => <ModalComponent {...props} />,
    [ModalComponent, props],
  );

  const openModal = useCallback(() => {
    setModal({
      isOpen: isOpen,
      children: modalContent,
    });
  }, [isOpen, modalContent]);

  return openModal;
};

export const closeModal = () => {
  setModal({
    isOpen: false,
    children: null,
  });
};
