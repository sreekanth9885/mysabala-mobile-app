import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useGetProductsQuery } from '../store/api';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../store/cartSlice';
import type { RootState } from '../store/store';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { BottomTabParamList } from '../navigation/BottomTabs';
const IMAGE_BASE_URL = 'https://api.mysabala.com';
const HomeScreen = () => {
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const dispatch = useDispatch();
  const navigation =
    useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F7890B" />
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unable to load products</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Products</Text>
          <Text style={styles.subtitle}>Fresh products for you</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Cart')}
          style={({ pressed }) => [
            styles.cartButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => {
          const imageUrl = item.image
            ? `${IMAGE_BASE_URL}${item.image}`
            : undefined;
          const cartItem = cartItems.find(cart => cart.id === item.id);
          return (
            <View style={styles.card}>
              <View style={styles.imageContainer}>
                {imageUrl ? (
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.noImage}>
                    <Text style={styles.noImageText}>No Image</Text>
                  </View>
                )}
              </View>
              <View style={styles.details}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.category} numberOfLines={1}>
                  {item.category_name}
                </Text>
                <Text style={styles.price}>
                  ₹{Number(item.price).toFixed(2)}
                </Text>
                {cartItem ? (
                  <View style={styles.quantityContainer}>
                    {/* Minus */}
                    <Pressable
                      onPress={() => dispatch(removeFromCart(item.id))}
                      style={({ pressed }) => [
                        styles.quantityButton,
                        pressed && styles.quantityButtonPressed,
                      ]}
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </Pressable>
                    <View style={styles.quantityValue}>
                      <Text style={styles.quantityText}>
                        {cartItem.quantity}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => dispatch(addToCart(item))}
                      style={({ pressed }) => [
                        styles.quantityButton,
                        pressed && styles.quantityButtonPressed,
                      ]}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => {
                      dispatch(addToCart(item));
                      navigation.navigate('Cart');
                    }}
                    style={({ pressed }) => [
                      styles.addButton,
                      pressed && styles.addButtonPressed,
                    ]}
                  >
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: '#6B7280',
  },
  cartButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: {
    fontSize: 22,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#F7890B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  list: {
    padding: 12,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 145,
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  details: {
    padding: 10,
  },
  productName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: '#111827',
    minHeight: 40,
  },
  category: {
    marginTop: 4,
    fontSize: 12,
    color: '#9CA3AF',
  },
  price: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    height: 40,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#F7890B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonPressed: {
    opacity: 0.75,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  quantityContainer: {
    height: 40,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  quantityButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0DB',
  },
  quantityButtonPressed: {
    backgroundColor: '#FED7AA',
  },
  quantityButtonText: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '600',
    color: '#C2410C',
  },
  quantityValue: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  pressed: {
    opacity: 0.7,
  },
});
export default HomeScreen;
