import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight } from 'lucide-react';

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  action: () => void;
  keywords: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      subtitle: 'View your financial overview',
      category: 'Navigation',
      action: () => onNavigate('dashboard'),
      keywords: ['dashboard', 'overview', 'home', 'main']
    },
    {
      id: 'accounts',
      title: 'Manage Accounts',
      subtitle: 'Edit account balances and types',
      category: 'Navigation',
      action: () => onNavigate('accounts'),
      keywords: ['accounts', 'balance', 'savings', 'investment']
    },
    {
      id: 'inputs',
      title: 'Financial Parameters',
      subtitle: 'Adjust goals and assumptions',
      category: 'Navigation',
      action: () => onNavigate('inputs'),
      keywords: ['parameters', 'inputs', 'settings', 'goals', 'assumptions']
    },
    {
      id: 'export',
      title: 'Export Data',
      subtitle: 'Download your financial plan',
      category: 'Navigation',
      action: () => onNavigate('export'),
      keywords: ['export', 'download', 'pdf', 'csv', 'data']
    },
    {
      id: 'add-account',
      title: 'Add New Account',
      subtitle: 'Create a new financial account',
      category: 'Actions',
      action: () => {
        onNavigate('accounts');
      },
      keywords: ['add', 'new', 'account', 'create']
    },
    {
      id: 'restore-points',
      title: 'Manage Restore Points',
      subtitle: 'Save and restore financial scenarios',
      category: 'Navigation',
      action: () => onNavigate('restore'),
      keywords: ['restore', 'save', 'backup', 'points', 'scenarios']
    },
    {
      id: 'increase-savings',
      title: 'Increase Savings Rate',
      subtitle: 'Boost your monthly contributions',
      category: 'Actions',
      action: () => {
        onNavigate('inputs');
      },
      keywords: ['increase', 'savings', 'rate', 'contributions', 'boost']
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
    command.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none"
          />
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No commands found for "{query}"
            </div>
          ) : (
            <div className="py-2">
              {filteredCommands.map((command, index) => (
                <button
                  key={command.id}
                  onClick={() => {
                    command.action();
                    onClose();
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    index === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <div>
                    <div className="text-gray-900 dark:text-white font-medium">{command.title}</div>
                    {command.subtitle && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">{command.subtitle}</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {command.category}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <div>⌘K to open</div>
        </div>
      </div>
    </div>
  );
}