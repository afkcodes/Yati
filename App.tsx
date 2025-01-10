import {TextX, TouchableX, ViewX} from '~components';

const App = () => {
  return (
    <ViewX flex={1} justifyContent="center" alignItems="center">
      <TouchableX activeOpacity={0.8}>
        <TextX fontSize={32} fontWeight="bold" color="white">
          Yati
        </TextX>
      </TouchableX>
    </ViewX>
  );
};

export default App;
