import React, { useState } from 'react';
import { FinancialInputs, AccountBalance } from '../types/financial';
import { useRestorePoint } from '../hooks/useRestorePoint';
import { formatCurrency } from '../utils/calculations';
import { Save, RotateCcw, Trash2, Clock, Plus, X } from 'lucide-react';

interface RestorePointManagerProps {
  inputs: FinancialInputs;
  accounts: AccountBalance[];
  onRestore: (inputs: FinancialInputs, accounts: AccountBalance[]) => void;
}

export function RestorePointManager({ inputs, accounts, onRestore }: RestorePointManagerProps) {
  const { restorePoints, createRestorePoint, deleteRestorePoint, clearAllRestorePoints, isCreating } = useRestorePoint();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [restorePointName, setRestorePointName] = useState('');

  const handleCreateRestorePoint = () => {
    if (!restorePointName.trim()) return;
    
    createRestorePoint(restorePointName.trim(), inputs, accounts);
    setRestorePointName('');
    setShowCreateForm(false);
  };

  const handleRestore = (restorePoint: any) => {
    onRestore(restorePoint.inputs, restorePoint.accounts);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTotalBalance = (accounts: AccountBalance[]) => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Save className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Restore Points</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Save and restore your financial scenarios</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {restorePoints.length > 0 && (
            <button
              onClick={clearAllRestorePoints}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setShowCreateForm(true)}
            disabled={isCreating}
            className="btn-primary flex items-center space-x-2 px-4 py-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreating ? 'Creating...' : 'Create'}</span>
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={restorePointName}
              onChange={(e) => setRestorePointName(e.target.value)}
              placeholder="Enter restore point name..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateRestorePoint()}
              autoFocus
            />
            <button
              onClick={handleCreateRestorePoint}
              disabled={!restorePointName.trim()}
              className="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setRestorePointName('');
              }}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Restore Points List */}
      {restorePoints.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No restore points yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Create your first restore point to save your current scenario</p>
        </div>
      ) : (
        <div className="space-y-3">
          {restorePoints.map((point) => (
            <div key={point.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{point.name}</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    {formatDate(point.timestamp)}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Goal: {formatCurrency(point.inputs.goalAmount)}</span>
                  <span>•</span>
                  <span>Balance: {formatCurrency(getTotalBalance(point.accounts))}</span>
                  <span>•</span>
                  <span>{point.accounts.length} accounts</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleRestore(point)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restore</span>
                </button>
                <button
                  onClick={() => deleteRestorePoint(point.id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}