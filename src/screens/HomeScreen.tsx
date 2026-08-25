import React from 'react';

import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';

import { useGetProductsQuery } from '../store/api';

const IMAGE_BASE_URL = 'https://api.mysabala.com';

const HomeScreen = () => {
  const { data: products, isLoading, isError } = useGetProductsQuery();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>Unable to load products</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: '700',
          margin: 16,
        }}
      >
        Products
      </Text>

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          const imageUrl = item.image
            ? `${IMAGE_BASE_URL}${item.image}`
            : undefined;

          return (
            <View
              style={{
                marginHorizontal: 16,
                marginBottom: 16,
                padding: 12,
                backgroundColor: '#fff',
                borderRadius: 12,
              }}
            >
              {imageUrl && (
                <Image
                  source={{ uri: imageUrl }}
                  style={{
                    width: '100%',
                    height: 180,
                    borderRadius: 10,
                  }}
                  resizeMode="cover"
                />
              )}

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  marginTop: 10,
                }}
              >
                {item.name}
              </Text>

              <Text
                style={{
                  color: '#6B7280',
                  marginTop: 4,
                }}
              >
                {item.category_name} • {item.sub_category_name}
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  color: '#6B7280',
                }}
              >
                Unit: {item.unit}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default HomeScreen;
