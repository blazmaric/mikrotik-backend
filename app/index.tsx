import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Cpu, HardDrive, Clock, Activity, Network, Wifi, Radio, Globe, Power } from 'lucide-react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import StatCard from './components/StatCard';
import ProgressCard from './components/ProgressCard';
import MiniChart from './components/MiniChart';
import NetworkInterfaceCard from './components/NetworkInterfaceCard';
import ConnectionRow from './components/ConnectionRow';
import SignalStrengthCard from './components/SignalStrengthCard';
import PingResultCard from './components/PingResultCard';
import SmsInboxCard from './components/SmsInboxCard';
import BackupsCard from './components/BackupsCard';
import {
  MOCK_SYSTEM_STATS,
  MOCK_NETWORK_INTERFACES,
  MOCK_ACTIVE_CONNECTIONS,
  MOCK_TRAFFIC_STATS,
  MOCK_UPLINK_INFO,
  MOCK_WAN_STATUS,
  MOCK_LTE_STATUS,
  MOCK_SIGNAL_STRENGTH,
  MOCK_PING_RESULT,
  MOCK_SMS_MESSAGES,
  MOCK_BACKUPS,
  generateCPUHistory,
  generateMemoryHistory,
  REFRESH_INTERVAL,
} from '@/constants/mikrotik';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '@/constants/theme';
import { CPUHistory, MemoryHistory } from './types/mikrotik';
import { mikrotikApi } from './services/mikrotik';

