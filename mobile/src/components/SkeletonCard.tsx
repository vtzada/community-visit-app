import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

export function SkeletonCard() {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.line, styles.lineTitle, animatedStyle]} />
      <Animated.View style={[styles.line, styles.lineBadge, animatedStyle]} />
      <Animated.View style={[styles.line, styles.lineFull, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  line: {
    backgroundColor: colors.skeleton,
    borderRadius: 6,
  },
  lineTitle: {
    width: '50%',
    height: 16,
    marginBottom: 10,
  },
  lineBadge: {
    width: '30%',
    height: 12,
    marginBottom: 14,
  },
  lineFull: {
    width: '90%',
    height: 12,
  },
});