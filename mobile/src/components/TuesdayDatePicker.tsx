import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { getNextTuesdays, toISODate, parseISODate, formatFriendlyDate } from '../utils/dates';

interface TuesdayDatePickerProps {
  value: string;
  onChange: (isoDate: string) => void;
  error?: boolean;
  weeksAhead?: number;
}

export function TuesdayDatePicker({ value, onChange, error, weeksAhead = 10 }: TuesdayDatePickerProps) {
  const [visible, setVisible] = useState(false);
  const tuesdays = useMemo(() => getNextTuesdays(weeksAhead), [weeksAhead]);

  const selectedDate = value ? parseISODate(value) : null;
  const displayLabel = selectedDate ? formatFriendlyDate(selectedDate) : 'Selecione uma terça-feira';

  function handleSelect(date: Date) {
    onChange(toISODate(date));
    setVisible(false);
  }

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={[styles.field, error && styles.fieldError]}
        accessibilityRole="button"
        accessibilityLabel="Selecionar data da visita"
      >
        <Feather name="calendar" size={18} color={error ? colors.danger : colors.muted} style={styles.icon} />
        <Text style={[styles.fieldText, !selectedDate && styles.placeholder]}>{displayLabel}</Text>
        <Feather name="chevron-down" size={18} color={colors.muted} />
      </Pressable>

      <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Escolha uma terça-feira</Text>
              <Pressable onPress={() => setVisible(false)} hitSlop={8}>
                <Feather name="x" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>
            <Text style={styles.sheetSubtitle}>
              As visitas do projeto acontecem exclusivamente às terças-feiras.
            </Text>

            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {tuesdays.map((date) => {
                const iso = toISODate(date);
                const isSelected = iso === value;
                return (
                  <Pressable
                    key={iso}
                    onPress={() => handleSelect(date)}
                    style={[styles.option, isSelected && styles.optionSelected]}
                  >
                    <View>
                      <Text style={[styles.optionWeekday, isSelected && styles.optionTextSelected]}>
                        Terça-feira
                      </Text>
                      <Text style={[styles.optionDate, isSelected && styles.optionTextSelected]}>
                        {formatFriendlyDate(date)}
                      </Text>
                    </View>
                    {isSelected && <Feather name="check-circle" size={20} color={colors.white} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.fieldBg,
    paddingHorizontal: 14,
  },
  fieldError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerLight,
  },
  icon: { marginRight: 10 },
  fieldText: { flex: 1, fontSize: 16, color: colors.textPrimary },
  placeholder: { color: colors.placeholder },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '75%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  sheetSubtitle: { fontSize: 13, color: colors.muted, marginBottom: 16 },
  list: { marginTop: 4 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: colors.fieldBg,
    marginBottom: 10,
  },
  optionSelected: { backgroundColor: colors.accent },
  optionWeekday: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  optionDate: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  optionTextSelected: { color: colors.white },
});