import React from 'react';
import { useMicrowaveData } from './hooks/useMicrowaveData';
import Header from './components/Header';
import StationPanel from './components/StationPanel';
import SystemOverviewPanel from './components/SystemOverviewPanel';
import EnvironmentalPanel from './components/EnvironmentalPanel';
import TrendsPanel from './components/TrendsPanel';
import AlertsPanel from './components/AlertsPanel';
import KpiPanel from './components/KpiPanel';
import ManualControlPanel from './components/ManualControlPanel';
import { useTheme } from './hooks/useTheme';
import { OperationalMode, Severity } from './types';

const App: React.FC = () => {
  const [theme, toggleTheme] = useTheme();
  const { 
    stationA, 
    stationB, 
    kpis, 
    alerts, 
    trendData, 
    backendStatus, 
    statusLog, 
    aiInsight,
    setStationMode,
    updateStationPosition,
    addAlert
  } = useMicrowaveData();

  const handleSetMode = (id: 'A' | 'B', mode: OperationalMode) => {
    if (mode === OperationalMode.MANUAL) {
      addAlert(Severity.WARN, `Manual control enabled for Station ${id}. AUTO alignment suspended.`);
    }
    setStationMode(id, mode);
  }

  return (
    <div className={`min-h-screen text-text-light-primary dark:text-text-dark-primary p-4 transition-colors duration-300`}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="grid grid-cols-12 gap-4 mt-4">
        {/* Top Row: Stations */}
        <div className="col-span-12 lg:col-span-6">
          {/* Fix: Corrected typo from `updatePosition` to `updateStationPosition`. */}
          <StationPanel station={stationA} setMode={(mode) => handleSetMode('A', mode)} updatePosition={(changes) => updateStationPosition('A', changes)} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          {/* Fix: Corrected typo from `updatePosition` to `updateStationPosition`. */}
          <StationPanel station={stationB} setMode={(mode) => handleSetMode('B', mode)} updatePosition={(changes) => updateStationPosition('B', changes)} />
        </div>

        {/* Second Row: Main Content */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
        <AlertsPanel alerts={alerts} />
          <TrendsPanel data={trendData} aiInsight={aiInsight} />
        </div>
        
        <div className="col-span-12 lg:col-span-3 space-y-4">
           <SystemOverviewPanel backendStatus={backendStatus} statusLog={statusLog} />
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-4">
          <EnvironmentalPanel stationA={stationA} stationB={stationB} />
          <KpiPanel kpis={kpis} />
        </div>
      </main>
    </div>
  );
};

export default App;