import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, MapPin, Phone, User } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootState } from '../store/store';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { updateUser } from '../store/authSlice';
import { useUpdateProfileMutation } from '../store/authApi';

const ORANGE = '#F7890B';
const MAX_CONTENT_WIDTH = 560;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function EditProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();

  const user = useSelector((state: RootState) => state.auth.user);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const inputPositions = useRef<Record<string, number>>({});

  // Responsive horizontal padding: tighter on small phones, generous on tablets
  const horizontalPadding = width < 360 ? 16 : width > 700 ? 32 : 20;

  useEffect(() => {
    if (!user) return;

    setName(user.name || '');
    setEmail(user.email || '');
    setPhone(user.phone || '');

    setAddress(user.address || '');
    setCity(user.city || '');
    setPincode(user.pincode || '');
  }, [user]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z ]{3,50}$/.test(name.trim())) {
      newErrors.name = 'Enter a valid name';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9][0-9]{9}$/.test(phone.trim())) {
      newErrors.phone = 'Enter a valid 10 digit phone number';
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(pincode.trim())) {
      newErrors.pincode = 'Enter a valid 6 digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!user?.id) return;
    if (!validate()) return;

    Keyboard.dismiss();

    try {
      const response = await updateProfile({
        id: user.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
      }).unwrap();

      dispatch(updateUser({ ...response.user }));

      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (error: any) {
      const message =
        error?.data?.message ||
        'Unable to update your profile. Please try again.';
      Alert.alert('Update Failed', message);
    }
  };

  const handleFieldFocus = useCallback((field: string) => {
    setFocusedField(field);
    // Auto-scroll to the focused input so it isn't hidden behind the keyboard
    const y = inputPositions.current[field];
    if (y !== undefined) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: Math.max(y - 100, 0),
          animated: true,
        });
      }, 120);
    }
  }, []);

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.center}>
          <Text style={styles.notLoggedText}>
            Please login to edit your profile.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.buttonPressed,
            ]}
            hitSlop={10}
          >
            <ArrowLeft size={22} color="#111827" />
          </Pressable>

          <Text style={styles.headerTitle}>Edit Profile</Text>

          <View style={styles.headerSpacer} />
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={[
              styles.content,
              { paddingHorizontal: horizontalPadding },
            ]}
          >
            <View style={styles.contentInner}>
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(name || user.name || 'U').charAt(0).toUpperCase()}
                  </Text>
                </View>

                <Text style={styles.profileName} numberOfLines={1}>
                  {name || 'MySabala User'}
                </Text>

                <Text style={styles.profileSubtitle}>
                  Update your personal information
                </Text>
              </View>

              {/* Personal Information */}
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <View style={styles.card}>
                <InputField
                  icon={<User size={20} color="#6B7280" />}
                  label="Full Name"
                  value={name}
                  onChangeText={text => {
                    setName(text);
                    setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  onFocus={() => handleFieldFocus('name')}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === 'name'}
                  onLayout={y => (inputPositions.current.name = y)}
                  placeholder="Enter your full name"
                  error={errors.name}
                  autoCapitalize="words"
                  returnKeyType="next"
                />

                <InputField
                  icon={<Mail size={20} color="#6B7280" />}
                  label="Email Address"
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  onFocus={() => handleFieldFocus('email')}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === 'email'}
                  onLayout={y => (inputPositions.current.email = y)}
                  placeholder="Enter your email"
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                />

                <InputField
                  icon={<Phone size={20} color="#6B7280" />}
                  label="Phone Number"
                  value={phone}
                  onChangeText={text => {
                    setPhone(text.replace(/[^0-9]/g, ''));
                    setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  onFocus={() => handleFieldFocus('phone')}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === 'phone'}
                  onLayout={y => (inputPositions.current.phone = y)}
                  placeholder="Enter your phone number"
                  error={errors.phone}
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="next"
                  isLast
                />
              </View>

              {/* Delivery Address */}
              <Text style={styles.sectionTitle}>Delivery Address</Text>

              <View style={styles.card}>
                <InputField
                  icon={<MapPin size={20} color="#6B7280" />}
                  label="Address"
                  value={address}
                  onChangeText={text => {
                    setAddress(text);
                    setErrors(prev => ({ ...prev, address: '' }));
                  }}
                  onFocus={() => handleFieldFocus('address')}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === 'address'}
                  onLayout={y => (inputPositions.current.address = y)}
                  placeholder="House number, street, area"
                  error={errors.address}
                  multiline
                  textAlignVertical="top"
                />

                <InputField
                  icon={<MapPin size={20} color="#6B7280" />}
                  label="City"
                  value={city}
                  onChangeText={text => {
                    setCity(text);
                    setErrors(prev => ({ ...prev, city: '' }));
                  }}
                  onFocus={() => handleFieldFocus('city')}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === 'city'}
                  onLayout={y => (inputPositions.current.city = y)}
                  placeholder="Enter your city"
                  error={errors.city}
                  autoCapitalize="words"
                  returnKeyType="next"
                />

                <InputField
                  icon={<MapPin size={20} color="#6B7280" />}
                  label="Pincode"
                  value={pincode}
                  onChangeText={text => {
                    setPincode(text.replace(/[^0-9]/g, ''));
                    setErrors(prev => ({ ...prev, pincode: '' }));
                  }}
                  onFocus={() => handleFieldFocus('pincode')}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === 'pincode'}
                  onLayout={y => (inputPositions.current.pincode = y)}
                  placeholder="Enter 6 digit pincode"
                  error={errors.pincode}
                  keyboardType="number-pad"
                  maxLength={6}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  isLast
                />
              </View>

              {/* Save Button */}
              <Pressable
                onPress={handleSave}
                disabled={isLoading}
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && !isLoading && styles.buttonPressed,
                  isLoading && styles.disabledButton,
                ]}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </Pressable>

              <Text style={styles.bottomText}>
                Your information is securely stored with MySabala.
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  keyboardType?: any;
  autoCapitalize?: any;
  multiline?: boolean;
  textAlignVertical?: any;
  maxLength?: number;
  isLast?: boolean;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onLayout?: (y: number) => void;
  returnKeyType?: any;
  onSubmitEditing?: () => void;
}

