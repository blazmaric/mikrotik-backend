import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity } from 'lucide-react-native';
import { PingResult } from '@/app/types/mikrotik';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '@/constants/theme';

interface PingResultCardProps {
  ping: PingResult;
}

export default function PingResultCard({ ping }: PingResultCardProps) {
  const packetLossNum = parseFloat(ping.packetLoss);
  const statusColor = packetLossNum === 0 ? COLORS.success : packetLossNum < 10 ? COLORS.warning : COLORS.error;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${COLORS.primary.main}20` }]}>
          <Activity size={20} color={COLORS.primary.main} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Ping Results</Text>
          <Text style={styles.host}>{ping.host}</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Sent</Text>
          <Text style={styles.statValue}>{ping.sent}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Received</Text>
          <Text style={styles.statValue}>{ping.received}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Loss</Text>
          <Text style={[styles.statValue, { color: statusColor }]}>{ping.packetLoss}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Min</Text>
          <Text style={styles.statValue}>{ping.minTime}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Avg</Text>
          <Text style={styles.statValue}>{ping.avgTime}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Max</Text>
          <Text style={styles.statValue}>{ping.maxTime}</Text>
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
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  host: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
    fontFamily: 'monospace' as const,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
  },
  statValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700' as const,
    color: COLORS.text.primary,
    fontFamily: 'monospace' as const,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.background.cardBorder,
    marginVertical: SPACING.md,
  },
});
