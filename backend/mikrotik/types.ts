export interface SystemStats {
  cpuLoad: number;
  memoryUsage: number;
  uptime: string;
  temperature: number;
  version: string;
}

export interface NetworkInterface {
  name: string;
  type: string;
  status: 'up' | 'down';
  rxRate: number;
  txRate: number;
  rxBytes: number;
  txBytes: number;
}

export interface ActiveConnection {
  protocol: string;
  srcAddress: string;
  dstAddress: string;
  srcPort: number;
  dstPort: number;
  state: string;
  timeout: string;
}

export interface TrafficStats {
  download: number;
  upload: number;
  downloadTotal: number;
  uploadTotal: number;
}

export interface UplinkInfo {
  provider: string;
  connectionType: string;
  ipAddress: string;
}

export interface WanStatus {
  status: 'connected' | 'disconnected' | 'connecting';
  uptime: string;
}

export interface LteStatus {
  operator: string;
  technology: string;
  band: string;
  signalStrength: number;
}

export interface SignalStrength {
  rssi: number;
  rsrp: number;
  rsrq: number;
  sinr: number;
}

export interface PingResult {
  host: string;
  packetsSent: number;
  packetsReceived: number;
  packetLoss: number;
  minRtt: number;
  avgRtt: number;
  maxRtt: number;
}

export interface SmsMessage {
  id: string;
  phoneNumber: string;
  message: string;
  timestamp: string;
  status: 'read' | 'unread';
}

export interface Backup {
  name: string;
  size: number;
  date: string;
}

export interface DashboardData {
  systemStats: SystemStats;
  interfaces: NetworkInterface[];
  connections: ActiveConnection[];
  trafficStats: TrafficStats;
  uplinkInfo: UplinkInfo;
  wanStatus: WanStatus;
  lteStatus: LteStatus;
  signalStrength: SignalStrength;
  pingResult: PingResult;
  smsMessages: SmsMessage[];
  backups: Backup[];
}
