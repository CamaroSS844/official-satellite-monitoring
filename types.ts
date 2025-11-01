
export enum OperationalMode {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
  MAINT = 'MAINT',
  ERROR = 'ERROR',
}

export enum SystemStatus {
  OK = 'OK',
  MAINTENANCE = 'Maintenance',
  ERROR = 'Error',
}

export enum Severity {
  INFO = 'Info',
  WARN = 'Warning',
  CRIT = 'Critical',
}

export interface EnvironmentalData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  rainRate: number;
}

export interface StationData {
  id: 'A' | 'B';
  name: string;
  azimuth: number;
  elevation: number;
  rssi: number;
  mode: OperationalMode;
  status: SystemStatus;
  environment: EnvironmentalData;
}

export interface Alert {
  id: number;
  timestamp: string;
  severity: Severity;
  message: string;
}

export interface KPIs {
  avgSignalQuality: number;
  realignmentsPerHour: number;
  downtimeReduction: number;
  powerUsage: number;
}

export interface TrendDataPoint {
  time: string;
  rssi_A: number;
  rssi_B: number;
  windSpeed_A: number;
  windSpeed_B: number;
}
