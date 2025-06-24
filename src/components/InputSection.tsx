import React from 'react';
import { FinancialInputs } from '../types/financial';
import { formatPercentage } from '../utils/calculations';

interface InputSectionProps {
  inputs: FinancialInputs;
  onInputChange: (field: keyof FinancialInputs, value: number) => void;
}

export function InputSection({ inputs, onInputChange }: InputSectionProps) {
  const inputFields = [
    { key: 'goalAmount' as const, label: 'Financial Goal', type: 'currency', min: 1000, max: 10000000, step: 1000, icon: '🎯' },
    { key: 'currentAge' as const, label: 'Current Age', type: 'number', min: 18, max: 65, step: 1, icon: '👤' },
    { key: 'targetAge' as const, label: 'Target Age', type: 'number', min: 25, max: 80, step: 1, icon: '📅' },
    { key: 'initialInvestment' as const, label: 'Initial Investment', type: 'currency', min: 0, max: 1000000, step: 100, icon: '💰' },
    { key: 'monthlyIncome' as const, label: 'Monthly Income', type: 'currency', min: 1000, max: 100000, step: 100, icon: '💵' },
  ];

  const percentageFields = [
    { key: 'incomeSavingRate' as const, label: 'Savings Rate', min: 0.05, max: 0.5, step: 0.01, icon: '📊' },
    { key: 'growthRate' as const, label: 'Income Growth', min: 0, max: 0.1, step: 0.005, icon: '📈' },
    { key: 'inflationRate' as const, label: 'Inflation Rate', min: 0, max: 0.05, step: 0.005, icon: '📉' },
    { key: 'taxRate' as const, label: 'Tax Rate', min: 0, max: 0.4, step: 0.01, icon: '🏛️' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Financial Parameters</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-700 flex items-center space-x-2">
            <span>💼</span>
            <span>Basic Information</span>
          </h3>
          {inputFields.map(field => (
            <div key={field.key} className="space-y-3">
              <label className="block text-sm font-medium text-gray-600 flex items-center space-x-2">
                <span>{field.icon}</span>
                <span>{field.label}</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs[field.key]}
                  onChange={(e) => onInputChange(field.key, Number(e.target.value))}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
                {field.type === 'currency' && (
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">$</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-700 flex items-center space-x-2">
            <span>⚙️</span>
            <span>Rates & Assumptions</span>
          </h3>
          {percentageFields.map(field => (
            <div key={field.key} className="space-y-3">
              <label className="block text-sm font-medium text-gray-600 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>{field.icon}</span>
                  <span>{field.label}</span>
                </div>
                <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-lg">
                  {formatPercentage(inputs[field.key])}
                </span>
              </label>
              <div className="relative">
                <input
                  type="range"
                  value={inputs[field.key]}
                  onChange={(e) => onInputChange(field.key, Number(e.target.value))}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  className="w-full h-3 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatPercentage(field.min)}</span>
                  <span>{formatPercentage(field.max)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}