
import { useState, useEffect, useCallback } from 'react';
import { StationData, KPIs, Alert, TrendDataPoint, Severity, OperationalMode, SystemStatus } from '../types';
import { INITIAL_STATION_A, INITIAL_STATION_B, INITIAL_KPIS, INITIAL_ALERTS } from '../constants';

const MAX_TREND_POINTS = 30;

export const useMicrowaveData = () => {
  const [stationA, setStationA] = useState<StationData>(INITIAL_STATION_A);
  const [stationB, setStationB] = useState<StationData>(INITIAL_STATION_B);
  const [kpis, setKpis] = useState<KPIs>(INITIAL_KPIS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [backendStatus, setBackendStatus] = useState<'Connected' | 'Simulating'>('Simulating');
  const [statusLog, setStatusLog] = useState<string[]>(['[INFO] Initializing simulation...']);
  const [aiInsight, setAiInsight] = useState<string>("System nominal. All parameters within tolerance.");

  const addAlert = useCallback((severity: Severity, message: string) => {
    setAlerts(prev => [{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), severity, message }, ...prev].slice(0, 100));
    setStatusLog(prev => [`[${severity.toUpperCase()}] ${message}`, ...prev].slice(0, 100));
  }, []);

  const updateStationData = useCallback(<T extends StationData,>(station: T): T => {
    const newStation = { ...station, environment: { ...station.environment } };

    // Simulate small fluctuations
    newStation.azimuth += (Math.random() - 0.5) * 0.1;
    newStation.elevation += (Math.random() - 0.5) * 0.05;
    newStation.rssi += (Math.random() - 0.5) * 0.5;
    newStation.environment.temperature += (Math.random() - 0.5) * 0.1;
    newStation.environment.windSpeed += (Math.random() - 0.7) * 0.5;
    
    // Clamp values
    if (newStation.environment.windSpeed < 0) newStation.environment.windSpeed = 0;
    newStation.rssi = Math.max(-90, Math.min(-30, newStation.rssi));

    // Simulate events
    if (Math.random() < 0.01) {
        const prevMode = newStation.mode;
        newStation.mode = OperationalMode.MAINT;
        newStation.status = SystemStatus.MAINTENANCE;
        addAlert(Severity.WARN, `Station ${station.id} entered MAINTENANCE mode for scheduled checks.`);
        setTimeout(() => {
            setStationA(prev => prev.id === station.id ? {...prev, mode: prevMode, status: SystemStatus.OK} : prev);
            setStationB(prev => prev.id === station.id ? {...prev, mode: prevMode, status: SystemStatus.OK} : prev);
            addAlert(Severity.INFO, `Station ${station.id} returned to ${prevMode} mode.`);
        }, 10000);
    }
    
    if (newStation.environment.windSpeed > 40 && newStation.rssi < -65) {
        if(newStation.status !== SystemStatus.ERROR){
            newStation.status = SystemStatus.ERROR;
            addAlert(Severity.CRIT, `Station ${station.id}: Critical signal loss due to high wind speed!`);
        }
    } else if (newStation.status === SystemStatus.ERROR && newStation.environment.windSpeed < 35) {
        newStation.status = SystemStatus.OK;
        addAlert(Severity.INFO, `Station ${station.id}: Signal restored as wind speed decreased.`);
    }

    return newStation as T;
  }, [addAlert]);

  useEffect(() => {
    const interval = setInterval(() => {
        setStationA(s => updateStationData(s));
        setStationB(s => updateStationData(s));
        
        setKpis(prev => ({
            ...prev,
            avgSignalQuality: prev.avgSignalQuality + (Math.random() - 0.5) * 0.01,
            realignmentsPerHour: Math.max(0, prev.realignmentsPerHour + (Math.random() - 0.6) * 0.1)
        }));

        setTrendData(prev => {
            const now = new Date();
            const newPoint = {
                time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
                rssi_A: stationA.rssi,
                rssi_B: stationB.rssi,
                windSpeed_A: stationA.environment.windSpeed,
                windSpeed_B: stationB.environment.windSpeed,
            };
            return [...prev, newPoint].slice(-MAX_TREND_POINTS);
        });

    }, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // AI Insight Simulation
    if (stationA.environment.windSpeed > 35 || stationB.environment.windSpeed > 35) {
        setAiInsight("High wind speeds detected. Signal degradation possible. Monitoring alignment vectors.");
    } else if (stationA.rssi < -60 || stationB.rssi < -60) {
        setAiInsight("One or more stations reporting low RSSI. Recommend initiating diagnostic sequence.");
    } else {
        setAiInsight("System nominal. All parameters within tolerance.");
    }
  }, [stationA, stationB]);

  const setStationMode = (id: 'A' | 'B', mode: OperationalMode) => {
    const setter = id === 'A' ? setStationA : setStationB;
    setter(prev => ({ ...prev, mode }));
    addAlert(Severity.INFO, `Station ${id} mode changed to ${mode}.`);
  };

  const updateStationPosition = (id: 'A' | 'B', changes: {azimuth?: number, elevation?: number}) => {
     const setter = id === 'A' ? setStationA : setStationB;
     setter(prev => ({...prev, ...changes}));
  }

  return { stationA, stationB, kpis, alerts, trendData, backendStatus, statusLog, aiInsight, setStationMode, updateStationPosition, addAlert };
};
