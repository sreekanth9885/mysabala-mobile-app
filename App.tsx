import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import { BottomTabs } from './src/navigation/BottomTabs';
import { store } from './src/store/store';

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
