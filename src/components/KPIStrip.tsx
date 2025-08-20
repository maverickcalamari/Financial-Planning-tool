import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Shield, Calendar } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/calculations';
import { KPIDetailPanel } from './KPIDetailPanel';

interface KPIData {
  id: string;
  label: string;
  value: number;
  delta30: number;
  delta90: number;
  sparklineData: number[];
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

  const renderSparkline = (data: number[], color: string) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 16;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="60" height="20" className="opacity-60">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const renderDelta = (delta: number) => {
    const isPositive = delta >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
    
    return (
      <div className={`flex items-center space-x-1 ${colorClass}`}>
        <Icon className="w-3 h-3" />
        <span className="text-xs font-medium">
          {Math.abs(delta).toFixed(1)}%
        </span>
      </div>
    );
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
              className="card card-hover p-4 text-left h-24 flex flex-col justify-between group focus:outline-none"
              style={{ minHeight: '96px' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-kpi-label mb-1">{kpi.label}</div>
                  <div className="text-kpi" style={{ color: kpi.color }}>
                    {formatValue(kpi.value, kpi.format)}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Icon className="w-4 h-4 text-gray-400" />
                  {renderSparkline(kpi.sparklineData, kpi.color)}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex space-x-3">
                  <div className="text-xs text-gray-400">
                    30d {renderDelta(kpi.delta30)}
                  </div>
                  <div className="text-xs text-gray-400">
                    90d {renderDelta(kpi.delta90)}
                  </div>
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