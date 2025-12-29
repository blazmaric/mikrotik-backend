import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Signal } from 'lucide-react-native';
import { SignalStrength } from '@/app/types/mikrotik';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '@/constants/theme';

interface SignalStrengthCardProps {
  signal: SignalStrength;
}

export default function SignalStrengthCard({ signal }: SignalStrengthCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${COLORS.primary.main}20` }]}>
          <Signal size={20} color={COLORS.primary.main} />
        </View>
        <Text style={styles.title}>Signal Strength</Text>
      </View>
      <View style={styles.grid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>RSRP</Text>
          <Text style={styles.metricValue}>{signal.rsrp}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>RSRQ</Text>
          <Text style={styles.metricValue}>{signal.rsrq}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>RSSI</Text>
          <Text style={styles.metricValue}>{signal.rssi}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>SINR</Text>
          <Text style={styles.metricValue}>{signal.sinr}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.background.cardBorder,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
  },
  metricLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
  },
  metricValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700' as const,
    color: COLORS.text.primary,
    fontFamily: 'monospace' as const,
  },
});
