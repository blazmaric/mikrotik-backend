import { SystemStats, NetworkInterface, ActiveConnection, TrafficStats, CPUHistory, MemoryHistory, UplinkInfo, WanStatus, LteStatus, SignalStrength, PingResult, SmsMessage, Backup } from '@/app/types/mikrotik';

export const MOCK_SYSTEM_STATS: SystemStats = {
  cpu: 23,
  memory: 45,
  uptime: '15d 7h 32m',
  version: 'RouterOS 7.12.1',
  boardName: 'RB4011iGS+',
  publicIp: '203.0.113.45',
};

export const MOCK_UPLINK_INFO: UplinkInfo = {
  gatewayName: 'Main Gateway',
  gatewayDescription: 'Primary Internet Connection',
};

export const MOCK_WAN_STATUS: WanStatus = {
  wifiStatus: 'Connected',
  ssid: 'MikroTik-WiFi',
  ipAddress: '192.168.88.1',
};

export const MOCK_LTE_STATUS: LteStatus = {
  status: 'Connected',
  operator: 'T-Mobile',
  ipAddress: '10.123.45.67',
};

export const MOCK_SIGNAL_STRENGTH: SignalStrength = {
  rsrp: '-85 dBm',
  rsrq: '-12 dB',
  rssi: '-65 dBm',
  sinr: '15 dB',
};

export const MOCK_PING_RESULT: PingResult = {
  host: '8.8.8.8',
  sent: 10,
  received: 10,
  packetLoss: '0%',
  minTime: '12ms',
  avgTime: '15ms',
  maxTime: '18ms',
};

export const MOCK_SMS_MESSAGES: SmsMessage[] = [
  {
    sender: '+386 40 123 456',
    time: '10:30',
    message: 'System backup completed successfully',
  },
  {
    sender: '+386 40 789 012',
    time: '09:15',
    message: 'High CPU usage alert',
  },
  {
    sender: '+386 40 345 678',
    time: '08:45',
    message: 'Network interface ether1 is down',
  },
];

export const MOCK_BACKUPS: Backup[] = [
  {
    name: 'backup-2025-01-05.backup',
    size: '2.4 MB',
    date: '2025-01-05 10:30',
  },
  {
    name: 'backup-2025-01-04.backup',
    size: '2.3 MB',
    date: '2025-01-04 10:30',
  },
  {
    name: 'backup-2025-01-03.backup',
    size: '2.3 MB',
    date: '2025-01-03 10:30',
  },
];

export const MOCK_NETWORK_INTERFACES: NetworkInterface[] = [
  {
    name: 'ether1-wan',
    type: 'ether',
    status: 'running',
    rxBytes: 1024000000,
    txBytes: 512000000,
    rxPackets: 1500000,
    txPackets: 1200000,
    macAddress: '4A:A9:8A:12:34:56',
  },
  {
    name: 'ether2-lan',
    type: 'ether',
    status: 'running',
    rxBytes: 2048000000,
    txBytes: 1024000000,
    rxPackets: 2500000,
    txPackets: 2000000,
    macAddress: '4A:A9:8A:12:34:57',
  },
  {
    name: 'ether3',
    type: 'ether',
    status: 'running',
    rxBytes: 512000000,
    txBytes: 256000000,
    rxPackets: 800000,
    txPackets: 600000,
    macAddress: '4A:A9:8A:12:34:58',
  },
  {
    name: 'ether4',
    type: 'ether',
    status: 'down',
    rxBytes: 0,
    txBytes: 0,
    rxPackets: 0,
    txPackets: 0,
    macAddress: '4A:A9:8A:12:34:59',
  },
  {
    name: 'ether5',
    type: 'ether',
    status: 'disabled',
    rxBytes: 0,
    txBytes: 0,
    rxPackets: 0,
    txPackets: 0,
    macAddress: '4A:A9:8A:12:34:5B',
  },
  {
    name: 'bridge1',
    type: 'bridge',
    status: 'running',
    rxBytes: 3072000000,
    txBytes: 1536000000,
    rxPackets: 3500000,
    txPackets: 2800000,
    macAddress: '4A:A9:8A:12:34:5A',
  },
];

export const MOCK_ACTIVE_CONNECTIONS: ActiveConnection[] = [
  {
    protocol: 'tcp',
    srcAddress: '192.168.88.10',
    dstAddress: '8.8.8.8',
    srcPort: 54321,
    dstPort: 443,
    state: 'established',
    timeout: '23h59m',
  },
  {
    protocol: 'tcp',
    srcAddress: '192.168.88.15',
    dstAddress: '1.1.1.1',
    srcPort: 49152,
    dstPort: 80,
    state: 'established',
    timeout: '23h58m',
  },
  {
    protocol: 'udp',
    srcAddress: '192.168.88.20',
    dstAddress: '8.8.4.4',
    srcPort: 53,
    dstPort: 53,
    state: 'unreplied',
    timeout: '30s',
  },
  {
    protocol: 'tcp',
    srcAddress: '192.168.88.25',
    dstAddress: '142.250.185.46',
    srcPort: 55123,
    dstPort: 443,
    state: 'time-wait',
    timeout: '2m',
  },
  {
    protocol: 'tcp',
    srcAddress: '192.168.88.30',
    dstAddress: '104.16.132.229',
    srcPort: 60001,
    dstPort: 443,
    state: 'established',
    timeout: '23h57m',
  },
];

export const MOCK_TRAFFIC_STATS: TrafficStats = {
  rxRate: 1250000,
  txRate: 850000,
  totalRx: 5120000000,
  totalTx: 2560000000,
  currentRxRate: 1250000,
  currentTxRate: 850000,
  latency: '15ms',
  jitter: '2ms',
};

export const generateCPUHistory = (): CPUHistory[] => {
  const now = Date.now();
  const history: CPUHistory[] = [];
  for (let i = 29; i >= 0; i--) {
    history.push({
      timestamp: now - i * 2000,
      value: Math.floor(Math.random() * 30) + 15,
    });
  }
  return history;
};

export const generateMemoryHistory = (): MemoryHistory[] => {
  const now = Date.now();
  const history: MemoryHistory[] = [];
  for (let i = 29; i >= 0; i--) {
    history.push({
      timestamp: now - i * 2000,
      value: Math.floor(Math.random() * 20) + 35,
    });
  }
  return history;
};

export const REFRESH_INTERVAL = 5000;
