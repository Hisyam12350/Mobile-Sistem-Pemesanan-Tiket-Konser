import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export function useSplashController() {
  const fadeAnim = useRef(new Animated.Value(0));
  const scaleAnim = useRef(new Animated.Value(1.02));

  useEffect(() => {
    // Smooth fade in & gentle scale animation
    Animated.parallel([
      Animated.timing(fadeAnim.current, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim.current, {
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
            (router as any).replace('/home');
          } else {
            (router as any).replace('/login');
          }
        }
      } catch {
        if (isMounted) {
          (router as any).replace('/login');
        }
      }
    }, 2200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handleSkip = async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      if (token) {
        (router as any).replace('/home');
      } else {
        (router as any).replace('/login');
      }
    } catch {
      (router as any).replace('/login');
    }
  };

  return {
    fadeAnim: fadeAnim.current,
    scaleAnim: scaleAnim.current,
    handleSkip,
  };
}
