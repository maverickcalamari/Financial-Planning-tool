import React from 'react';
import { X, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

interface KPIDetailPanelProps {
  kpiId: string;
  kpi: {
    id: string;
    label: string;
    value: number;
    delta30: number;
    delta90: number;
    sparklineData: number[];
    format: 'currency' | 'percentage' | 'number';
    color: string;
  };
  onClose: () => void;
}

export function KPIDetailPanel({ kpiId, kpi, onClose }: KPIDetailPanelProps) {
  const getRecommendations = (kpiId: string) => {
    switch (kpiId) {
      case 'totalBalance':
        return [
          { text: 'Consider increasing monthly contributions by $200', impact: '+$2,400 annually', priority: 'high' },
          { text: 'Rebalance portfolio to 70/30 stocks/bonds', impact: '+0.5% expected return', priority: 'medium' },
          { text: 'Set up automatic transfers on payday', impact: 'Consistency boost', priority: 'low' }
        ];
      case 'goalProgress':
        return [
          { text: 'Increase savings rate from 20% to 25%', impact: '+5 months ahead of schedule', priority: 'high' },
          { text: 'Consider side income opportunities', impact: '+$500-1000/month potential', priority: 'medium' }
        ];
      default:
        return [
          { text: 'Review and optimize current strategy', impact: 'Varies', priority: 'medium' }
        ];
    }
  };

  const recommendations = getRecommendations(kpiId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
      <div className="bg-surface w-96 h-full shadow-2xl overflow-y-auto">
        <div className="p-6 border-b border-muted">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">{kpi.label} Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-alt rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Value */}
          <div className="text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: kpi.color }}>
              {kpi.format === 'currency' ? formatCurrency(kpi.value) : kpi.value.toLocaleString()}
            </div>
            <div className="text-sm text-secondary">Current Value</div>
          </div>

          {/* Trend Chart */}
          <div className="bg-surface-alt rounded-lg p-4">
            <h3 className="text-sm font-medium text-primary mb-3">90-Day Trend</h3>
            <div className="h-32 flex items-end justify-between space-x-1">
              {kpi.sparklineData.map((value, index) => {
                const height = (value / Math.max(...kpi.sparklineData)) * 100;
                return (
                  <div
                    key={index}
                    className="bg-accent-primary rounded-t"
                    style={{ 
                      height: `${height}%`,
                      width: `${100 / kpi.sparklineData.length - 2}%`,
                      backgroundColor: kpi.color,
                      opacity: 0.7
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-alt rounded-lg p-3">
              <div className="text-sm text-secondary">30-Day Change</div>
              <div className={`text-lg font-semibold ${kpi.delta30 >= 0 ? 'text-success' : 'text-danger'}`}>
                {kpi.delta30 >= 0 ? '+' : ''}{kpi.delta30.toFixed(1)}%
              </div>
            </div>
            <div className="bg-surface-alt rounded-lg p-3">
              <div className="text-sm text-secondary">90-Day Change</div>
              <div className={`text-lg font-semibold ${kpi.delta90 >= 0 ? 'text-success' : 'text-danger'}`}>
                {kpi.delta90 >= 0 ? '+' : ''}{kpi.delta90.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-sm font-medium text-primary mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Recommended Actions
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-surface-alt rounded-lg p-3">
                  <div className="flex items-start space-x-3">
                    <div className={`p-1 rounded-full mt-0.5 ${
                      rec.priority === 'high' ? 'bg-danger' : 
                      rec.priority === 'medium' ? 'bg-warning' : 'bg-success'
                    }`}>
                      {rec.priority === 'high' ? (
                        <AlertCircle className="w-3 h-3 text-white" />
                      ) : (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-primary font-medium">{rec.text}</div>
                      <div className="text-xs text-secondary mt-1">Expected impact: {rec.impact}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button className="w-full btn-primary py-2 px-4 text-sm">
              Apply Recommendation
            </button>
            <button className="w-full bg-surface-alt text-primary py-2 px-4 rounded-lg text-sm hover:bg-border-muted transition-colors">
              Schedule Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}