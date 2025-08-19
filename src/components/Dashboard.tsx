import React from 'react';
import { FinancialInputs, AccountBalance, InvestmentOption, DashboardMetrics } from '../types/financial';
import { calculateDashboardMetrics, formatCurrency, formatPercentage } from '../utils/calculations';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, DollarSign, Target, Shield, AlertTriangle, CheckCircle, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface DashboardProps {
  inputs: FinancialInputs;
  accounts: AccountBalance[];
  projections: InvestmentOption[];
}

export function Dashboard({ inputs, accounts, projections, onMetricClick }: DashboardProps & { onMetricClick?: (id: string) => void }) {
  const metrics = calculateDashboardMetrics(accounts, projections, inputs);
  const bestProjection = projections.find(p => p.name.includes('Index Fund')) || projections[0];
  
  // Prepare chart data
  const projectionChartData = bestProjection.projections.map(p => ({
    age: p.age,
    value: p.value,
    contributions: p.contributions,
    interest: p.interest
  }));

  const accountChartData = accounts.map(account => ({
    name: account.name,
    value: account.balance,
    fill: account.color || getAccountColor(account.type)
  }));

  const allProjectionsData = projections[0].projections.map((_, index) => {
    const dataPoint: any = { age: projections[0].projections[index].age };
    projections.forEach(proj => {
      dataPoint[proj.name] = proj.projections[index]?.value || 0;
    });
    return dataPoint;
  });

  function getAccountColor(type: string) {
    const colors = {
      savings: '#3B82F6',
      investment: '#10B981',
      retirement: '#8B5CF6',
      emergency: '#F59E0B'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  }

  function getRiskColor(risk: string) {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button onClick={() => onMetricClick?.("totalBalance")} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white w-full text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Balance</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics.totalBalance)}</p>
              <p className="text-blue-200 text-xs mt-1">
                +{formatCurrency(metrics.monthlyGrowth)}/month
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
        
        

        <button onClick={() => onMetricClick?.("goalProgress")} className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white w-full text-left">
          <div className="flex items-center justify-between"> </div>
            <div>
              <p className="text-green-100 text-sm font-medium">Goal Progress</p>
              <p className="text-2xl font-bold">{metrics.goalProgress.toFixed(1)}%</p>
              <p className="text-green-200 text-xs mt-1">
                {formatCurrency(inputs.goalAmount - metrics.totalBalance)} remaining
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Target className="w-6 h-6" />
            </div>
          </div>
        </div>

        <button onClick={() => onMetricClick?.("riskLevel")} className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white w-full text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Risk Level</p>
              <p className="text-2xl font-bold capitalize">{metrics.riskLevel}</p>
              <p className="text-purple-200 text-xs mt-1">
                Diversification: {metrics.diversificationScore.toFixed(0)}%
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>

        <button onClick={() => onMetricClick?.("yearsToGoal")} className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white w-full text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Years to Goal</p>
              <p className="text-2xl font-bold">{inputs.targetAge - inputs.currentAge}</p>
              <p className="text-orange-200 text-xs mt-1">
                Target age: {inputs.targetAge}
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </button>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Projection Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Growth Projection by Age</h3>
            <BarChart3 className="w-5 h-5 text-gray-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={projectionChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="age" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Value']}
                labelFormatter={(age) => `Age ${age}`}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                fill="url(#colorGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Account Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Account Distribution</h3>
            <PieChartIcon className="w-5 h-5 text-gray-500" />
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
                formatter={(value: number) => [formatCurrency(value), 'Balance']}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* All Projections Comparison */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Investment Strategy Comparison</h3>
          <TrendingUp className="w-5 h-5 text-gray-500" />
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={allProjectionsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="age" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [formatCurrency(value), name]}
              labelFormatter={(age) => `Age ${age}`}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
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
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h3>
          <div className="space-y-4">
            {accounts.map((account, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: account.color || getAccountColor(account.type) }}
                  />
                  <div>
                    <p className="font-medium text-gray-800">{account.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{account.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{formatCurrency(account.balance)}</p>
                  <p className="text-sm text-gray-500">
                    {((account.balance / metrics.totalBalance) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Assessment</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Portfolio Risk Level</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(metrics.riskLevel)}`}>
                {metrics.riskLevel.toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Diversification Score</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${metrics.diversificationScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{metrics.diversificationScore.toFixed(0)}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Goal Achievement</span>
              <div className="flex items-center space-x-2">
                {metrics.goalProgress >= 100 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : metrics.goalProgress >= 75 ? (
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-sm font-medium">{metrics.goalProgress.toFixed(1)}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Monthly Growth Rate</span>
              <span className="text-sm font-medium text-green-600">
                +{formatCurrency(metrics.monthlyGrowth)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}