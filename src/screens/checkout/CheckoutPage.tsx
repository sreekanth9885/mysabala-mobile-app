import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootState } from '../../store/store';
import { useCheckout } from './hooks/useCheckout';
import EmptyCart from './components/EmptyCart';
import CheckoutHeader from './components/CheckoutHeader';
import DeliveryAddressForm from './components/DeliveryAddressForm';
import OrderSummary from './components/OrderSummary';
import CheckoutBottomBar from './components/CheckoutBottomBar';
import { RootStackParamList } from '../../navigation/RootNavigator';
export default function CheckoutPage() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const { address, setAddress, totals, isLoading, handlePayment } = useCheckout(
    cartItems,
    user,
  );
  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <EmptyCart onContinue={() => navigation.navigate('Main')} />
      </SafeAreaView>
    );
  }
  const onPayment = async () => {
    if (!isLoggedIn) {
      navigation.navigate('Login', {
        redirect: 'Checkout',
      });
      return;
    }
    const success = await handlePayment();
    if (success) {
      navigation.navigate('Main');
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <CheckoutHeader />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <DeliveryAddressForm value={address} onChange={setAddress} />
          <OrderSummary items={cartItems} totals={totals} />
        </ScrollView>
        <CheckoutBottomBar
          total={totals.grandTotal}
          loading={isLoading}
          onPay={onPayment}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
});
