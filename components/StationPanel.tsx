import React from 'react';
import { StationData, OperationalMode, SystemStatus } from '../types';
import Card, { CardHeader, CardTitle } from './common/Card';
import Gauge from './Gauge';

interface StationPanelProps {
  station: StationData;
  setMode: (mode: OperationalMode) => void;
  updatePosition: (changes: { azimuth?: number; elevation?: number }) => void;
}

const getStatusColor = (status: SystemStatus) => {
  switch (status) {
    case SystemStatus.OK:
      return 'text-accent-green';
    case SystemStatus.MAINTENANCE:
      return 'text-accent-yellow';
    case SystemStatus.ERROR:
      return 'text-accent-red';
    default:
      return 'text-gray-500';
  }
};

const getRssiColor = (rssi: number) => {
  if (rssi > -50) return 'text-accent-green';
  if (rssi > -65) return 'text-accent-yellow';
  return 'text-accent-red';
};

const StationPanel: React.FC<StationPanelProps> = ({ station, setMode, updatePosition }) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'azimuth' | 'elevation') => {
    if (station.mode === OperationalMode.MANUAL) {
      updatePosition({ [type]: parseFloat(e.target.value) });
    }
  };

  const rssiPercentage = ((station.rssi - -90) / (-30 - -90)) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{station.name}</CardTitle>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center text-sm font-semibold ${getStatusColor(station.status)}`}>
            <span
              className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(station.status).replace('text-', 'bg-')}`}
            ></span>
            {station.status}
          </div>
          <div className={`font-bold text-lg ${getRssiColor(station.rssi)}`}>
            {station.rssi.toFixed(1)} dBm
          </div>
        </div>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gauges */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
          <div className="h-32">
            <Gauge label="Azimuth" value={station.azimuth} max={360} unit="°" isCompass={true} />
          </div>
          <div className="h-32">
            <Gauge label="Elevation" value={station.elevation} max={90} unit="°" />
          </div>
        </div>

        {/* Sliders – visible only in Manual Mode */}
        {station.mode === OperationalMode.MANUAL && (
          <div className="col-span-1 md:col-span-2 mt-2 space-y-3">
            {/* Azimuth Slider */}
            <div className="w-full">
              <label className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                Azimuth
              </label>
              <input
                type="range"
                min="0"
                max="360"
                step="0.1"
                value={station.azimuth}
                onChange={(e) => handleSliderChange(e, 'azimuth')}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Elevation Slider */}
            <div className="w-full">
              <label className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                Elevation
              </label>
              <input
                type="range"
                min="0"
                max="90"
                step="0.1"
                value={station.elevation}
                onChange={(e) => handleSliderChange(e, 'elevation')}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* RSSI Bar */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
                  Signal (RSSI)
                </span>
                <span className="text-lg font-bold text-accent-blue">
                  {station.rssi.toFixed(1)} dBm
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-accent-blue h-2.5 rounded-full"
                  style={{
                    width: `${rssiPercentage}%`,
                    transition: 'width 0.5s ease-in-out',
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Mode Selector */}
        <div className="col-span-1 md:col-span-2 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
          <h3 className="font-semibold mb-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
            Operational Mode
          </h3>
          <div className="flex space-x-2">
            {Object.values(OperationalMode).map((mode) => (
              <button
                key={mode}
                onClick={() => setMode(mode)}
                className={`flex-1 py-1 px-2 text-xs font-semibold rounded-md transition-colors ${
                  station.mode === mode
                    ? 'bg-accent-blue text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StationPanel;
