import React, { useEffect } from 'react';

import { Provider } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';

import BootSplash from 'react-native-bootsplash';

import { store } from './src/store/store';
import { RootNavigator } from './src/navigation/RootNavigator';

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
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
