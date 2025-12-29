import axios from 'axios';
import {
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
} from '@/app/types/mikrotik';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || process.env.EXPO_PUBLIC_RORK_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const mikrotikApi = {
  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await api.get('/api/dashboard');
      console.log('[mikrotikApi] getDashboardData ok', { url: API_BASE_URL });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  async getSystemStats(): Promise<SystemStats> {
    try {
      const response = await api.get('/api/system/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching system stats:', error);
      throw error;
    }
  },

  async getInterfaces(): Promise<NetworkInterface[]> {
    try {
      const response = await api.get('/api/interfaces');
      return response.data;
    } catch (error) {
      console.error('Error fetching interfaces:', error);
      throw error;
    }
  },

  async getConnections(): Promise<ActiveConnection[]> {
    try {
      const response = await api.get('/api/connections');
      return response.data;
    } catch (error) {
      console.error('Error fetching connections:', error);
      throw error;
    }
  },

  async getTrafficStats(): Promise<TrafficStats> {
    try {
      const response = await api.get('/api/traffic');
      return response.data;
    } catch (error) {
      console.error('Error fetching traffic stats:', error);
      throw error;
    }
  },

  async getSignalStrength(): Promise<SignalStrength> {
    try {
      const response = await api.get('/api/signal');
      return response.data;
    } catch (error) {
      console.error('Error fetching signal strength:', error);
      throw error;
    }
  },

  async ping(host: string): Promise<PingResult> {
    try {
      const response = await api.post('/api/ping', { host });
      return response.data;
    } catch (error) {
      console.error('Error pinging host:', error);
      throw error;
    }
  },

  async getSmsMessages(): Promise<SmsMessage[]> {
    try {
      const response = await api.get('/api/sms');
      return response.data;
    } catch (error) {
      console.error('Error fetching SMS messages:', error);
      throw error;
    }
  },

  async sendSms(phoneNumber: string, message: string): Promise<void> {
    try {
      await api.post('/api/sms/send', { phoneNumber, message });
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  },

  async getBackups(): Promise<Backup[]> {
    try {
      const response = await api.get('/api/backups');
      return response.data;
    } catch (error) {
      console.error('Error fetching backups:', error);
      throw error;
    }
  },

  async createBackup(): Promise<void> {
    try {
      await api.post('/api/backups/create');
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  },

  async reboot(): Promise<void> {
    try {
      await api.post('/api/system/reboot');
    } catch (error) {
      console.error('Error rebooting system:', error);
      throw error;
    }
  },
};
