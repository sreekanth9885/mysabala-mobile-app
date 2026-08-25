import React from 'react';

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ChevronRight,
  Heart,
  HelpCircle,
  MapPin,
  Package,
  User,
} from 'lucide-react-native';

const ORANGE = '#F7890B';

export function ProfileScreen() {
  const isLoggedIn = false;

  const handleLogin = () => {
    // TODO: Navigate to Login screen
    console.log('Login pressed');
  };

  const handleSignUp = () => {
    // TODO: Navigate to Register screen
    console.log('Sign Up pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {!isLoggedIn ? (
          <>
            {/* Guest Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <User size={34} color={ORANGE} strokeWidth={2} />
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.welcomeTitle}>Welcome to MySabala 👋</Text>

                <Text style={styles.welcomeDescription}>
                  Sign in to manage your orders, addresses and account.
                </Text>
              </View>
            </View>

            {/* Login Button */}
            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>

            {/* Create Account */}
            <Pressable
              onPress={handleSignUp}
              style={({ pressed }) => [
                styles.signupButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.signupButtonText}>Create New Account</Text>
            </Pressable>

            {/* Guest Options */}
            <Text style={styles.sectionTitle}>Explore MySabala</Text>

            <View style={styles.menuCard}>
              <ProfileMenuItem
                icon={<Package size={21} color="#374151" />}
                title="My Orders"
                subtitle="Track your orders"
              />

              <ProfileMenuItem
                icon={<MapPin size={21} color="#374151" />}
                title="Delivery Addresses"
                subtitle="Manage your addresses"
              />

              <ProfileMenuItem
                icon={<Heart size={21} color="#374151" />}
                title="Wishlist"
                subtitle="Your saved products"
              />
            </View>

            {/* Help */}
            <Text style={styles.sectionTitle}>Support</Text>

            <View style={styles.menuCard}>
              <ProfileMenuItem
                icon={<HelpCircle size={21} color="#374151" />}
                title="Help & Support"
                subtitle="We're here to help"
              />
            </View>

            {/* App Info */}
            <View style={styles.appInfo}>
              <Text style={styles.appName}>MySabala</Text>

              <Text style={styles.version}>Version 1.0.0</Text>
            </View>
          </>
        ) : (
          /* Logged In UI */
          <View>
            <View style={styles.profileCard}>
              <View style={styles.loggedAvatar}>
                <Text style={styles.avatarText}>S</Text>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.userName}>Srikanth</Text>

                <Text style={styles.phoneNumber}>+91 XXXXX XXXXX</Text>
              </View>

              <ChevronRight size={22} color="#9CA3AF" />
            </View>

            <Text style={styles.sectionTitle}>My Account</Text>

            <View style={styles.menuCard}>
              <ProfileMenuItem
                icon={<Package size={21} color="#374151" />}
                title="My Orders"
                subtitle="View your orders"
              />

              <ProfileMenuItem
                icon={<MapPin size={21} color="#374151" />}
                title="Delivery Addresses"
                subtitle="Manage delivery addresses"
              />

              <ProfileMenuItem
                icon={<Heart size={21} color="#374151" />}
                title="Wishlist"
                subtitle="Your saved products"
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------------- */
/* Menu Item */
/* -------------------------------- */

interface ProfileMenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

function ProfileMenuItem({ icon, title, subtitle }: ProfileMenuItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.menuItem, pressed && styles.menuPressed]}
    >
      <View style={styles.menuIcon}>{icon}</View>

      <View style={styles.menuText}>
        <Text style={styles.menuTitle}>{title}</Text>

        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>

      <ChevronRight size={20} color="#9CA3AF" />
    </Pressable>
  );
}

/* -------------------------------- */
/* Styles */
/* -------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  header: {
    paddingTop: 15,
    paddingBottom: 20,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },

  /* Profile Card */

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    borderRadius: 18,

    padding: 18,

    borderWidth: 1,
    borderColor: '#F0F0F0',

    elevation: 2,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  avatar: {
    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor: '#FFF3E5',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 14,
  },

  loggedAvatar: {
    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor: ORANGE,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 14,
  },

  avatarText: {
    fontSize: 25,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  profileInfo: {
    flex: 1,
  },

  welcomeTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },

  welcomeDescription: {
    marginTop: 5,

    fontSize: 13,
    lineHeight: 19,

    color: '#6B7280',
  },

  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },

  phoneNumber: {
    marginTop: 5,
    fontSize: 13,
    color: '#6B7280',
  },

  /* Buttons */

  loginButton: {
    height: 52,

    marginTop: 16,

    borderRadius: 14,

    backgroundColor: ORANGE,

    alignItems: 'center',
    justifyContent: 'center',
  },

  loginButtonText: {
    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: '700',
  },

  signupButton: {
    height: 52,

    marginTop: 10,

    borderRadius: 14,

    backgroundColor: '#FFFFFF',

    borderWidth: 1.5,
    borderColor: ORANGE,

    alignItems: 'center',
    justifyContent: 'center',
  },

  signupButtonText: {
    color: ORANGE,

    fontSize: 16,

    fontWeight: '700',
  },

  buttonPressed: {
    opacity: 0.75,
  },

  /* Sections */

  sectionTitle: {
    marginTop: 26,
    marginBottom: 10,

    fontSize: 16,

    fontWeight: '700',

    color: '#111827',
  },

  menuCard: {
    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    overflow: 'hidden',

    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  menuItem: {
    minHeight: 72,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 15,

    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  menuPressed: {
    backgroundColor: '#F9FAFB',
  },

  menuIcon: {
    width: 42,
    height: 42,

    borderRadius: 12,

    backgroundColor: '#F9FAFB',

    alignItems: 'center',
    justifyContent: 'center',
  },

  menuText: {
    flex: 1,

    marginLeft: 13,
  },

  menuTitle: {
    fontSize: 15,

    fontWeight: '700',

    color: '#111827',
  },

  menuSubtitle: {
    marginTop: 3,

    fontSize: 12,

    color: '#9CA3AF',
  },

  /* App Info */

  appInfo: {
    alignItems: 'center',

    marginTop: 35,
  },

  appName: {
    fontSize: 14,

    fontWeight: '700',

    color: '#6B7280',
  },

  version: {
    marginTop: 4,

    fontSize: 12,

    color: '#9CA3AF',
  },
});
