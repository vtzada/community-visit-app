import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface EmptyStateProps {
  icon: React.ComponentProps<typeof Feather>['name'];
  message: string;
}

export function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Feather name={icon} size={40} color={colors.emptyIcon} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 32,
  },
  text: {
    fontSize: 14,
    color: colors.emptyText,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
});