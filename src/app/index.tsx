import {
  Animated,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';

import { useSplashController } from '@/controllers/splash/useSplashController';

export default function SplashScreen() {
  const { fadeAnim, scaleAnim, handleSkip } = useSplashController();

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
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
});
