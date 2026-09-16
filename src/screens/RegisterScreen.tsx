import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useRegisterMutation } from '../store/authApi';
import { setCredentials } from '../store/authSlice';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type FieldKey =
  | 'name'
  | 'email'
  | 'phone'
  | 'address'
  | 'city'
  | 'pincode'
  | 'password'
  | 'confirmPassword';

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  // ---------- responsive ----------
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isSmall = width < 360;
  const isLandscape = width > height;

  const styles = useMemo(
    () => createStyles({ isTablet, isSmall, isLandscape }),
    [isTablet, isSmall, isLandscape],
  );

  // ---------- keyboard / scroll ----------
  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const cardOffset = useRef(0);
  const fieldOffsets = useRef<Partial<Record<FieldKey, number>>>({});

  const captureFieldLayout = (key: FieldKey) => (e: any) => {
    fieldOffsets.current[key] = e.nativeEvent.layout.y;
  };

  // Scrolls the focused input above the keyboard
  const scrollToField = (key: FieldKey) => {
    const y = (cardOffset.current || 0) + (fieldOffsets.current[key] ?? 0);
    const delay = Platform.OS === 'ios' ? 250 : 150;
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: Math.max(y - 140, 0), // 140 = breathing room above the field
        animated: true,
      });
    }, delay);
  };

  // ---------- form state ----------
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Error', 'Please Enter a Valid Phone No');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter your address');
      return;
    }
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter your city');
      return;
    }
    if (!/^[0-9]{6}$/.test(pincode.trim())) {
      Alert.alert('Error', 'Please enter a valid 6 digit pincode');
      return;
    }

    try {
      const response = await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
      }).unwrap();

      if (response.token && response.user) {
        dispatch(
          setCredentials({
            token: response.token,
            user: response.user,
          }),
        );
        navigation.replace('Main');
      } else {
        Alert.alert('Success', 'Account created successfully', [
          {
            text: 'Login',
            onPress: () =>
              navigation.replace('Login', { redirect: 'Checkout' }),
          },
        ]);
      }
    } catch (error: any) {
      console.log('REGISTER ERROR:', error);
      Alert.alert(
        'Registration Failed',
        error?.data?.message || 'Unable to create account',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={styles.card}
          onLayout={e => {
            cardOffset.current = e.nativeEvent.layout.y;
          }}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>MySabala</Text>
            <Text style={styles.tagline}>Create your account</Text>
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join MySabala today</Text>

          {/* Full Name */}
          <View style={styles.formGroup} onLayout={captureFieldLayout('name')}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
              onFocus={() => scrollToField('name')}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          {/* Email */}
          <View style={styles.formGroup} onLayout={captureFieldLayout('email')}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              onFocus={() => scrollToField('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>
          <View style={styles.formGroup} onLayout={captureFieldLayout('email')}>
            <Text style={styles.label}>Phone No</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone no"
              placeholderTextColor="#9ca3af"
              value={phone}
              onChangeText={setPhone}
              onFocus={() => scrollToField('phone')}
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {/* Address */}
          <View
            style={styles.formGroup}
            onLayout={captureFieldLayout('address')}
          >
            <Text style={styles.label}>Delivery Address</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Enter your address"
              placeholderTextColor="#9ca3af"
              value={address}
              onChangeText={setAddress}
              onFocus={() => scrollToField('address')}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="default"
            />
          </View>

          {/* City */}
          <View style={styles.formGroup} onLayout={captureFieldLayout('city')}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your city"
              placeholderTextColor="#9ca3af"
              value={city}
              onChangeText={setCity}
              onFocus={() => scrollToField('city')}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          {/* PIN */}
          <View
            style={styles.formGroup}
            onLayout={captureFieldLayout('pincode')}
          >
            <Text style={styles.label}>PIN Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6 digit PIN code"
              placeholderTextColor="#9ca3af"
              value={pincode}
              onChangeText={text => {
                const value = text.replace(/[^0-9]/g, '');
                if (value.length <= 6) {
                  setPincode(value);
                }
              }}
              onFocus={() => scrollToField('pincode')}
              keyboardType="number-pad"
              maxLength={6}
              returnKeyType="next"
            />
          </View>

          {/* Password */}
          <View
            style={styles.formGroup}
            onLayout={captureFieldLayout('password')}
          >
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Create a password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                onFocus={() => scrollToField('password')}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                returnKeyType="next"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.showText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View
            style={styles.formGroup}
            onLayout={captureFieldLayout('confirmPassword')}
          >
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#9ca3af"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => scrollToField('confirmPassword')}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
          </View>

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.replace('Login', { redirect: 'Checkout' })
              }
            >
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ------------------------------------------------------------------
// Responsive styles factory
// ------------------------------------------------------------------
const createStyles = ({
  isTablet,
  isSmall,
  isLandscape,
}: {
  isTablet: boolean;
  isSmall: boolean;
  isLandscape: boolean;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f9fafb',
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center', // centers the card horizontally on wide screens
      paddingHorizontal: isTablet ? 32 : isSmall ? 12 : 20,
      paddingVertical: isLandscape ? 16 : isTablet ? 32 : 20,
      paddingBottom: isLandscape ? 40 : 32, // extra room so last field clears keyboard
    },
    card: {
      width: '100%',
      maxWidth: 480, // keeps the form readable on tablets / landscape
      backgroundColor: '#ffffff',
      borderRadius: 20,
      padding: isTablet ? 32 : isSmall ? 18 : 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: isLandscape ? 16 : 28,
    },
    logo: {
      fontSize: isTablet ? 34 : isSmall ? 26 : 30,
      fontWeight: '800',
      color: '#f97316',
    },
    tagline: {
      marginTop: 5,
      color: '#6b7280',
      fontSize: isTablet ? 14 : 13,
      textAlign: 'center',
    },
    title: {
      fontSize: isTablet ? 30 : isSmall ? 22 : 26,
      fontWeight: '700',
      color: '#111827',
    },
    subtitle: {
      marginTop: 5,
      marginBottom: isLandscape ? 16 : 24,
      fontSize: isTablet ? 15 : 14,
      color: '#6b7280',
    },
    formGroup: {
      marginBottom: isLandscape ? 12 : 16,
    },
    label: {
      fontSize: isTablet ? 15 : 14,
      fontWeight: '600',
      color: '#374151',
      marginBottom: 7,
    },
    input: {
      minHeight: 52, // minHeight (not height) so multiline can grow
      borderWidth: 1,
      borderColor: '#e5e7eb',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: Platform.OS === 'ios' ? 14 : 10,
      fontSize: isTablet ? 16 : 15,
      color: '#111827',
      backgroundColor: '#fff',
    },
    multilineInput: {
      minHeight: 96,
      textAlignVertical: 'top', // Android: start text at the top
      paddingTop: 14,
    },
    passwordContainer: {
      minHeight: 52,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 16,
      paddingRight: 14,
      backgroundColor: '#fff',
    },
    passwordInput: {
      flex: 1,
      fontSize: isTablet ? 16 : 15,
      color: '#111827',
      paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    },
    showText: {
      color: '#f97316',
      fontWeight: '600',
      fontSize: isTablet ? 15 : 14,
    },
    registerButton: {
      minHeight: 52,
      borderRadius: 12,
      backgroundColor: '#f97316',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 5,
      paddingHorizontal: 16,
    },
    disabledButton: {
      opacity: 0.6,
    },
    registerButtonText: {
      color: '#ffffff',
      fontSize: isTablet ? 17 : 16,
      fontWeight: '700',
      textAlign: 'center',
    },
    loginRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: isLandscape ? 16 : 24,
    },
    loginText: {
      color: '#6b7280',
      fontSize: isTablet ? 15 : 14,
    },
    loginLink: {
      color: '#f97316',
      fontSize: isTablet ? 15 : 14,
      fontWeight: '700',
      marginLeft: 5,
    },
  });
