import {ViewX} from '~components/common';
import ImprovedHabitCreationScreen from './HabitCreationScreen';

const CreateHabitScreen: React.FC = () => {
  return (
    <ViewX flex={1} variant="base" zIndex={10}>
      <ImprovedHabitCreationScreen />
    </ViewX>
  );
};

export default CreateHabitScreen;
