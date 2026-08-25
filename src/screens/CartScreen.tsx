import React from 'react';
import { FlatList, Image, Text, View, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { addToCart, removeFromCart, deleteFromCart } from '../store/cartSlice';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
const IMAGE_BASE_URL = 'https://api.mysabala.com';

const CartScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalAmount = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  if (cartItems.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
          }}
        >
          Your Cart is Empty
        </Text>

        <Text
          style={{
            marginTop: 8,
            color: '#6B7280',
          }}
        >
          Add some products to your cart
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{
          padding: 16,
        }}
        renderItem={({ item }) => {
          const imageUrl = item.image
            ? `${IMAGE_BASE_URL}${item.image}`
            : undefined;

          return (
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
              }}
            >
              {imageUrl && (
                <Image
                  source={{ uri: imageUrl }}
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 10,
                  }}
                  resizeMode="cover"
                />
              )}

              <View
                style={{
                  flex: 1,
                  marginLeft: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                  }}
                >
                  {item.name}
                </Text>

                <Text
                  style={{
                    marginTop: 4,
                    color: '#6B7280',
                  }}
                >
                  ₹{item.price}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => dispatch(removeFromCart(item.id))}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: '#F3F4F6',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>−</Text>
                  </TouchableOpacity>

                  <Text
                    style={{
                      marginHorizontal: 16,
                      fontSize: 16,
                      fontWeight: '600',
                    }}
                  >
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => dispatch(addToCart(item))}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: '#F3F4F6',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => dispatch(deleteFromCart(item.id))}
              >
                <Text
                  style={{
                    color: '#EF4444',
                    fontWeight: '600',
                  }}
                >
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <View
        style={{
          padding: 16,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
            }}
          >
            Total
          </Text>

          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
            }}
          >
            ₹{totalAmount.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Checkout')}
          style={{
            height: 52,
            borderRadius: 14,
            backgroundColor: '#16A34A',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: '700',
            }}
          >
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;
