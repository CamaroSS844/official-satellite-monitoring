
import React from 'react';
import Card, { CardHeader, CardTitle } from './common/Card';
import { StationData } from '../types';
import { Icon } from './common/Icon';

interface EnvironmentalPanelProps {
  stationA: StationData;
  stationB: StationData;
}

const WeatherDataPoint: React.FC<{ icon: string; label: string; valueA: string; valueB: string; severity?: 'green' | 'yellow' | 'red' }> = ({ icon, label, valueA, valueB, severity = 'green' }) => {
  const severityClasses = {
    green: 'text-accent-green',
    yellow: 'text-accent-yellow',
    red: 'text-accent-red',
  };
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center">
        <Icon name={icon} className={`w-5 h-5 mr-2 ${severityClasses[severity]}`} />
        <span className="text-text-light-secondary dark:text-text-dark-secondary">{label}</span>
      </div>
      <div className="font-semibold text-right">
        <span>{valueA}</span> / <span>{valueB}</span>
      </div>
    </div>
  );
}

const EnvironmentalPanel: React.FC<EnvironmentalPanelProps> = ({ stationA, stationB }) => {
    const getWindSeverity = (speed: number) => {
        if (speed > 35) return 'red';
        if (speed > 25) return 'yellow';
        return 'green';
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental</CardTitle>
        <div className="text-xs text-text-light-secondary dark:text-text-dark-secondary">STA A / STA B</div>
      </CardHeader>
      <div className="space-y-3">
        <WeatherDataPoint icon="temperature" label="Temp" valueA={`${stationA.environment.temperature.toFixed(1)}°C`} valueB={`${stationB.environment.temperature.toFixed(1)}°C`} />
        <WeatherDataPoint icon="wind" label="Wind" valueA={`${stationA.environment.windSpeed.toFixed(1)} km/h`} valueB={`${stationB.environment.windSpeed.toFixed(1)} km/h`} severity={getWindSeverity(Math.max(stationA.environment.windSpeed, stationB.environment.windSpeed))} />
        <WeatherDataPoint icon="rain" label="Rain" valueA={`${stationA.environment.rainRate.toFixed(1)} mm/h`} valueB={`${stationB.environment.rainRate.toFixed(1)} mm/h`} />
        <WeatherDataPoint icon="humidity" label="Humidity" valueA={`${stationA.environment.humidity}%`} valueB={`${stationB.environment.humidity}%`} />
        <WeatherDataPoint icon="pressure" label="Pressure" valueA={`${stationA.environment.pressure} hPa`} valueB={`${stationB.environment.pressure} hPa`} />
      </div>
    </Card>
  );
};

export default EnvironmentalPanel;