const InputField = React.memo(function InputField({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType,
  autoCapitalize,
  multiline,
  textAlignVertical,
  maxLength,
  isLast,
  isFocused,
  onFocus,
  onBlur,
  onLayout,
  returnKeyType,
  onSubmitEditing,
}: InputFieldProps) {
  const hasError = !!error;

  return (
    <View
      style={[styles.inputWrapper, !isLast && styles.inputBorder]}
      onLayout={e => onLayout?.(e.nativeEvent.layout.y)}
    >
      <View
        style={[
          styles.inputIcon,
          isFocused && styles.inputIconFocused,
          hasError && styles.inputIconError,
        ]}
      >
        {icon}
      </View>

      <View style={styles.inputContent}>
        <Text style={[styles.inputLabel, hasError && styles.inputLabelError]}>
          {label}
        </Text>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          style={[styles.input, multiline && styles.multilineInput]}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          textAlignVertical={textAlignVertical}
          maxLength={maxLength}
          onFocus={onFocus}
          onBlur={onBlur}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={returnKeyType === 'done'}
        />

        {hasError ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  keyboard: {
    flex: 1,
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.2,
  },

  headerSpacer: {
    width: 42,
  },

  content: {
    paddingTop: 8,
    paddingBottom: 48,
  },

  contentInner: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },

  avatarContainer: {
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 6,
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  avatarText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  profileName: {
    marginTop: 14,
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
  },

  profileSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.2,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },

  inputWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  inputBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },

  inputIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  inputIconFocused: {
    backgroundColor: '#FFF3E5',
  },

  inputIconError: {
    backgroundColor: '#FEE2E2',
  },

  inputContent: {
    flex: 1,
    marginLeft: 12,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 2,
    letterSpacing: 0.2,
  },

  inputLabelError: {
    color: '#DC2626',
  },

  input: {
    minHeight: 32,
    padding: 0,
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },

  multilineInput: {
    minHeight: 56,
    paddingTop: 4,
  },

  errorText: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
  },

  saveButton: {
    height: 54,
    marginTop: 28,
    borderRadius: 14,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonPressed: {
    opacity: 0.75,
  },

  bottomText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 11,
    color: '#9CA3AF',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  notLoggedText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
});
