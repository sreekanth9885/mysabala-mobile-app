import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  ShoppingBag,
  PackageCheck,
  ChefHat,
  Bike,
  CheckCircle2,
  XCircle,
  MapPin,
  ArrowLeft,
} from 'lucide-react-native';

const ORANGE = '#F7890B';

interface OrderItem {
  id: number;
  food_name: string;
  quantity: number;
  price: string;
  total: string;
}

interface Order {
  id: number;
  customer_name: string;
  order_status: string;
  grand_total: string;
  created_at: string;
  address: string;
  city: string;
  pincode: string;
  payment_method?: string;
  items: OrderItem[];
}

interface Props {
  route: {
    params: {
      order: Order;
    };
  };
  navigation: any;
}

const STAGES = [
  {
    key: 'placed',
    label: 'Order Placed',
    icon: ShoppingBag,
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    icon: PackageCheck,
  },
  {
    key: 'preparing',
    label: 'Preparing',
    icon: ChefHat,
  },
  {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    icon: Bike,
  },
  {
    key: 'delivered',
    label: 'Delivered',
    icon: CheckCircle2,
  },
];

export default function OrderTrackingScreen({ route, navigation }: Props) {
  const { order } = route.params;

  const isCancelled = order.order_status === 'cancelled';

  const currentIndex = STAGES.findIndex(
    stage => stage.key === order.order_status,
  );

  const progressPercent =
    isCancelled || currentIndex <= 0
      ? 0
      : (currentIndex / (STAGES.length - 1)) * 80;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const mapUrl =
    `https://www.google.com/maps/search/?api=1&query=` +
    encodeURIComponent(`${order.address}, ${order.city}, ${order.pincode}`);

  const openGoogleMaps = async () => {
    try {
      await Linking.openURL(mapUrl);
    } catch (error) {
      console.log('Unable to open Google Maps:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>Track Order</Text>

          <Text style={styles.subtitle}>
            Order #{order.id} • {formatDate(order.created_at)}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* CANCELLED */}
        {isCancelled ? (
          <View style={styles.cancelledContainer}>
            <View style={styles.cancelledIcon}>
              <XCircle size={40} color="#EF4444" />
            </View>

            <Text style={styles.cancelledTitle}>Order Cancelled</Text>

            <Text style={styles.cancelledText}>
              This order has been cancelled. Contact support if you need help.
            </Text>
          </View>
        ) : (
          /* ORDER TRACKING */
          <View style={styles.trackingCard}>
            <Text style={styles.sectionTitle}>Order Status</Text>

            <View style={styles.tracker}>
              {/* BACKGROUND LINE */}
              <View style={styles.progressBackground} />

              {/* ORANGE PROGRESS */}
              {currentIndex >= 0 && (
                <View
                  style={[
                    styles.progressActive,
                    {
                      width: `${progressPercent}%`,
                    },
                  ]}
                />
              )}

              {/* STAGES */}
              <View style={styles.stagesContainer}>
                {STAGES.map((stage, index) => {
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;

                  const Icon = stage.icon;

                  return (
                    <View key={stage.key} style={styles.stage}>
                      {/* ICON */}
                      <View
                        style={[
                          styles.iconCircle,
                          isCompleted
                            ? styles.iconCompleted
                            : styles.iconPending,
                          isCurrent && styles.iconCurrent,
                        ]}
                      >
                        <Icon
                          size={20}
                          color={isCompleted ? '#FFFFFF' : '#9CA3AF'}
                        />
                      </View>

                      {/* LABEL */}
                      <Text
                        style={[
                          styles.stageLabel,
                          isCompleted
                            ? styles.stageCompleted
                            : styles.stagePending,
                          isCurrent && styles.stageCurrent,
                        ]}
                      >
                        {stage.label}
                      </Text>

                      {/* CURRENT DOT */}
                      {isCurrent && <View style={styles.currentDot} />}
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* ORDER ITEMS */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Items in this order</Text>

          {order.items?.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.food_name}
                </Text>

                <Text style={styles.itemQuantity}>× {item.quantity}</Text>
              </View>

              <Text style={styles.itemPrice}>
                ₹{Number(item.total).toFixed(2)}
              </Text>
            </View>
          ))}

          {/* TOTAL */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>

            <Text style={styles.total}>
              ₹{Number(order.grand_total).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* DELIVERY ADDRESS */}
        <View style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <View style={styles.mapIcon}>
              <MapPin size={20} color={ORANGE} />
            </View>

            <View style={styles.addressTextContainer}>
              <Text style={styles.addressTitle}>Delivery Address</Text>

              <Text style={styles.addressText}>
                {order.address}, {order.city} - {order.pincode}
              </Text>
            </View>
          </View>

          {/* OPEN GOOGLE MAPS */}
          <TouchableOpacity
            style={styles.mapButton}
            onPress={openGoogleMaps}
            activeOpacity={0.8}
          >
            <MapPin size={18} color="#FFFFFF" />

            <Text style={styles.mapButtonText}>
              Open Location in Google Maps
            </Text>
          </TouchableOpacity>
        </View>

        {/* PAYMENT */}
        {order.payment_method && (
          <View style={styles.paymentCard}>
            <Text style={styles.paymentLabel}>Payment Method</Text>

            <Text style={styles.paymentValue}>{order.payment_method}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 21,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    marginTop: 3,
    fontSize: 12,
    color: '#6B7280',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  trackingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 18,
  },

  tracker: {
    height: 130,
    position: 'relative',
  },

  progressBackground: {
    position: 'absolute',
    top: 23,
    left: '10%',
    right: '10%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
  },

  progressActive: {
    position: 'absolute',
    top: 23,
    left: '10%',
    height: 4,
    backgroundColor: ORANGE,
    borderRadius: 10,
  },

  stagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  stage: {
    flex: 1,
    alignItems: 'center',
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  iconCompleted: {
    backgroundColor: ORANGE,
  },

  iconPending: {
    backgroundColor: '#F3F4F6',
  },

  iconCurrent: {
    transform: [{ scale: 1.08 }],
    borderWidth: 4,
    borderColor: '#FFF1DF',
  },

  stageLabel: {
    marginTop: 9,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 13,
    maxWidth: 65,
  },

  stageCompleted: {
    color: '#EA6F00',
    fontWeight: '600',
  },

  stagePending: {
    color: '#9CA3AF',
    fontWeight: '500',
  },

  stageCurrent: {
    fontWeight: '800',
  },

  currentDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: ORANGE,
    marginTop: 5,
  },

  cancelledContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },

  cancelledIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  cancelledTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#DC2626',
  },

  cancelledText: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 19,
    color: '#6B7280',
    textAlign: 'center',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  itemInfo: {
    flex: 1,
    marginRight: 15,
  },

  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  itemQuantity: {
    marginTop: 3,
    fontSize: 12,
    color: '#9CA3AF',
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  total: {
    fontSize: 19,
    fontWeight: '800',
    color: ORANGE,
  },

  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  addressHeader: {
    flexDirection: 'row',
  },

  mapIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  addressTextContainer: {
    flex: 1,
  },

  addressTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  addressText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: '#6B7280',
  },

  mapButton: {
    marginTop: 15,
    height: 48,
    borderRadius: 12,
    backgroundColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  paymentLabel: {
    fontSize: 13,
    color: '#6B7280',
  },

  paymentValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    textTransform: 'capitalize',
  },
});
