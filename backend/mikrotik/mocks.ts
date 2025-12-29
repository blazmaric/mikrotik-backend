import type {
  SystemStats,
  NetworkInterface,
  ActiveConnection,
  TrafficStats,
  UplinkInfo,
  WanStatus,
  LteStatus,
  SignalStrength,
  PingResult,
  SmsMessage,
  Backup,
} from './types';

export const MOCK_SYSTEM_STATS: SystemStats = {
  cpuLoad: 45,
  memoryUsage: 62,
  uptime: '15d 7h 23m',
  temperature: 52,
  version: 'RouterOS 7.13.5',
};

export const MOCK_NETWORK_INTERFACES: NetworkInterface[] = [
  {
    name: 'ether1-wan',
    type: 'ethernet',
    status: 'up',
    rxRate: 12500000,
    txRate: 3200000,
    rxBytes: 5234567890,
    txBytes: 1234567890,
  },
  {
    name: 'lte1',
    type: 'lte',
    status: 'up',
    rxRate: 8500000,
    txRate: 2100000,
    rxBytes: 3234567890,
    txBytes: 834567890,
  },
  {
    name: 'bridge-lan',
    type: 'bridge',
    status: 'up',
    rxRate: 45000000,
    txRate: 23000000,
    rxBytes: 15234567890,
    txBytes: 8234567890,
  },
];

export const MOCK_ACTIVE_CONNECTIONS: ActiveConnection[] = [
  {
    protocol: 'tcp',
    srcAddress: '192.168.88.10',
    dstAddress: '142.250.185.78',
    srcPort: 54321,
    dstPort: 443,
    state: 'established',
    timeout: '23h59m',
  },
  {
    protocol: 'udp',
    srcAddress: '192.168.88.15',
    dstAddress: '8.8.8.8',
    srcPort: 62345,
    dstPort: 53,
    state: 'established',
    timeout: '10s',
  },
];

export const MOCK_TRAFFIC_STATS: TrafficStats = {
  download: 125000000,
  upload: 32000000,
  downloadTotal: 523456789012,
  uploadTotal: 123456789012,
};

export const MOCK_UPLINK_INFO: UplinkInfo = {
  provider: 'A1 Slovenija',
  connectionType: 'LTE',
  ipAddress: '93.103.45.123',
};

export const MOCK_WAN_STATUS: WanStatus = {
  status: 'connected',
  uptime: '15d 7h 23m',
};

export const MOCK_LTE_STATUS: LteStatus = {
  operator: 'A1 SI',
  technology: 'LTE',
  band: 'B3 (1800 MHz)',
  signalStrength: -72,
};

export const MOCK_SIGNAL_STRENGTH: SignalStrength = {
  rssi: -72,
  rsrp: -95,
  rsrq: -12,
  sinr: 8,
};

export const MOCK_PING_RESULT: PingResult = {
  host: '8.8.8.8',
  packetsSent: 4,
  packetsReceived: 4,
  packetLoss: 0,
  minRtt: 12.5,
  avgRtt: 15.2,
  maxRtt: 18.7,
};

export const MOCK_SMS_MESSAGES: SmsMessage[] = [
  {
    id: '1',
    phoneNumber: '+38640123456',
    message: 'System reboot scheduled for tonight at 02:00',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'read',
  },
  {
    id: '2',
    phoneNumber: '+38640789012',
    message: 'Monthly data limit warning: 80% used',
    timestamp: '2024-01-15T09:15:00Z',
    status: 'unread',
  },
];

export const MOCK_BACKUPS: Backup[] = [
  {
    name: 'auto-backup-2024-01-15.backup',
    size: 2458624,
    date: '2024-01-15T02:00:00Z',
  },
  {
    name: 'manual-backup-2024-01-10.backup',
    size: 2445312,
    date: '2024-01-10T15:30:00Z',
  },
];
