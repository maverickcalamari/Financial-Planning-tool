import { X, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

interface KPIDetailPanelProps {
  kpiId: string;
  kpi: {
    id: string;
    label: string;
    value: number;
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
      <div className="bg-white dark:bg-gray-800 w-96 h-full shadow-2xl overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{kpi.label} Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Value */}
          <div className="text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: kpi.color }}>
              {kpi.format === 'currency' ? formatCurrency(kpi.value) : kpi.value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Value</div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Recommended Actions
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-start space-x-3">
                    <div className={`p-1 rounded-full mt-0.5 ${
                      rec.priority === 'high' ? 'bg-red-500' : 
                      rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      {rec.priority === 'high' ? (
                        <AlertCircle className="w-3 h-3 text-white" />
                      ) : (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 dark:text-white font-medium">{rec.text}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Expected impact: {rec.impact}</div>
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
            <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Schedule Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
