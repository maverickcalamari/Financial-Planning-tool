import React from 'react';
import { FinancialInputs, AccountBalance, InvestmentOption, ExportData } from '../types/financial';
import { exportToCSV, exportToJSON, calculateAccountProgress, formatCurrency } from '../utils/calculations';
import { Download, FileText, Database } from 'lucide-react';

interface ExportSectionProps {
  inputs: FinancialInputs;
  accounts: AccountBalance[];
  projections: InvestmentOption[];
}

export function ExportSection({ inputs, accounts, projections }: ExportSectionProps) {
  const handleExport = (format: 'csv' | 'json') => {
    const progress = calculateAccountProgress(accounts, inputs.goalAmount);
    const bestProjection = projections.find(p => p.name.includes('Index Fund')) || projections[0];
    const finalValue = bestProjection.projections[bestProjection.projections.length - 1]?.value || 0;
    
    const exportData: ExportData = {
      inputs,
      accounts,
      projections,
      summary: {
        totalCurrentSavings: progress.totalSaved,
        projectedValue: finalValue,
        monthlyRequired: inputs.monthlyIncome * inputs.incomeSavingRate,
        yearsToGoal: inputs.targetAge - inputs.currentAge,
        onTrack: finalValue >= inputs.goalAmount
      },
      generatedAt: new Date().toISOString()
    };

    if (format === 'csv') {
      exportToCSV(exportData);
    } else {
      exportToJSON(exportData);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Export Financial Plan</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Download your complete financial analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleExport('csv')}
          className="flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
        >
          <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500 group-hover:text-blue-500" />
          <div className="text-left">
            <p className="font-medium text-gray-800 dark:text-white group-hover:text-blue-600">Export as CSV</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Spreadsheet compatible format</p>
          </div>
        </button>

        <button
          onClick={() => handleExport('json')}
          className="flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 group"
        >
          <Database className="w-8 h-8 text-gray-400 dark:text-gray-500 group-hover:text-green-500" />
          <div className="text-left">
            <p className="font-medium text-gray-800 dark:text-white group-hover:text-green-600">Export as JSON</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Structured data format</p>
          </div>
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="font-medium text-gray-800 dark:text-white mb-2">Export includes:</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Complete financial parameters and assumptions</li>
          <li>• Current account balances and allocations</li>
          <li>• Investment projections for all strategies</li>
          <li>• Goal progress analysis and recommendations</li>
          <li>• Risk assessment and diversification metrics</li>
        </ul>
      </div>
    </div>
  );
}