import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import { BottomTabs } from './BottomTabs';
import CheckoutPage from '../screens/checkout/CheckoutPage';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
export type RootStackParamList = {
  Welcome: undefined;

  Login: {
    redirect?: 'Checkout' | 'Cart' | 'Register';
  };

  Register: undefined;

  Main: {
    screen?: 'Home' | 'Categories' | 'Cart' | 'Profile';
  };

  Checkout: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();
const ONBOARDING_COMPLETED = '@mysabala_onboarding_completed';
export function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  useEffect(() => {
    checkOnboarding();
  }, []);
  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED);
      setHasCompletedOnboarding(value === 'true');
    } catch (error) {
      console.error('Unable to check onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <ActivityIndicator size="large" color="#F7890B" />
      </View>
    );
  }
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={hasCompletedOnboarding ? 'Main' : 'Welcome'}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Main" component={BottomTabs} />
      <Stack.Screen name="Checkout" component={CheckoutPage} />
    </Stack.Navigator>
  );
}
