import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export function useSplashController() {
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(1.02));
  const hasNavigated = useRef(false);

  useEffect(() => {
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

    const timer = setTimeout(async () => {
      if (!isMounted || hasNavigated.current) return;
      hasNavigated.current = true;
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
  }, [fadeAnim, scaleAnim]);

  const handleSkip = async () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
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
    fadeAnim,
    scaleAnim,
    handleSkip,
  };
}
