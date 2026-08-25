import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RazorpayCheckout from 'react-native-razorpay';
import { RootState } from '../store/store';
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from '../store/checkoutApi';
import { clearCart } from '../store/cartSlice';

const { width, height } = Dimensions.get('window');

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Cart
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // User
  const user = useSelector((state: RootState) => state.auth.user);

  // Form state
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  // API
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [verifyPayment, { isLoading: isVerifying }] =
    useVerifyPaymentMutation();

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const gst = subtotal * 0.05;
  const grandTotal = subtotal + deliveryFee + gst;

  // Payment handler
  const handlePayment = async () => {
    // Validation
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !pincode.trim()
    ) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (phone.trim().length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10‑digit phone number');
      return;
    }
    if (pincode.trim().length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6‑digit pincode');
      return;
    }
    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    try {
      // 1. Create order on server
      const order = await createOrder({
        grand_total: grandTotal,
      }).unwrap();

      // 2. Open Razorpay checkout
      const options = {
        key: order.key,
        amount: Math.round(order.amount * 100), // in paise
        currency: 'INR',
        name: 'MySabala',
        description: 'Food Order',
        order_id: order.razorpay_order_id,
        prefill: {
          name: fullName,
          contact: phone,
        },
        theme: { color: '#F7890B' },
      };

      RazorpayCheckout.open(options)
        .then(async (response: any) => {
          // 3. Verify payment
          try {
            await verifyPayment({
              user_id: user?.id,
              customer_name: fullName,
              phone,
              address,
              city,
              pincode,
              subtotal,
              delivery_fee: deliveryFee,
              gst,
              grand_total: grandTotal,
              cart_items: cartItems,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            dispatch(clearCart());
            Alert.alert('Success', 'Order placed successfully 🎉');
            navigation.navigate('Orders' as never);
          } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Payment verification failed');
          }
        })
        .catch((error: any) => {
          console.log(error);
          Alert.alert('Error', 'Payment cancelled or failed');
        });
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to create order');
    }
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some products before checking out.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('Home' as never)}
          >
            <Text style={styles.emptyButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main view
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Checkout</Text>
          <Text style={styles.headerSubtitle}>Complete your order</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Left Column: Delivery + Payment */}
          <View style={styles.leftColumn}>
            {/* Delivery Address */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Delivery Address</Text>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10‑digit mobile number"
                  value={phone}
                  onChangeText={text => setPhone(text.replace(/\D/g, ''))}
                  keyboardType="numeric"
                  maxLength={10}
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="House number, street, landmark…"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#9ca3af"
                  textAlignVertical="top"
                />
              </View>
              <View style={styles.row}>
                <View style={[styles.halfGroup, { marginRight: 8 }]}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="City"
                    value={city}
                    onChangeText={setCity}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                <View style={[styles.halfGroup, { marginLeft: 8 }]}>
                  <Text style={styles.label}>Pincode</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="6‑digit pincode"
                    value={pincode}
                    onChangeText={text => setPincode(text.replace(/\D/g, ''))}
                    keyboardType="numeric"
                    maxLength={6}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>
            </View>

            {/* Payment Method */}
            {/* <View style={styles.card}>
              <Text style={styles.cardTitle}>Payment Method</Text>
              <View style={styles.paymentMethod}>
                <View style={styles.paymentIcon}>
                  <Text style={styles.paymentIconText}>💳</Text>
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentName}>Razorpay</Text>
                  <Text style={styles.paymentDescription}>
                    UPI, Cards, Net Banking & more
                  </Text>
                </View>
                <View style={styles.paymentRadio}>
                  <View style={styles.paymentRadioInner} />
                </View>
              </View>
            </View> */}
          </View>

          {/* Right Column: Order Summary */}
          <View style={styles.rightColumn}>
            <View style={[styles.card, styles.summaryCard]}>
              <Text style={styles.summaryTitle}>Order Summary</Text>

              {/* Items */}
              <View style={styles.itemsContainer}>
                {cartItems.map(item => (
                  <View key={item.id} style={styles.itemRow}>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.itemQuantity}>
                        {item.quantity} × ₹{Number(item.price).toFixed(2)}
                      </Text>
                    </View>
                    <Text style={styles.itemPrice}>
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Totals */}
              <View style={styles.totalsContainer}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalValue}>₹{subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Delivery Fee</Text>
                  <Text
                    style={[
                      styles.totalValue,
                      deliveryFee === 0 && styles.freeDelivery,
                    ]}
                  >
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                  </Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>GST</Text>
                  <Text style={styles.totalValue}>₹{gst.toFixed(2)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={[styles.totalRow, styles.grandTotalRow]}>
                  <Text style={styles.grandTotalLabel}>Total</Text>
                  <Text style={styles.grandTotalValue}>
                    ₹{grandTotal.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Payment Bar (Mobile) */}
        <View style={styles.bottomBar}>
          <View style={styles.bottomBarContent}>
            <View>
              <Text style={styles.bottomTotalLabel}>Total Amount</Text>
              <Text style={styles.bottomTotal}>₹{grandTotal.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.payButton}
              onPress={handlePayment}
              disabled={isLoading || isVerifying}
            >
              <Text style={styles.payButtonText}>
                {isLoading || isVerifying
                  ? 'Processing…'
                  : `Pay ₹${grandTotal.toFixed(2)}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  leftColumn: {
    marginBottom: 16,
  },
  rightColumn: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfGroup: {
    flex: 1,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f97316',
    backgroundColor: '#fff7ed',
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentIconText: {
    fontSize: 20,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontWeight: '600',
    color: '#111827',
  },
  paymentDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  paymentRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f97316',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f97316',
  },
  summaryCard: {
    paddingBottom: 8,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemDetails: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalsContainer: {
    marginTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  freeDelivery: {
    fontWeight: '600',
    color: '#16a34a',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  grandTotalRow: {
    paddingTop: 4,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  grandTotalValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f97316',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  bottomTotalLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  bottomTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  payButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
  },
  payButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 20,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 24,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
