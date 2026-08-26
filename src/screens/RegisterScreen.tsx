import React, { useState } from 'react';

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
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useDispatch } from 'react-redux';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useRegisterMutation } from '../store/authApi';
import { setCredentials } from '../store/authSlice';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();

  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  // --------------------------------
  // REGISTER
  // --------------------------------

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
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

    try {
      const response = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      }).unwrap();

      // If API returns token + user,
      // login automatically.
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
              navigation.replace('Login', {
                redirect: 'Checkout',
              }),
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* BRAND */}

          <View style={styles.logoContainer}>
            <Text style={styles.logo}>MySabala</Text>

            <Text style={styles.tagline}>Create your account</Text>
          </View>

          {/* TITLE */}

          <Text style={styles.title}>Create Account</Text>

          <Text style={styles.subtitle}>Join MySabala today</Text>

          {/* NAME */}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* EMAIL */}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* PASSWORD */}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Create a password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.showText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* CONFIRM PASSWORD */}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#9ca3af"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          {/* REGISTER BUTTON */}

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* LOGIN */}

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account?</Text>

            <TouchableOpacity
              onPress={() =>
                navigation.replace('Login', {
                  redirect: 'Checkout',
                })
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },

  logo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#f97316',
  },

  tagline: {
    marginTop: 5,
    color: '#6b7280',
    fontSize: 13,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    marginTop: 5,
    marginBottom: 24,
    fontSize: 14,
    color: '#6b7280',
  },

  formGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 7,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#fff',
  },

  passwordContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 14,
  },

  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },

  showText: {
    color: '#f97316',
    fontWeight: '600',
  },

  registerButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  disabledButton: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },

  loginText: {
    color: '#6b7280',
    fontSize: 14,
  },

  loginLink: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 5,
  },
});
