import React from 'react';

import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useGetCategoriesQuery } from '../store/api';

const Categories = () => {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();

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
        <Text>Unable to load categories</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={categories}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{
          padding: 16,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 18,
              marginBottom: 12,
              backgroundColor: '#fff',
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
              }}
            >
              {item.name}
            </Text>

            <Text
              style={{
                marginTop: 5,
                color: '#6B7280',
              }}
            >
              {item.description}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Categories;
