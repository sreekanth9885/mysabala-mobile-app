import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useGetOrdersByUserQuery } from '../../store/ordersApi';
const ORANGE = '#F7890B';
export default function OrdersScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const {
    data: orders = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetOrdersByUserQuery(user?.id ?? 0, {
    skip: !user?.id,
  });
  if (!user?.id) {
    return (
      <View style={styles.center}>
        <Text style={styles.icon}>🔐</Text>
        <Text style={styles.emptyTitle}>Please Login</Text>
        <Text style={styles.emptyText}>Login to view your orders.</Text>
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={ORANGE} />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.emptyTitle}>Failed to Load Orders</Text>
        <Text style={styles.emptyText}>Please try again.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>Track your orders</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => {
              refetch();
            }}
            colors={[ORANGE]}
          />
        }
      >
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptyText}>
              You haven't placed any orders yet.
            </Text>
          </View>
        ) : (
          orders.map((order: any) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>Order #{order.id}</Text>
                  <Text style={styles.date}>
                    {formatDate(order.created_at)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    getStatusStyle(order.order_status),
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      getStatusTextStyle(order.order_status),
                    ]}
                  >
                    {formatStatus(order.order_status)}
                  </Text>
                </View>
              </View>
              <View style={styles.itemsContainer}>
                {order.items?.map((item: any) => (
                  <View key={item.id} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.food_name}
                      </Text>
                      <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                    </View>
                    <Text style={styles.itemPrice}>
                      ₹{Number(item.total).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.addressContainer}>
                <Text style={styles.address}>
                  📍 {order.address}, {order.city} - {order.pincode}
                </Text>
              </View>
              <View style={styles.footer}>
                <Text style={styles.payment}>
                  Payment: {order.payment_method}
                </Text>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.total}>
                    ₹{Number(order.grand_total).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}
function getStatusStyle(status: string) {
  switch (status) {
    case 'placed':
      return styles.statusPlaced;
    case 'confirmed':
      return styles.statusConfirmed;
    case 'preparing':
      return styles.statusPreparing;
    case 'out_for_delivery':
      return styles.statusDelivery;
    case 'delivered':
      return styles.statusDelivered;
    case 'cancelled':
      return styles.statusCancelled;
    default:
      return styles.statusDefault;
  }
}
function getStatusTextStyle(status: string) {
  switch (status) {
    case 'placed':
      return styles.statusPlacedText;
    case 'confirmed':
      return styles.statusConfirmedText;
    case 'preparing':
      return styles.statusPreparingText;
    case 'out_for_delivery':
      return styles.statusDeliveryText;
    case 'delivered':
      return styles.statusDeliveredText;
    case 'cancelled':
      return styles.statusCancelledText;
    default:
      return styles.statusDefaultText;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  date: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusPlaced: {
    backgroundColor: '#FFF3E5',
  },
  statusPlacedText: {
    color: '#C65F00',
  },
  statusConfirmed: {
    backgroundColor: '#E8F1FF',
  },
  statusConfirmedText: {
    color: '#2563EB',
  },
  statusPreparing: {
    backgroundColor: '#FEF3C7',
  },
  statusPreparingText: {
    color: '#B45309',
  },
  statusDelivery: {
    backgroundColor: '#F3E8FF',
  },
  statusDeliveryText: {
    color: '#7C3AED',
  },
  statusDelivered: {
    backgroundColor: '#DCFCE7',
  },
  statusDeliveredText: {
    color: '#15803D',
  },
  statusCancelled: {
    backgroundColor: '#FEE2E2',
  },
  statusCancelledText: {
    color: '#DC2626',
  },
  statusDefault: {
    backgroundColor: '#F3F4F6',
  },
  statusDefaultText: {
    color: '#374151',
  },
  itemsContainer: {
    paddingHorizontal: 15,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    color: '#111827',
  },
  itemQty: {
    marginTop: 3,
    fontSize: 12,
    color: '#6B7280',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  addressContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  address: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6B7280',
  },
  footer: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payment: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  total: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: '800',
    color: ORANGE,
  },
  center: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 40,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 55,
    marginBottom: 12,
  },
  icon: {
    fontSize: 45,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
  },
  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
