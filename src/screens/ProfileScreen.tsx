import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import type { BottomTabParamList } from '../navigation/BottomTabs';

type ProfileNavigationProp = BottomTabNavigationProp<
  BottomTabParamList,
  'Profile'
>;

export function ProfileScreen() {
  const navigation = useNavigation<ProfileNavigationProp>();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Profile Screen</Text>

      <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
    </View>
  );
}
