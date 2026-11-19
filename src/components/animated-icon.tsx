import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const DURATION = 400;

export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      opacity: 1,
    },
    70: {
      opacity: 0.5,
      easing: Easing.out(Easing.quad),
    },
    100: {
      opacity: 0,
      easing: Easing.out(Easing.quad),
    },
  });

  return animate ? (
    <Animated.View
      entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={styles.splashOverlay}>
      <Image
        style={styles.fullImage}
        source={require('@/assets/images/splash-background.png')}
        contentFit="cover"
        priority="high"
      />
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => {
          setAnimate(true);
        });
      }}
      style={styles.splashOverlay}>
      <Image
        style={styles.fullImage}
        source={require('@/assets/images/splash-background.png')}
        contentFit="cover"
        priority="high"
      />
    </View>
  );
}

const keyframe = new Keyframe({
  0: { transform: [{ scale: 0.8 }] },
  100: { transform: [{ scale: 1 }], easing: Easing.elastic(0.7) },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View entering={keyframe.duration(DURATION)} style={styles.background} />
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={require('@/assets/images/icon.png')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#050010',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
  },
  image: {
    width: 76,
    height: 71,
  },
  background: {
    borderRadius: 40,
    backgroundColor: '#7000FF',
    width: 128,
    height: 128,
    position: 'absolute',
  },
});
