import type {
  ActiveConnection,
  Backup,
  PingResult,
  SignalStrength,
  SystemStats,
  TrafficStats,
  NetworkInterface,
  UplinkInfo,
  WanStatus,
  LteStatus,
  SmsMessage,
} from '@/app/types/mikrotik';
import {
  MOCK_ACTIVE_CONNECTIONS,
  MOCK_BACKUPS,
  MOCK_PING_RESULT,
  MOCK_SIGNAL_STRENGTH,
  MOCK_SYSTEM_STATS,
  MOCK_TRAFFIC_STATS,
  MOCK_NETWORK_INTERFACES,
  MOCK_UPLINK_INFO,
  MOCK_WAN_STATUS,
  MOCK_LTE_STATUS,
  MOCK_SMS_MESSAGES,
} from '@/constants/mikrotik';
import type { DashboardData } from '@/app/services/mikrotik';

const toBool = (v: string | undefined): boolean => {
  if (!v) return false;
  const normalized = v.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
};

const getMikrotikConfig = () => {
  const host = process.env.MIKROTIK_HOST;
  const user = process.env.MIKROTIK_USER;
  const password = process.env.MIKROTIK_PASSWORD;
  const portRaw = process.env.MIKROTIK_PORT;
  const port = portRaw ? Number(portRaw) : 8729;

  const tlsInsecure = toBool(process.env.MIKROTIK_TLS_INSECURE);
  const tlsCaPem = process.env.MIKROTIK_TLS_CA_PEM;

  return {
    host,
    user,
    password,
    port,
    tlsInsecure,
    tlsCaPem,
  };
};

export const routerosService = {
  async getDashboardData(): Promise<DashboardData> {
    const config = getMikrotikConfig();
    console.log('[routerosService] getDashboardData config:', {
      host: config.host,
      port: config.port,
      tlsInsecure: config.tlsInsecure,
      hasCaPem: Boolean(config.tlsCaPem),
      hasUser: Boolean(config.user),
      hasPassword: Boolean(config.password),
    });

    return {
      systemStats: MOCK_SYSTEM_STATS,
      interfaces: MOCK_NETWORK_INTERFACES,
      connections: MOCK_ACTIVE_CONNECTIONS,
      trafficStats: MOCK_TRAFFIC_STATS,
      uplinkInfo: MOCK_UPLINK_INFO,
      wanStatus: MOCK_WAN_STATUS,
      lteStatus: MOCK_LTE_STATUS,
      signalStrength: MOCK_SIGNAL_STRENGTH,
      pingResult: MOCK_PING_RESULT,
      smsMessages: MOCK_SMS_MESSAGES,
      backups: MOCK_BACKUPS,
    };
  },

  async getSystemStats(): Promise<SystemStats> {
    return MOCK_SYSTEM_STATS;
  },

  async reboot(): Promise<{ ok: true }> {
    console.log('[routerosService] reboot requested');
    return { ok: true };
  },

  async getInterfaces(): Promise<NetworkInterface[]> {
    return MOCK_NETWORK_INTERFACES;
  },

  async getConnections(): Promise<ActiveConnection[]> {
    return MOCK_ACTIVE_CONNECTIONS;
  },

  async getTrafficStats(): Promise<TrafficStats> {
    return MOCK_TRAFFIC_STATS;
  },

  async getUplinkInfo(): Promise<UplinkInfo> {
    return MOCK_UPLINK_INFO;
  },

  async getWanStatus(): Promise<WanStatus> {
    return MOCK_WAN_STATUS;
  },

  async getLteStatus(): Promise<LteStatus> {
    return MOCK_LTE_STATUS;
  },

  async getSignalStrength(): Promise<SignalStrength> {
    return MOCK_SIGNAL_STRENGTH;
  },

  async ping(host: string): Promise<PingResult> {
    return { ...MOCK_PING_RESULT, host };
  },

  async getSmsMessages(): Promise<SmsMessage[]> {
    return MOCK_SMS_MESSAGES;
  },

  async sendSms(phoneNumber: string, message: string): Promise<{ ok: true }> {
    console.log('[routerosService] sendSms:', { phoneNumber, messageLength: message.length });
    return { ok: true };
  },

  async getBackups(): Promise<Backup[]> {
    return MOCK_BACKUPS;
  },

  async createBackup(): Promise<{ ok: true }> {
    console.log('[routerosService] createBackup requested');
    return { ok: true };
  },
};
