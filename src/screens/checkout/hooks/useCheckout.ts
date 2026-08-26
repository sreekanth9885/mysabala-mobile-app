import { useState } from 'react';
import { Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { useDispatch } from 'react-redux';
import {
  calculateCheckoutTotals,
  validateCheckoutAddress,
} from '../utils/checkout';
import { CheckoutAddress, CheckoutCartItem } from '../types/checkoutType';
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from '../../../store/checkoutApi';
import { clearCart } from '../../../store/cartSlice';

interface User {
  id?: number;
  name?: string;
  phone?: string;
}

export const useCheckout = (
  cartItems: CheckoutCartItem[],
  user?: User | null,
) => {
  const dispatch = useDispatch();

  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

  const [verifyPayment, { isLoading: isVerifying }] =
    useVerifyPaymentMutation();

  const [address, setAddress] = useState<CheckoutAddress>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    pincode: '',
  });

  const totals = calculateCheckoutTotals(cartItems);

  const isLoading = isCreating || isVerifying;

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty');

      return;
    }

    const validationError = validateCheckoutAddress(address);

    if (validationError) {
      Alert.alert('Invalid Details', validationError);

      return;
    }

    try {
      /*
       * STEP 1
       * Create Razorpay order
       */

      const razorpayOrder = await createOrder({
        grand_total: totals.grandTotal,
      }).unwrap();

      /*
       * STEP 2
       * Open Razorpay
       */

      const options = {
        key: razorpayOrder.key,

        amount: Math.round(razorpayOrder.amount * 100),

        currency: 'INR',

        name: 'MySabala',

        description: 'Food Order',

        order_id: razorpayOrder.razorpay_order_id,

        prefill: {
          name: address.fullName,
          contact: address.phone,
        },

        theme: {
          color: '#F7890B',
        },
      };

      const payment = await RazorpayCheckout.open(options);

      /*
       * STEP 3
       * Verify payment on backend
       */

      await verifyPayment({
        user_id: user?.id,

        customer_name: address.fullName,

        phone: address.phone,

        address: address.address,

        city: address.city,

        pincode: address.pincode,

        subtotal: totals.subtotal,

        delivery_fee: totals.deliveryFee,

        gst: totals.gst,

        grand_total: totals.grandTotal,

        cart_items: cartItems,

        razorpay_payment_id: payment.razorpay_payment_id,

        razorpay_order_id: payment.razorpay_order_id,

        razorpay_signature: payment.razorpay_signature,
      }).unwrap();

      /*
       * STEP 4
       * Clear cart only after successful
       * backend verification
       */

      dispatch(clearCart());
      Alert.alert('Success', 'Order placed successfully 🎉');
      return true;
    } catch (error: any) {
      console.log('CHECKOUT ERROR:', error);

      const message =
        error?.data?.message ||
        error?.message ||
        'Payment failed. Please try again.';

      Alert.alert('Payment Failed', message);

      return false;
    }
  };

  return {
    address,
    setAddress,

    totals,

    isLoading,

    handlePayment,
  };
};