export default function DashboardScreen() {
  const [cpuHistory, setCpuHistory] = useState<CPUHistory[]>(generateCPUHistory());
  const [memoryHistory, setMemoryHistory] = useState<MemoryHistory[]>(generateMemoryHistory());

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: mikrotikApi.getDashboardData,
    refetchInterval: REFRESH_INTERVAL,
    retry: 3,
    retryDelay: 1000,
  });

  const systemStats = data?.systemStats || MOCK_SYSTEM_STATS;
  const interfaces = data?.interfaces || MOCK_NETWORK_INTERFACES;
  const connections = data?.connections || MOCK_ACTIVE_CONNECTIONS;
  const uplinkInfo = data?.uplinkInfo || MOCK_UPLINK_INFO;
  const wanStatus = data?.wanStatus || MOCK_WAN_STATUS;
  const lteStatus = data?.lteStatus || MOCK_LTE_STATUS;
  const signalStrength = data?.signalStrength || MOCK_SIGNAL_STRENGTH;
  const pingResult = data?.pingResult || MOCK_PING_RESULT;
  const smsMessages = data?.smsMessages || MOCK_SMS_MESSAGES;
  const backups = data?.backups || MOCK_BACKUPS;

  useEffect(() => {
    if (data?.systemStats) {
      const newCpu = data.systemStats.cpu;
      const newMemory = data.systemStats.memory;

      setCpuHistory(prev => {
        const newHistory = [...prev.slice(1), { timestamp: Date.now(), value: newCpu }];
        return newHistory;
      });

      setMemoryHistory(prev => {
        const newHistory = [...prev.slice(1), { timestamp: Date.now(), value: newMemory }];
        return newHistory;
      });
    }
  }, [data?.systemStats]);

  useEffect(() => {
    if (isError) {
      console.error('Dashboard error:', error);
      Alert.alert(
        'Connection Error',
        'Failed to connect to MikroTik API. Using mock data.',
        [{ text: 'OK' }]
      );
    }
  }, [isError, error]);

  const rebootMutation = useMutation({
    mutationFn: () => mikrotikApi.reboot(),
    onSuccess: () => {
      Alert.alert('Success', 'System is rebooting...');
    },
    onError: (error) => {
      console.error('Error rebooting system:', error);
      Alert.alert('Error', 'Failed to reboot system');
    },
  });

  const onRefresh = async () => {
    await refetch();
  };

  const handleReboot = () => {
    Alert.alert(
      'Reboot System',
      'Are you sure you want to reboot the MikroTik router? This will disconnect all users temporarily.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reboot',
          style: 'destructive',
          onPress: () => rebootMutation.mutate(),
        },
      ]
    );
  };

  const formatTraffic = (bytes: number): string => {
    const mbps = (bytes * 8) / 1000000;
    return `${mbps.toFixed(2)} Mbps`;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <LinearGradient
        colors={[COLORS.background.primary, COLORS.background.secondary]}
        style={styles.container}
      >
        {isLoading && !data ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary.main} />
            <Text style={styles.loadingText}>Loading dashboard...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={onRefresh}
                tintColor={COLORS.primary.main}
                colors={[COLORS.primary.main]}
              />
            }
          >
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Mikrotik Dashboard</Text>
              <Text style={styles.subtitle}>{systemStats.boardName}</Text>
            </View>
            <View style={styles.headerActions}>
              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>{systemStats.version}</Text>
              </View>
              <TouchableOpacity
                style={styles.rebootButton}
                onPress={handleReboot}
                disabled={rebootMutation.isPending}
              >
                {rebootMutation.isPending ? (
                  <ActivityIndicator size="small" color={COLORS.text.primary} />
                ) : (
                  <>
                    <Power size={16} color={COLORS.text.primary} />
                    <Text style={styles.rebootButtonText}>Reboot</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uplink Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Gateway Name</Text>
                <Text style={styles.infoValue}>{uplinkInfo.gatewayName}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Description</Text>
                <Text style={styles.infoValue}>{uplinkInfo.gatewayDescription}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connection Status</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statusCard}>
                <View style={[styles.statusIconContainer, { backgroundColor: `${COLORS.primary.main}20` }]}>
                  <Wifi size={20} color={COLORS.primary.main} />
                </View>
                <Text style={styles.statusTitle}>WAN Status</Text>
                <Text style={styles.statusValue}>{wanStatus.wifiStatus}</Text>
                <Text style={styles.statusDetail}>SSID: {wanStatus.ssid}</Text>
                <Text style={styles.statusDetail}>{wanStatus.ipAddress}</Text>
              </View>
              <View style={styles.statusCard}>
                <View style={[styles.statusIconContainer, { backgroundColor: `${COLORS.secondary.main}20` }]}>
                  <Radio size={20} color={COLORS.secondary.main} />
                </View>
                <Text style={styles.statusTitle}>LTE Status</Text>
                <Text style={styles.statusValue}>{lteStatus.status}</Text>
                <Text style={styles.statusDetail}>{lteStatus.operator}</Text>
                <Text style={styles.statusDetail}>{lteStatus.ipAddress}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <SignalStrengthCard signal={signalStrength} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>System Overview</Text>
            <View style={styles.statsGrid}>
              <ProgressCard
                title="CPU Usage"
                value={systemStats.cpu}
                icon={Cpu}
                color={COLORS.primary.main}
              />
              <ProgressCard
                title="Memory Usage"
                value={systemStats.memory}
                icon={HardDrive}
                color={COLORS.secondary.main}
              />
            </View>
            <View style={styles.statsGrid}>
              <StatCard
                title="Uptime"
                value={systemStats.uptime}
                icon={Clock}
                color={COLORS.success}
              />
              <StatCard
                title="Public IP"
                value={systemStats.publicIp}
                icon={Globe}
                color={COLORS.warning}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Charts</Text>
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Activity size={20} color={COLORS.primary.main} />
                <Text style={styles.chartTitle}>CPU Usage History</Text>
                <Text style={styles.chartValue}>{systemStats.cpu}%</Text>
              </View>
              <MiniChart data={cpuHistory} color={COLORS.primary.main} height={80} />
            </View>
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <HardDrive size={20} color={COLORS.secondary.main} />
                <Text style={styles.chartTitle}>Memory Usage History</Text>
                <Text style={styles.chartValue}>{systemStats.memory}%</Text>
              </View>
              <MiniChart data={memoryHistory} color={COLORS.secondary.main} height={80} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Network Traffic</Text>
            <View style={styles.trafficCard}>
              <View style={styles.trafficRow}>
                <View style={styles.trafficItem}>
                  <Text style={styles.trafficLabel}>Download</Text>
                  <Text style={styles.trafficValue}>{formatTraffic(MOCK_TRAFFIC_STATS.currentRxRate)}</Text>
                </View>
                <View style={styles.trafficItem}>
                  <Text style={styles.trafficLabel}>Upload</Text>
                  <Text style={styles.trafficValue}>{formatTraffic(MOCK_TRAFFIC_STATS.currentTxRate)}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.trafficRow}>
                <View style={styles.trafficItem}>
                  <Text style={styles.trafficLabel}>Total RX</Text>
                  <Text style={styles.trafficValue}>{formatBytes(MOCK_TRAFFIC_STATS.totalRx)}</Text>
                </View>
                <View style={styles.trafficItem}>
                  <Text style={styles.trafficLabel}>Total TX</Text>
                  <Text style={styles.trafficValue}>{formatBytes(MOCK_TRAFFIC_STATS.totalTx)}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.trafficRow}>
                <View style={styles.trafficItem}>
                  <Text style={styles.trafficLabel}>Latency</Text>
                  <Text style={styles.trafficValue}>{MOCK_TRAFFIC_STATS.latency}</Text>
                </View>
                <View style={styles.trafficItem}>
                  <Text style={styles.trafficLabel}>Jitter</Text>
                  <Text style={styles.trafficValue}>{MOCK_TRAFFIC_STATS.jitter}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <PingResultCard ping={pingResult} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Network Interfaces</Text>
            {interfaces.map((iface, index) => (
              <NetworkInterfaceCard key={index} interface={iface} />
            ))}
          </View>

          <View style={styles.section}>
            <SmsInboxCard messages={smsMessages} />
          </View>

          <View style={styles.section}>
            <BackupsCard backups={backups} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Connections</Text>
            <View style={styles.connectionsCard}>
              <View style={styles.connectionsHeader}>
                <Network size={20} color={COLORS.primary.main} />
                <Text style={styles.connectionsTitle}>
                  {connections.length} Active Connections
                </Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={Platform.OS === 'web'}>
                <View style={styles.connectionsTable}>
                  <View style={styles.tableHeader}>
                    <View style={styles.headerCell}>
                      <Text style={styles.headerText}>Protocol</Text>
                    </View>
                    <View style={[styles.headerCell, styles.flexHeader]}>
                      <Text style={styles.headerText}>Source</Text>
                    </View>
                    <View style={[styles.headerCell, styles.flexHeader]}>
                      <Text style={styles.headerText}>Destination</Text>
                    </View>
                    <View style={styles.headerCell}>
                      <Text style={styles.headerText}>State</Text>
                    </View>
                    <View style={styles.headerCell}>
                      <Text style={styles.headerText}>Timeout</Text>
                    </View>
                  </View>
                  {connections.map((conn, index) => (
                    <ConnectionRow key={index} connection={conn} />
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {isError ? '⚠️ Using mock data • ' : ''}Auto-refresh every {REFRESH_INTERVAL / 1000}s • Pull to refresh
              </Text>
            </View>
          </ScrollView>
        )}
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingTop: SPACING.xl + 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700' as const,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary,
  },
  versionBadge: {
    backgroundColor: COLORS.background.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.background.cardBorder,
  },
  versionText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary.main,
    fontWeight: '600' as const,
  },
  rebootButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  rebootButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700' as const,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  infoCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.background.cardBorder,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  infoLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
  },
  statusCard: {
    flex: 1,
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.background.cardBorder,
    minWidth: 150,
  },
  statusIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  statusTitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
  },
  statusValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700' as const,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  statusDetail: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  trafficCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.background.cardBorder,
  },
  trafficRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  trafficItem: {
    flex: 1,
  },
  trafficLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
  },
  trafficValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700' as const,
    color: COLORS.text.primary,
    fontFamily: 'monospace' as const,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.background.cardBorder,
    marginVertical: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  chartCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.background.cardBorder,
    marginBottom: SPACING.md,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  chartTitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary,
    flex: 1,
  },
  chartValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700' as const,
    color: COLORS.text.primary,
  },
  connectionsCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.background.cardBorder,
    overflow: 'hidden',
  },
  connectionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.cardBorder,
  },
  connectionsTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600' as const,
    color: COLORS.text.primary,
  },
  connectionsTable: {
    minWidth: Dimensions.get('window').width - 32,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.background.secondary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.cardBorder,
  },
  headerCell: {
    marginRight: SPACING.sm,
  },
  flexHeader: {
    flex: 1,
  },
  headerText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700' as const,
    color: COLORS.text.secondary,
    textTransform: 'uppercase' as const,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.disabled,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  loadingText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary,
  },
});
