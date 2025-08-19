
import React, { useState, useEffect } from "react";
import { FinancialInputs, AccountBalance } from "./types/financial";
import { InputSection } from "./components/InputSection";
import { AccountsSection } from "./components/AccountsSection";
import { Dashboard } from "./pages/Dashboard";
import { ExportSection } from "./components/ExportSection";
import { generateInvestmentProjections } from "./utils/calculations";
import { Calculator, BarChart3, Settings, Download, Menu, X } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inputs' | 'accounts' | 'export'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleInputChange = (field: keyof FinancialInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleAccountChange = (index: number, balance: number) => {
    setAccounts(prev => prev.map((account, i) => 
      i === index ? { ...account, balance } : account
    ));
  };

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'inputs', name: 'Parameters', icon: Settings },
    { id: 'accounts', name: 'Accounts', icon: Calculator },
    { id: 'export', name: 'Export', icon: Download },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard inputs={inputs} accounts={accounts} projections={projections} />;
      case 'inputs':
        return <InputSection inputs={inputs} onInputChange={handleInputChange} />;
      case 'accounts':
        return <AccountsSection accounts={accounts} onAccountChange={handleAccountChange} />;
      case 'export':
        return <ExportSection inputs={inputs} accounts={accounts} projections={projections} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="text-xl font-bold capitalize">{activeTab}</h1>
        </div>
        <ThemeSwitcher />
      </div>

      <div className="flex">
        {/* Sidebar */}
      <aside
  className={`fixed lg:static top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg lg:shadow-none z-40 transform transition-transform duration-300 ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  } lg:translate-x-0 w-64 p-4`}>
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
                  className={\`flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left \${activeTab === item.id
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"}\`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 lg:ml-64">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;