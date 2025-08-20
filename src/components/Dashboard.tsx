import React from "react";
import { useState } from "react";
import {
  FinancialInputs,
  AccountBalance,
  InvestmentOption,
} from "../types/financial";
import {
  calculateDashboardMetrics,
  formatCurrency,
} from "../utils/calculations";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Target,
  Shield,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
} from "lucide-react";
import { KPIStrip } from "./KPIStrip";
import { FilterChips } from "./FilterChips";
import { WhatIfSliders } from "./WhatIfSliders";
import { ScenarioCompare } from "./ScenarioCompare";

interface DashboardProps {
  inputs: FinancialInputs;
  accounts: AccountBalance[];
  projections: InvestmentOption[];
  onMetricClick?: (id: string) => void;
  onInputChange?: (field: keyof FinancialInputs, value: number) => void;
}

function Dashboard({
  inputs,
  accounts,
  projections,
  onMetricClick,
  onInputChange,
}: DashboardProps) {
  const [activeFilters, setActiveFilters] = useState<Array<{id: string, label: string, value: string}>>([]);
  
  const metrics = calculateDashboardMetrics(accounts, projections, inputs);
  const bestProjection =
    projections.find((p) => p.name.includes("Index Fund")) || projections[0];

  // Prepare chart data
  const projectionChartData = bestProjection.projections.map((p) => ({
    age: p.age,
    value: p.value,
    contributions: p.contributions,
    interest: p.interest,
  }));

  const accountChartData = accounts.map((account) => ({
    name: account.name,
    value: account.balance,
    fill: account.color || getAccountColor(account.type),
  }));

  const allProjectionsData = projections[0].projections.map((_, index) => {
    const dataPoint: Record<string, number | string> = {
      age: projections[0].projections[index].age,
    };
    projections.forEach((proj) => {
      dataPoint[proj.name] = proj.projections[index]?.value || 0;
    });
    return dataPoint;
  });

  function getAccountColor(type: string) {
    const colors = {
      savings: "#3B82F6",
      investment: "#10B981",
      retirement: "#8B5CF6",
      emergency: "#F59E0B",
    };
    return colors[type as keyof typeof colors] || "#6B7280";
  }

  // Prepare KPI data for the strip
  const kpiData = [
    {
      id: 'totalBalance',
      label: 'Total Balance',
      value: metrics.totalBalance,
      delta30: 5.2,
      delta90: 12.8,
      sparklineData: [85000, 87000, 89000, 91000, 93000, 95000, metrics.totalBalance],
      icon: DollarSign,
      format: 'currency' as const,
      color: '#2F81F7'
    },
    {
      id: 'goalProgress',
      label: 'Goal Progress',
      value: metrics.goalProgress,
      delta30: 2.1,
      delta90: 8.5,
      sparklineData: [65, 68, 71, 74, 77, 80, metrics.goalProgress],
      icon: Target,
      format: 'percentage' as const,
      color: '#22C55E'
    },
    {
      id: 'monthlyGrowth',
      label: 'Monthly Growth',
      value: metrics.monthlyGrowth,
      delta30: 1.8,
      delta90: 4.2,
      sparklineData: [800, 850, 900, 950, 1000, 1050, metrics.monthlyGrowth],
      icon: TrendingUp,
      format: 'currency' as const,
      color: '#F59E0B'
    },
    {
      id: 'diversification',
      label: 'Diversification',
      value: metrics.diversificationScore,
      delta30: 0.5,
      delta90: 2.1,
      sparklineData: [75, 76, 78, 80, 82, 84, metrics.diversificationScore],
      icon: Shield,
      format: 'percentage' as const,
      color: '#8B5CF6'
    },
    {
      id: 'yearsToGoal',
      label: 'Years to Goal',
      value: inputs.targetAge - inputs.currentAge,
      delta30: 0,
      delta90: -0.2,
      sparklineData: [10, 10, 9.8, 9.6, 9.4, 9.2, inputs.targetAge - inputs.currentAge],
      icon: Calendar,
      format: 'number' as const,
      color: '#EF4444'
    },
    {
      id: 'riskLevel',
      label: 'Risk Score',
      value: metrics.riskLevel === 'low' ? 30 : metrics.riskLevel === 'medium' ? 60 : 90,
      delta30: 5,
      delta90: 10,
      sparklineData: [25, 28, 32, 35, 38, 42, metrics.riskLevel === 'low' ? 30 : metrics.riskLevel === 'medium' ? 60 : 90],
      icon: Shield,
      format: 'number' as const,
      color: metrics.riskLevel === 'low' ? '#22C55E' : metrics.riskLevel === 'medium' ? '#F59E0B' : '#EF4444'
    }
  ];

  const handleRemoveFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
  };

  function getRiskColor(risk: string) {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter Chips */}
      <FilterChips 
        filters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
      />

      {/* KPI Strip */}
      <KPIStrip kpis={kpiData} onKPIClick={onMetricClick} />

      {/* What-If Sliders */}
      {onInputChange && (
        <WhatIfSliders inputs={inputs} onInputChange={onInputChange} />
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Projection Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-primary">
              Growth Projection by Age
            </h3>
            <BarChart3 className="w-5 h-5 text-secondary" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={projectionChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" />
              <XAxis dataKey="age" stroke="var(--text-secondary)" fontSize={12} />
              <YAxis
                stroke="var(--text-secondary)"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Value"]}
                labelFormatter={(age) => `Age ${age}`}
                contentStyle={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-muted)",
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--accent-primary)"
                fill="url(#colorGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Account Distribution */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-primary">
              Account Distribution
            </h3>
            <PieChartIcon className="w-5 h-5 text-secondary" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={accountChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {accountChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Balance"]}
                contentStyle={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-muted)",
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenario Comparison */}
      <ScenarioCompare baseInputs={inputs} />

      {/* All Projections Comparison */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-primary">
            Investment Strategy Comparison
          </h3>
          <TrendingUp className="w-5 h-5 text-secondary" />
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={allProjectionsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" />
            <XAxis dataKey="age" stroke="var(--text-secondary)" fontSize={12} />
            <YAxis
              stroke="var(--text-secondary)"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name,
              ]}
              labelFormatter={(age) => `Age ${age}`}
              contentStyle={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-muted)",
                borderRadius: "8px",
                color: "var(--text-primary)",
              }}
            />
            <Legend />
            {projections.map((projection) => (
              <Line
                key={projection.name}
                type="monotone"
                dataKey={projection.name}
                stroke={projection.color}
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Details */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Account Details
          </h3>
          <div className="space-y-4">
            {accounts.map((account, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-surface-alt rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor:
                        account.color || getAccountColor(account.type),
                    }}
                  />
                  <div>
                    <p className="font-medium text-primary">{account.name}</p>
                    <p className="text-sm text-secondary capitalize">
                      {account.type}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    {formatCurrency(account.balance)}
                  </p>
                  <p className="text-sm text-secondary">
                    {((account.balance / metrics.totalBalance) * 100).toFixed(
                      1
                    )}
                    %
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Risk Assessment
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-surface-alt rounded-lg">
              <span className="text-secondary">Portfolio Risk Level</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(
                  metrics.riskLevel
                )}`}
              >
                {metrics.riskLevel.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-surface-alt rounded-lg">
              <span className="text-secondary">Diversification Score</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-border-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                    style={{ width: `${metrics.diversificationScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {metrics.diversificationScore.toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-surface-alt rounded-lg">
              <span className="text-secondary">Goal Achievement</span>
              <div className="flex items-center space-x-2">
                {metrics.goalProgress >= 100 ? (
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--success)' }} />
                ) : metrics.goalProgress >= 75 ? (
                  <TrendingUp className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                ) : (
                  <AlertTriangle className="w-5 h-5" style={{ color: 'var(--danger)' }} />
                )}
                <span className="text-sm font-medium">
                  {metrics.goalProgress.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-surface-alt rounded-lg">
              <span className="text-secondary">Monthly Growth Rate</span>
              <span className="text-sm font-medium" style={{ color: 'var(--success)' }}>
                +{formatCurrency(metrics.monthlyGrowth)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
