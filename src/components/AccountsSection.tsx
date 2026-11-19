import { useState } from "react";
import { AccountBalance } from '../types/financial';
import { formatCurrency } from '../utils/calculations';
import { PiggyBank, TrendingUp, Shield, DollarSign, Plus, Trash2 } from 'lucide-react';

interface AccountsSectionProps {
  accounts: AccountBalance[];
  onAccountChange: (index: number, balance: number) => void;
  onAddAccount?: (account: AccountBalance) => void;
  onRemoveAccount?: (index: number) => void;
}

export function AccountsSection({ accounts, onAccountChange, onAddAccount, onRemoveAccount }: AccountsSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    balance: 0,
    type: 'savings' as AccountBalance['type']
  });

  const getAccountIcon = (type: AccountBalance['type']) => {
    switch (type) {
      case 'savings': return <PiggyBank className="w-5 h-5" />;
      case 'investment': return <TrendingUp className="w-5 h-5" />;
      case 'retirement': return <Shield className="w-5 h-5" />;
      case 'emergency': return <DollarSign className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const getAccountColor = (type: AccountBalance['type']) => {
    switch (type) {
      case 'savings': return { text: 'text-blue-600', bg: 'bg-blue-50', color: '#3B82F6' };
      case 'investment': return { text: 'text-green-600', bg: 'bg-green-50', color: '#10B981' };
      case 'retirement': return { text: 'text-purple-600', bg: 'bg-purple-50', color: '#8B5CF6' };
      case 'emergency': return { text: 'text-orange-600', bg: 'bg-orange-50', color: '#F59E0B' };
      default: return { text: 'text-gray-600', bg: 'bg-gray-50', color: '#6B7280' };
    }
  };

  const handleAddAccount = () => {
    if (!newAccount.name.trim() || newAccount.balance < 0) return;
    
    const colors = getAccountColor(newAccount.type);
    onAddAccount?.({
      ...newAccount,
      name: newAccount.name.trim(),
      color: colors.color
    });
    
    setNewAccount({ name: '', balance: 0, type: 'savings' });
    setShowAddForm(false);
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Account Portfolio</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your financial accounts</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {formatCurrency(totalBalance)}
          </p>
        </div>
      </div>

      {/* Add Account Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Add New Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Account name"
              value={newAccount.name}
              onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Initial balance"
              value={newAccount.balance}
              onChange={(e) => setNewAccount(prev => ({ ...prev, balance: Number(e.target.value) }))}
              min={0}
              step={100}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={newAccount.type}
              onChange={(e) => setNewAccount(prev => ({ ...prev, type: e.target.value as AccountBalance['type'] }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="savings">Savings</option>
              <option value="investment">Investment</option>
              <option value="retirement">Retirement</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewAccount({ name: '', balance: 0, type: 'savings' });
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddAccount}
              disabled={!newAccount.name.trim() || newAccount.balance < 0}
              className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Account
            </button>
          </div>
        </div>
      )}

      {/* Add Account Button */}
      {!showAddForm && onAddAccount && (
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-blue-200 dark:border-blue-800 border-dashed"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Account</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {accounts.map((account, index) => {
          const colors = getAccountColor(account.type);
          return (
            <div key={`${account.name}-${index}`} className="group relative border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${colors.text} ${colors.bg} dark:bg-opacity-20`}>
                  {getAccountIcon(account.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-white">{account.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize flex items-center space-x-1">
                    <span>{account.type}</span>
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: colors.color }}
                    />
                  </p>
                </div>
                {onRemoveAccount && accounts.length > 1 && (
                  <button
                    onClick={() => onRemoveAccount(index)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <input
                type="number"
                value={account.balance}
                onChange={(e) => onAccountChange(index, Number(e.target.value))}
                min={0}
                step={100}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Account balance"
              />
              
              <div className="mt-2 text-right">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {((account.balance / totalBalance) * 100).toFixed(1)}% of total
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Type Distribution */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['savings', 'investment', 'retirement', 'emergency'].map(type => {
          const typeAccounts = accounts.filter(a => a.type === type);
          const typeTotal = typeAccounts.reduce((sum, a) => sum + a.balance, 0);
          const colors = getAccountColor(type as AccountBalance['type']);
          
          return (
            <div key={type} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`inline-flex p-2 rounded-lg ${colors.bg} dark:bg-opacity-20 ${colors.text} mb-2`}>
                {getAccountIcon(type as AccountBalance['type'])}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{type}</p>
              <p className="font-semibold text-gray-800 dark:text-white">{formatCurrency(typeTotal)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {typeAccounts.length} account{typeAccounts.length !== 1 ? 's' : ''}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
