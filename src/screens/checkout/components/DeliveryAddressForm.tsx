import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { CheckoutAddress } from '../types/checkoutType';
interface Props {
  value: CheckoutAddress;
  onChange: (value: CheckoutAddress) => void;
}
export default function DeliveryAddressForm({ value, onChange }: Props) {
  const updateField = (field: keyof CheckoutAddress, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Delivery Address</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#9ca3af"
          value={value.fullName}
          onChangeText={text => updateField('fullName', text)}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="10-digit mobile number"
          placeholderTextColor="#9ca3af"
          value={value.phone}
          onChangeText={text => updateField('phone', text.replace(/\D/g, ''))}
          keyboardType="numeric"
          maxLength={10}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="House number, street, landmark..."
          placeholderTextColor="#9ca3af"
          value={value.address}
          onChangeText={text => updateField('address', text)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      <View style={styles.row}>
        <View style={styles.halfGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#9ca3af"
            value={value.city}
            onChangeText={text => updateField('city', text)}
          />
        </View>
        <View style={styles.spacer} />
        <View style={styles.halfGroup}>
          <Text style={styles.label}>Pincode</Text>
          <TextInput
            style={styles.input}
            placeholder="6-digit pincode"
            placeholderTextColor="#9ca3af"
            value={value.pincode}
            onChangeText={text =>
              updateField('pincode', text.replace(/\D/g, ''))
            }
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
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
    paddingVertical: 12,
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
  },
  halfGroup: {
    flex: 1,
  },
  spacer: {
    width: 16,
  },
});
