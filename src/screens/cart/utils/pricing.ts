export const calculateCartTotals = (items: any[]) => {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );
  const deliveryFee = subtotal > 500 ? 0 : 0;
  const gst = subtotal * 0.0;
  const grandTotal = subtotal + deliveryFee + gst;
  return {
    subtotal,
    deliveryFee,
    gst,
    grandTotal,
  };
};
