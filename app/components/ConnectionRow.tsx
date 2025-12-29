import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActiveConnection } from '@/app/types/mikrotik';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '@/constants/theme';

interface ConnectionRowProps {
  connection: ActiveConnection;
}

export default function ConnectionRow({ connection }: ConnectionRowProps) {
  const getStateColor = () => {
    switch (connection.state.toLowerCase()) {
      case 'established':
        return COLORS.status.established;
      case 'time-wait':
        return COLORS.status.timeWait;
      case 'unreplied':
        return COLORS.status.unreplied;
      default:
        return COLORS.text.secondary;
    }
  };

  return (
    <View style={styles.row}>
      <View style={styles.cell}>
        <Text style={styles.protocol}>{connection.protocol.toUpperCase()}</Text>
      </View>
      <View style={[styles.cell, styles.flexCell]}>
        <Text style={styles.address} numberOfLines={1}>
          {connection.srcAddress}:{connection.srcPort}
        </Text>
      </View>
      <View style={[styles.cell, styles.flexCell]}>
        <Text style={styles.address} numberOfLines={1}>
          {connection.dstAddress}:{connection.dstPort}
        </Text>
      </View>
      <View style={styles.cell}>
        <View style={[styles.stateBadge, { backgroundColor: `${getStateColor()}20` }]}>
          <Text style={[styles.state, { color: getStateColor() }]}>
            {connection.state}
          </Text>
        </View>
      </View>
      <View style={styles.cell}>
        <Text style={styles.timeout}>{connection.timeout}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.cardBorder,
  },
  cell: {
    marginRight: SPACING.sm,
  },
  flexCell: {
    flex: 1,
  },
  protocol: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700' as const,
    color: COLORS.primary.main,
    backgroundColor: `${COLORS.primary.main}20`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    minWidth: 40,
    textAlign: 'center' as const,
  },
  address: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.primary,
    fontFamily: 'monospace' as const,
  },
  stateBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    minWidth: 80,
  },
  state: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  timeout: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    minWidth: 50,
    textAlign: 'right' as const,
  },
});
