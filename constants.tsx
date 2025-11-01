import { StationData, KPIs, Alert, Severity, OperationalMode, SystemStatus } from './types';

export const INITIAL_STATION_A: StationData = {
  id: 'A',
  name: 'Uplink Station Alpha',
  azimuth: 178.5,
  elevation: 22.3,
  rssi: -45.2,
  mode: OperationalMode.AUTO,
  status: SystemStatus.OK,
  environment: {
    temperature: 25.1,
    humidity: 65,
    windSpeed: 10.2,
    pressure: 1012,
    rainRate: 0,
  },
};

export const INITIAL_STATION_B: StationData = {
  id: 'B',
  name: 'Downlink Station Bravo',
  azimuth: 358.5,
  elevation: 22.3,
  rssi: -44.8,
  mode: OperationalMode.AUTO,
  status: SystemStatus.OK,
  environment: {
    temperature: 24.9,
    humidity: 67,
    windSpeed: 12.5,
    pressure: 1012,
    rainRate: 0,
  },
};

export const INITIAL_KPIS: KPIs = {
  avgSignalQuality: 98.7,
  realignmentsPerHour: 0.2,
  downtimeReduction: 99.98,
  powerUsage: 1.21,
};

export const INITIAL_ALERTS: Alert[] = [
  { id: 1, timestamp: new Date().toLocaleTimeString(), severity: Severity.INFO, message: 'System initialized and all services are running.' },
  { id: 2, timestamp: new Date().toLocaleTimeString(), severity: Severity.INFO, message: 'Connection to Station B established.' },
  { id: 3, timestamp: new Date().toLocaleTimeString(), severity: Severity.INFO, message: 'Connection to Station A established.' },
];

export const SEVERITY_COLORS = {
  [Severity.CRIT]: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200' },
  [Severity.WARN]: { bg: 'bg-yellow-100 dark:bg-yellow-800/50', text: 'text-yellow-800 dark:text-yellow-200' },
  [Severity.INFO]: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200' },
};
