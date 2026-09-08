import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Grid2X2, ShoppingCart, User } from 'lucide-react-native';
import HomeScreen from '../screens/HomeScreen';
import Categories from '../screens/Categories';
import { ProfileScreen } from '../screens/ProfileScreen';
import CartScreen from '../screens/cart/CartScreen';

export type BottomTabParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: true,

        tabBarActiveTintColor: '#f7890b',
        tabBarInactiveTintColor: '#6B7280',

        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Home size={size} color={color} />;
          }

          if (route.name === 'Categories') {
            return <Grid2X2 size={size} color={color} />;
          }

          if (route.name === 'Cart') {
            return <ShoppingCart size={size} color={color} />;
          }

          return <User size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen name="Categories" component={Categories} />

      <Tab.Screen name="Cart" component={CartScreen} />

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
