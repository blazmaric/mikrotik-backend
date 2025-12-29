import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Network, ArrowDown, ArrowUp } from 'lucide-react-native';
import { NetworkInterface } from '@/app/types/mikrotik';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '@/constants/theme';

interface NetworkInterfaceCardProps {
  interface: NetworkInterface;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export default function NetworkInterfaceCard({ interface: iface }: NetworkInterfaceCardProps) {
  const getStatusColor = () => {
    switch (iface.status) {
      case 'running':
        return COLORS.status.running;
      case 'down':
        return COLORS.status.down;
      case 'disabled':
        return COLORS.status.disabled;
      default:
        return COLORS.status.disabled;
    }
  };
  const statusColor = getStatusColor();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${COLORS.primary.main}20` }]}>
          <Network size={20} color={COLORS.primary.main} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{iface.name}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.status, { color: statusColor }]}>{iface.status}</Text>
          </View>
        </View>
        <Text style={styles.type}>{iface.type}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.stats}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <ArrowDown size={16} color={COLORS.success} />
            <Text style={styles.statLabel}>RX</Text>
            <Text style={styles.statValue}>{formatBytes(iface.rxBytes)}</Text>
          </View>
          <View style={styles.statItem}>
            <ArrowUp size={16} color={COLORS.secondary.main} />
            <Text style={styles.statLabel}>TX</Text>
            <Text style={styles.statValue}>{formatBytes(iface.txBytes)}</Text>
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Packets RX</Text>
            <Text style={styles.statValue}>{iface.rxPackets.toLocaleString()}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Packets TX</Text>
            <Text style={styles.statValue}>{iface.txPackets.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.mac}>{iface.macAddress}</Text>
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
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.xs,
  },
  status: {
    fontSize: FONT_SIZE.xs,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
  },
  type: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
    backgroundColor: COLORS.background.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.background.cardBorder,
    marginBottom: SPACING.md,
  },
  stats: {
    gap: SPACING.sm,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
  },
  statValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
    marginLeft: 'auto' as const,
  },
  footer: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.background.cardBorder,
  },
  mac: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.disabled,
    fontFamily: 'monospace' as const,
  },
});
