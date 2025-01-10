import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ThemeProvider} from '~hooks/ThemeContext';
import Onboarding from '~screens/onboarding/Onboarding';

const App = () => {
  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <Onboarding />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
