import React, { useRef, useState } from 'react';

import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/RootNavigator';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

interface WelcomeItem {
  id: string;
  image: any;
  title: string;
  description: string;
}

const slides: WelcomeItem[] = [
  {
    id: '1',
    image: require('../assets/welcome-image.jpg'),
    title: 'Healthy Food, Happy Life',
    description:
      'Discover fresh and quality food products for you and your family.',
  },
  {
    id: '2',
    image: require('../assets/welcome-image1.jpg'),
    title: 'Freshness You Can Trust',
    description: 'Choose carefully selected products from trusted sources.',
  },
  {
    id: '3',
    image: require('../assets/welcome-image2.jpg'),
    title: 'Easy Shopping with MySabala',
    description: 'Browse products, add them to your cart and shop with ease.',
  },
];

const ONBOARDING_COMPLETED = '@mysabala_onboarding_completed';

const WelcomeScreen = ({ navigation }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const flatListRef = useRef<FlatList<WelcomeItem>>(null);

  const isLastSlide = currentIndex === slides.length - 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);

    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (isLastSlide) {
      handleGetStarted();
      return;
    }

    const nextIndex = currentIndex + 1;

    flatListRef.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
    });

    setCurrentIndex(nextIndex);
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED, 'true');

      navigation.replace('Main');
    } catch (error) {
      console.error('Unable to save onboarding status:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Full Screen Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {/* Full Screen Image */}
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="cover"
            />

            {/* Dark Overlay */}
            <View style={styles.overlay} />

            {/* Text */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>

              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Skip */}
      {!isLastSlide && (
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}

      {/* Bottom Controls */}
      <View style={styles.bottomContainer}>
        {/* Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex && styles.activeDot]}
            />
          ))}
        </View>

        {/* Button */}
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>
            {isLastSlide ? 'Get Started' : 'Next'}
          </Text>

          {!isLastSlide && <Text style={styles.arrow}>→</Text>}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  /*
   * FULL SCREEN SLIDE
   */
  slide: {
    width: width,
    height: height,
    position: 'relative',
  },

  /*
   * FULL SCREEN IMAGE
   */
  image: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    width: width,
    height: height,
  },

  /*
   * DARK OVERLAY
   *
   * Makes the text and buttons easier
   * to read over the image.
   */
  overlay: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },

  /*
   * SKIP BUTTON
   */
  skipButton: {
    position: 'absolute',

    top: 55,
    right: 20,

    zIndex: 20,

    paddingHorizontal: 15,
    paddingVertical: 8,

    backgroundColor: 'rgba(0, 0, 0, 0.35)',

    borderRadius: 20,
  },

  skipText: {
    fontSize: 14,

    fontWeight: '600',

    color: '#FFFFFF',
  },

  /*
   * TEXT ON IMAGE
   */
  textContainer: {
    position: 'absolute',

    left: 24,
    right: 24,

    bottom: 250,

    zIndex: 10,
  },

  title: {
    fontSize: 30,

    lineHeight: 37,

    fontWeight: '800',

    color: '#FFFFFF',

    textAlign: 'center',
  },

  description: {
    marginTop: 12,

    fontSize: 16,

    lineHeight: 24,

    color: '#FFFFFF',
    fontWeight: '400',
    textAlign: 'center',
  },

  /*
   * BOTTOM CONTROLS
   */
  bottomContainer: {
    position: 'absolute',

    left: 24,
    right: 24,
    bottom: 90,

    zIndex: 20,
  },

  /*
   * PAGINATION DOTS
   */
  pagination: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 20,
  },

  dot: {
    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: 'rgba(255, 255, 255, 0.55)',

    marginHorizontal: 4,
  },

  activeDot: {
    width: 26,

    backgroundColor: '#F7890B',
  },

  /*
   * NEXT / GET STARTED BUTTON
   */
  button: {
    height: 54,

    borderRadius: 15,

    backgroundColor: '#F7890B',

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,

    elevation: 5,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonText: {
    fontSize: 16,

    fontWeight: '700',

    color: '#FFFFFF',
  },

  arrow: {
    marginLeft: 10,

    fontSize: 22,

    color: '#FFFFFF',
  },
});

export default WelcomeScreen;
