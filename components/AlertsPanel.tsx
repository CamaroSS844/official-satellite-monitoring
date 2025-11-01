
import React from 'react';
import Card, { CardHeader, CardTitle } from './common/Card';
import { Alert } from '../types';
import { SEVERITY_COLORS } from '../constants';

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
    
  const exportToCSV = () => {
    const headers = "ID,Timestamp,Severity,Message\n";
    const csvContent = alerts.map(a => 
      `${a.id},${a.timestamp},${a.severity},"${a.message.replace(/"/g, '""')}"`
    ).join("\n");

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "microwave_alerts.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Alerts & Notifications</CardTitle>
        <button onClick={exportToCSV} className="text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 px-2 py-1 rounded">
          Export CSV
        </button>
      </CardHeader>
      <div className="overflow-y-auto h-48 pr-2 space-y-2">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-2 rounded-md flex items-start ${SEVERITY_COLORS[alert.severity].bg} ${SEVERITY_COLORS[alert.severity].text}`}>
            <div className="flex-shrink-0 w-16 text-xs opacity-80">{alert.timestamp}</div>
            <div className="flex-grow pl-2 border-l border-current border-opacity-30">
                <span className={`font-bold text-xs uppercase mr-2`}>[{alert.severity}]</span>
                <span className="text-sm">{alert.message}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AlertsPanel;
