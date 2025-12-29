export interface SystemStats {
  cpu: number;
  memory: number;
  uptime: string;
  version: string;
  boardName: string;
  publicIp: string;
}

export interface UplinkInfo {
  gatewayName: string;
  gatewayDescription: string;
}

export interface WanStatus {
  wifiStatus: string;
  ssid: string;
  ipAddress: string;
}

export interface LteStatus {
  status: string;
  operator: string;
  ipAddress: string;
}

export interface SignalStrength {
  rsrp: string;
  rsrq: string;
  rssi: string;
  sinr: string;
}

export interface NetworkInterface {
  name: string;
  type: string;
  status: 'running' | 'disabled' | 'down';
  rxBytes: number;
  txBytes: number;
  rxPackets: number;
  txPackets: number;
  macAddress: string;
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
  rxRate: number;
  txRate: number;
  totalRx: number;
  totalTx: number;
  currentRxRate: number;
  currentTxRate: number;
  latency: string;
  jitter: string;
}

export interface PingResult {
  host: string;
  sent: number;
  received: number;
  packetLoss: string;
  minTime: string;
  avgTime: string;
  maxTime: string;
}

export interface SmsMessage {
  sender: string;
  time: string;
  message: string;
}

export interface Backup {
  name: string;
  size: string;
  date: string;
}

export interface CPUHistory {
  timestamp: number;
  value: number;
}

export interface MemoryHistory {
  timestamp: number;
  value: number;
}
