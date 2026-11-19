import { useEffect, useRef } from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1.02)).current;

  useEffect(() => {
    // Smooth fade in & gentle scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 2200,
        useNativeDriver: true,
      }),
    ]).start();

    let isMounted = true;

    // Check authentication and navigate after splash delay
    const timer = setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem('@auth_token');
        if (isMounted) {
          if (token) {
            router.replace('/home');
          } else {
            router.replace('/login');
          }
        }
      } catch {
        if (isMounted) {
          router.replace('/login');
        }
      }
    }, 2200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [fadeAnim, scaleAnim]);

  const handleSkip = async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      if (token) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    } catch {
      router.replace('/login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <TouchableOpacity
        style={styles.touchable}
        activeOpacity={1}
        onPress={handleSkip}
      >
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require('@/assets/images/splash-background.png')}
            style={styles.backgroundImage}
            contentFit="cover"
            priority="high"
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050010',
  },
  touchable: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
});
