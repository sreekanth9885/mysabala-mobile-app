import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import { persistor, store } from './src/store/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  useEffect(() => {
    const init = async () => {
      await BootSplash.hide({
        fade: true,
      });
    };

    init();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <PersistGate loading={null} persistor={persistor}>
          <RootNavigator />
        </PersistGate>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
