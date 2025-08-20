import React, { useState, useEffect } from "react";
import { useCallback } from "react";
import { FinancialInputs, AccountBalance } from "../types/financial";
import { InputSection } from "./InputSection";
import { AccountsSection } from "./AccountsSection"; // ✅ matches your file
import Dashboard from "./Dashboard";
import { ExportSection } from "./ExportSection";
import { generateInvestmentProjections } from "../utils/calculations";
import { Calculator, BarChart3, Settings, Download, Menu, X } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { CommandPalette } from "./CommandPalette";

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inputs' | 'accounts' | 'export'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [focusedMetric, setFocusedMetric] = useState<string | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const [inputs, setInputs] = useState<FinancialInputs>({
    goalAmount: 250000,
    currentAge: 25,
    targetAge: 35,
    initialInvestment: 10000,
    monthlyIncome: 5000,
    incomeSavingRate: 0.20,
    growthRate: 0.03,
    inflationRate: 0.02,
    taxRate: 0.15
  });

  const [accounts, setAccounts] = useState<AccountBalance[]>([
    { name: 'HYSA (Marcus)', balance: 3500, type: 'savings', color: '#3B82F6' },
    { name: 'Roth IRA (Stash)', balance: 7000, type: 'retirement', color: '#8B5CF6' },
    { name: 'Brokerage (Schwab)', balance: 4200, type: 'investment', color: '#10B981' },
    { name: 'Emergency Fund (SoFi)', balance: 2000, type: 'emergency', color: '#F59E0B' },
    { name: 'CD (Credit Union)', balance: 5000, type: 'savings', color: '#06B6D4' }
  ]);

  const [projections, setProjections] = useState(generateInvestmentProjections(inputs));

  useEffect(() => {
    setProjections(generateInvestmentProjections(inputs));
  }, [inputs]);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = (field: keyof FinancialInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleAccountChange = (index: number, balance: number) => {
    setAccounts(prev => prev.map((account, i) =>
      i === index ? { ...account, balance } : account
    ));
  };

  const handleAccountRename = (index: number, newName: string) => {
    setAccounts(prev => prev.map((account, i) =>
      i === index ? { ...account, name: newName } : account
    ));
  };

  const handleMetricClick = (metricId: string) => {
    console.log("Focused Metric:", metricId);
    setFocusedMetric(metricId);
  };

  const handleNavigate = useCallback((tab: string) => {
    setActiveTab(tab as any);
    setSidebarOpen(false);
  }, []);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'inputs', name: 'Parameters', icon: Settings },
    { id: 'accounts', name: 'Accounts', icon: Calculator },
    { id: 'export', name: 'Export', icon: Download },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          inputs={inputs} 
          accounts={accounts} 
          projections={projections} 
          onMetricClick={handleMetricClick}
          onInputChange={handleInputChange}
        />;
      case 'inputs':
        return <InputSection inputs={inputs} onInputChange={handleInputChange} />;
      case 'accounts':
        return <AccountsSection accounts={accounts} onAccountChange={handleAccountChange} onAccountRename={handleAccountRename} />;
      case 'export':
        return <ExportSection inputs={inputs} accounts={accounts} projections={projections} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-muted)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="text-xl font-bold capitalize">{activeTab}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="text-sm text-secondary hover:text-primary transition-colors"
          >
            ⌘K
          </button>
          <ThemeSwitcher />
        </div>
      </div>

      <div className="flex">
        <aside className={`fixed lg:static top-0 left-0 h-full shadow-lg lg:shadow-none z-40 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 w-64 p-4`} style={{ backgroundColor: 'var(--bg-surface)' }}>
          <nav className="space-y-2 mt-8">
            {navigation.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left ${
                    activeTab === item.id
                      ? "text-white"
                      : "hover:bg-surface-alt transition-colors"
                  }`}
                  style={activeTab === item.id ? { backgroundColor: 'var(--accent-primary)' } : { color: 'var(--text-primary)' }}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4">
          {renderContent()}
        </main>
      </div>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default App;