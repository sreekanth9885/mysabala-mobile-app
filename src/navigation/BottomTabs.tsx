import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Grid2X2, ShoppingCart, User } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import HomeScreen from '../screens/HomeScreen';
import Categories from '../screens/Categories';
import CartScreen from '../screens/cart/CartScreen';
import type { RootState } from '../store/store';
import { TouchableOpacity } from 'react-native';
import { ProfileStack } from './ProfileStack';
export type BottomTabParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Profile: undefined;
};
const Tab = createBottomTabNavigator<BottomTabParamList>();
export function BottomTabs() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#f7890b',
        tabBarInactiveTintColor: '#6B7280',
        tabBarButton: props => (
          <TouchableOpacity {...props} activeOpacity={1} />
        ),
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Home size={size} color={color} />;
          }
          if (route.name === 'Categories') {
            return <Grid2X2 size={size} color={color} />;
          }
          if (route.name === 'Cart') {
            return (
              <>
                <ShoppingCart size={size} color={color} />
              </>
            );
          }
          return <User size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={Categories} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            fontSize: 10,
          },
        }}
      />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
