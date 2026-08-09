import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

type IconName = React.ComponentProps<typeof Feather>['name'];

interface IconButtonProps {
  iconName: IconName;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
  size?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function IconButton({
  iconName,
  onPress,
  loading = false,
  disabled = false,
  accessibilityLabel,
  size = 48,
}: IconButtonProps) {
  const scale = useSharedValue(1);
  const isDisabled = disabled || loading;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      onPressIn={() => {
        scale.value = withTiming(0.94, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
      }}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size * 0.25 },
        isDisabled && styles.disabled,
        animatedStyle,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        <Feather name={iconName} size={20} color={colors.white} />
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});