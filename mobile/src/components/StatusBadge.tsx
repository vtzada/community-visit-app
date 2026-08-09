import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface StatusBadgeProps {
  status?: string;
}

const STATUS_MAP: Record<string, { bg: string; text: string; label: string }> = {
  AGENDADA: { bg: colors.warningLight, text: colors.warning, label: 'AGENDADA' },
  CONCLUIDA: { bg: colors.successLight, text: colors.success, label: 'REALIZADA' },
};

const DEFAULT_STATUS = { bg: colors.dangerLight, text: colors.danger, label: 'PENDENTE' };

export function StatusBadge({ status }: StatusBadgeProps) {
  const info = (status && STATUS_MAP[status]) || DEFAULT_STATUS;

  return (
    <View style={[styles.badge, { backgroundColor: info.bg }]}>
      <Text style={[styles.text, { color: info.text }]}>{info.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});