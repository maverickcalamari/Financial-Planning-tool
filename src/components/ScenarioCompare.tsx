import React, { useState } from 'react';
import { FinancialInputs, InvestmentOption } from '../types/financial';
import { generateInvestmentProjections, formatCurrency } from '../utils/calculations';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Scenario {
  id: string;
  name: string;
  inputs: FinancialInputs;
  color: string;
}

interface ScenarioCompareProps {
  baseInputs: FinancialInputs;
}

export function ScenarioCompare({ baseInputs }: ScenarioCompareProps) {
  const [scenarios] = useState<Scenario[]>([
    {
      id: 'baseline',
      name: 'Baseline',
      inputs: baseInputs,
      color: '#2F81F7'
    },
    {
      id: 'aggressive',
      name: 'Aggressive',
      inputs: {
        ...baseInputs,
        incomeSavingRate: Math.min(baseInputs.incomeSavingRate * 1.5, 0.5),
        growthRate: baseInputs.growthRate + 0.02
      },
      color: '#22C55E'
    },
    {
      id: 'conservative',
      name: 'Conservative',
      inputs: {
        ...baseInputs,
        incomeSavingRate: baseInputs.incomeSavingRate * 0.8,
        inflationRate: baseInputs.inflationRate + 0.01
      },
      color: '#F59E0B'
    }
  ]);

  // Generate projections for each scenario
  const scenarioProjections = scenarios.map(scenario => {
    const projections = generateInvestmentProjections(scenario.inputs);
    const etfProjection = projections.find(p => p.name.includes('Index Fund')) || projections[0];
    return {
      ...scenario,
      projections: etfProjection.projections
    };
  });

  // Prepare chart data
  const chartData = scenarioProjections[0].projections.map((_, index) => {
    const dataPoint: any = {
      age: scenarioProjections[0].projections[index].age
    };
    
    scenarioProjections.forEach(scenario => {
      dataPoint[scenario.name] = scenario.projections[index]?.value || 0;
    });
    
    return dataPoint;
  });

  // Calculate final values and differences
  const finalValues = scenarioProjections.map(scenario => ({
    ...scenario,
    finalValue: scenario.projections[scenario.projections.length - 1]?.value || 0
  }));

  const baselineFinal = finalValues.find(s => s.id === 'baseline')?.finalValue || 0;

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-primary mb-6 flex items-center">
        <span className="mr-2">📊</span>
        Scenario Comparison
      </h3>

      {/* KPI Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {finalValues.map(scenario => {
          const diff = scenario.finalValue - baselineFinal;
          const diffPercent = baselineFinal > 0 ? (diff / baselineFinal) * 100 : 0;
          
          return (
            <div key={scenario.id} className="bg-surface-alt rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-primary">{scenario.name}</h4>
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: scenario.color }}
                />
              </div>
              
              <div className="text-2xl font-bold mb-1" style={{ color: scenario.color }}>
                {formatCurrency(scenario.finalValue)}
              </div>
              
              {scenario.id !== 'baseline' && (
                <div className={`text-sm ${diff >= 0 ? 'text-success' : 'text-danger'}`}>
                  {diff >= 0 ? '+' : ''}{formatCurrency(diff)}
                  <span className="text-xs ml-1">
                    ({diffPercent >= 0 ? '+' : ''}{diffPercent.toFixed(1)}%)
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" />
            <XAxis 
              dataKey="age" 
              stroke="var(--text-secondary)" 
              fontSize={12}
            />
            <YAxis
              stroke="var(--text-secondary)"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number, name: string) => [formatCurrency(value), name]}
              labelFormatter={(age) => `Age ${age}`}
              contentStyle={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-muted)',
                borderRadius: '8px',
                color: 'var(--text-primary)'
              }}
            />
            <Legend />
            {scenarios.map(scenario => (
              <Line
                key={scenario.id}
                type="monotone"
                dataKey={scenario.name}
                stroke={scenario.color}
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6, stroke: scenario.color, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Scenario Details */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map(scenario => (
          <div key={scenario.id} className="bg-surface-alt rounded-lg p-4">
            <h5 className="font-medium text-primary mb-3">{scenario.name} Assumptions</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Savings Rate:</span>
                <span className="text-primary">{(scenario.inputs.incomeSavingRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Income Growth:</span>
                <span className="text-primary">{(scenario.inputs.growthRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Inflation:</span>
                <span className="text-primary">{(scenario.inputs.inflationRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Tax Rate:</span>
                <span className="text-primary">{(scenario.inputs.taxRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}