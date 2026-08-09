import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { VisitRequestData } from '../services/visitService';
import { StatusBadge } from './StatusBadge';
import { colors } from '../theme/colors';

interface VisitRequestCardProps {
  item: VisitRequestData;
  index: number;
}

export function VisitRequestCard({ item, index }: VisitRequestCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(350)}
      style={styles.card}
    >
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {item.nomeSolicitante}
        </Text>
        <StatusBadge status={item.statusSolicitacao} />
      </View>

      {item.pedidoOracao && (
        <View style={styles.prayerRow}>
          <Feather name="heart" size={14} color={colors.accent} style={styles.prayerIcon} />
          <Text style={styles.prayerText} numberOfLines={3}>
            {item.pedidoOracao}
          </Text>
        </View>
      )}
    </Animated.View>
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
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  prayerRow: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: colors.prayerBg,
    padding: 10,
    borderRadius: 8,
  },
  prayerIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  prayerText: {
    fontSize: 13,
    color: colors.prayerText,
    flex: 1,
    lineHeight: 18,
  },
});