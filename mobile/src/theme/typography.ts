import { colors } from './colors';

export const typography = {
  hero: { fontSize: 28, fontWeight: '800' as const, color: colors.textPrimary },
  title: { fontSize: 20, fontWeight: '700' as const, color: colors.textPrimary },
  subtitle: { fontSize: 15, fontWeight: '400' as const, color: colors.textSecondary, lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.textPrimary, lineHeight: 22 },
  label: { fontSize: 13, fontWeight: '700' as const, color: colors.textSecondary, letterSpacing: 0.3 },
  caption: { fontSize: 12, fontWeight: '600' as const, color: colors.muted },
  badge: { fontSize: 11, fontWeight: '700' as const, textTransform: 'uppercase' as const },
} as const;
