import {
  CheckoutAddress,
  CheckoutCartItem,
  CheckoutTotals,
} from '../types/checkoutType';

export const calculateCheckoutTotals = (
  cartItems: CheckoutCartItem[],
): CheckoutTotals => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );

  const deliveryFee = subtotal > 500 ? 0 : 40;

  const gst = subtotal * 0.05;

  const grandTotal = subtotal + deliveryFee + gst;

  return {
    subtotal,
    deliveryFee,
    gst,
    grandTotal,
  };
};

export const validateCheckoutAddress = (
  address: CheckoutAddress,
): string | null => {
  if (!address.fullName.trim()) {
    return 'Please enter your full name';
  }

  if (!address.phone.trim()) {
    return 'Please enter your phone number';
  }

  if (address.phone.length !== 10) {
    return 'Please enter a valid 10-digit phone number';
  }

  if (!address.address.trim()) {
    return 'Please enter your address';
  }

  if (!address.city.trim()) {
    return 'Please enter your city';
  }

  if (!address.pincode.trim()) {
    return 'Please enter your pincode';
  }

  if (address.pincode.length !== 6) {
    return 'Please enter a valid 6-digit pincode';
  }

  return null;
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};
