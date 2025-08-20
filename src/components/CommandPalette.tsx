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
        // TODO: Trigger add account modal
      },
      keywords: ['add', 'new', 'account', 'create']
    },
    {
      id: 'increase-savings',
      title: 'Increase Savings Rate',
      subtitle: 'Boost your monthly contributions',
      category: 'Actions',
      action: () => {
        onNavigate('inputs');
        // TODO: Focus on savings rate slider
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
      <div className="bg-surface border border-muted rounded-lg shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center p-4 border-b border-muted">
          <Search className="w-5 h-5 text-secondary mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-primary placeholder-secondary outline-none"
          />
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-secondary">
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
                  className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-surface-alt transition-colors ${
                    index === selectedIndex ? 'bg-surface-alt' : ''
                  }`}
                >
                  <div>
                    <div className="text-primary font-medium">{command.title}</div>
                    {command.subtitle && (
                      <div className="text-sm text-secondary">{command.subtitle}</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-secondary bg-surface-alt px-2 py-1 rounded">
                      {command.category}
                    </span>
                    <ArrowRight className="w-4 h-4 text-secondary" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-muted text-xs text-secondary flex items-center justify-between">
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