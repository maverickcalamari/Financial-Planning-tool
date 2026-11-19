import React, { useState } from 'react';
import { formatCurrency, formatPercentage } from '../utils/calculations';
import { KPIDetailPanel } from './KPIDetailPanel';

interface KPIData {
  id: string;
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  format: 'currency' | 'percentage' | 'number';
  color: string;
}

interface KPIStripProps {
  kpis: KPIData[];
  onKPIClick?: (kpiId: string) => void;
}

export function KPIStrip({ kpis, onKPIClick }: KPIStripProps) {
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);

  const handleKPIClick = (kpiId: string) => {
    setSelectedKPI(kpiId);
    onKPIClick?.(kpiId);
  };

  const formatValue = (value: number, format: KPIData['format']) => {
    switch (format) {
      case 'currency': return formatCurrency(value);
      case 'percentage': return formatPercentage(value / 100);
      case 'number': return value.toLocaleString();
      default: return value.toString();
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <button
              key={kpi.id}
              onClick={() => handleKPIClick(kpi.id)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 card-hover p-2 sm:p-4 text-left min-h-24 flex flex-col justify-between group focus:outline-none"
              style={{ minHeight: '96px' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-kpi-label mb-1 text-gray-600 dark:text-gray-400">{kpi.label}</div>
                  <div className="text-kpi" style={{ color: kpi.color }}>
                    {formatValue(kpi.value, kpi.format)}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Icon className="hidden sm:block w-4 h-4 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
              
            </button>
          );
        })}
      </div>

      {selectedKPI && (
        <KPIDetailPanel
          kpiId={selectedKPI}
          kpi={kpis.find(k => k.id === selectedKPI)!}
          onClose={() => setSelectedKPI(null)}
        />
      )}
    </>
  );
}
