import React from 'react';
import { FinancialInputs, AccountBalance, InvestmentOption } from '../types/financial';
import { calculateRecommendedSavings, calculateAccountProgress, formatCurrency, formatPercentage } from '../utils/calculations';
import { CheckCircle, AlertTriangle, TrendingUp, Target } from 'lucide-react';

interface ResultsSectionProps {
  inputs: FinancialInputs;
  accounts: AccountBalance[];
  projections: InvestmentOption[];
}

export function ResultsSection({ inputs, accounts, projections }: ResultsSectionProps) {
  const recommendations = calculateRecommendedSavings(inputs);
  const progress = calculateAccountProgress(accounts, inputs.goalAmount);
  const etfProjection = projections.find(p => p.name.includes('ETF'));
  const finalProjectedValue = etfProjection?.projections[etfProjection.projections.length - 1]?.value || 0;
  
  const isOnTrack = finalProjectedValue >= inputs.goalAmount;
  const shortfall = inputs.goalAmount - finalProjectedValue;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Projected Total</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(finalProjectedValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Target Goal</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(inputs.goalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Savings</p>
              <p className="text-xl font-bold text-purple-600">{formatCurrency(recommendations.recommendedMonthlySave)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Years to Goal</p>
              <p className="text-xl font-bold text-orange-600">{recommendations.yearsToSave}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Goal Progress</h3>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Current Progress</span>
            <span className="text-sm font-medium text-gray-800">
              {formatCurrency(progress.totalSaved)} / {formatCurrency(inputs.goalAmount)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress.progressPercentage, 100)}%` }}
            />
          </div>
          <div className="text-center mt-2">
            <span className="text-lg font-bold text-gray-800">{progress.progressPercentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      <div className={`rounded-xl p-6 ${isOnTrack ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <div className="flex items-start space-x-3">
          {isOnTrack ? (
            <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
          )}
          <div className="flex-1">
            <h3 className={`text-lg font-semibold mb-2 ${isOnTrack ? 'text-green-800' : 'text-red-800'}`}>
              {isOnTrack ? '✅ You\'re on track!' : '⚠️ Goal at risk'}
            </h3>
            <div className="space-y-2 text-sm">
              <p className={isOnTrack ? 'text-green-700' : 'text-red-700'}>
                {isOnTrack 
                  ? `Your projected ETF returns of ${formatCurrency(finalProjectedValue)} will exceed your goal by ${formatCurrency(finalProjectedValue - inputs.goalAmount)}.`
                  : `You're currently ${formatCurrency(shortfall)} short of your goal based on current projections.`
                }
              </p>
              <p className="text-gray-600">
                <strong>Recommended monthly savings:</strong> {formatCurrency(recommendations.recommendedMonthlySave)} 
                ({formatPercentage(inputs.incomeSavingRate)} of ${formatCurrency(inputs.monthlyIncome)})
              </p>
              <p className="text-gray-600">
                <strong>Tax rate:</strong> {formatPercentage(inputs.taxRate)} | 
                <strong> Inflation rate:</strong> {formatPercentage(inputs.inflationRate)}
              </p>
              {!isOnTrack && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-800 font-medium">💡 Suggestions to get back on track:</p>
                  <ul className="list-disc list-inside text-yellow-700 text-sm mt-1 space-y-1">
                    <li>Increase monthly savings rate to {formatPercentage(inputs.incomeSavingRate + 0.05)}</li>
                    <li>Consider more aggressive investment options</li>
                    <li>Extend your target timeline by 2-3 years</li>
                    <li>Look for additional income sources</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DollarSign({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  );
}