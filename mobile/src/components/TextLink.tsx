import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

interface TextLinkProps {
  label: string;
  onPress: () => void;
}

export function TextLink({ label, onPress }: TextLinkProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.base, pressed && styles.pressed]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    marginTop: 20,
    paddingVertical: 8,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});