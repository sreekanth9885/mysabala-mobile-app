import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProfileScreen } from '../screens/ProfileScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import OrderTrackingScreen from '../screens/orders/OrderTrackingScreen';

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Orders: undefined;
  OrderTracking: {
    order: any;
  };
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />

      <Stack.Screen name="Orders" component={OrdersScreen} />

      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    </Stack.Navigator>
  );
}
