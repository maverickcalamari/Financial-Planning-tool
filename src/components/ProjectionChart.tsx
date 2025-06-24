import React from 'react';
import { InvestmentOption } from '../types/financial';
import { formatCurrency } from '../utils/calculations';

interface ProjectionChartProps {
  projections: InvestmentOption[];
}

export function ProjectionChart({ projections }: ProjectionChartProps) {
  const maxValue = Math.max(...projections.flatMap(p => p.projections.map(pr => pr.value)));
  const years = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Investment Growth Projections</h2>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-4">
          {projections.map(option => (
            <div key={option.name} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: option.color }}
              />
              <span className="text-sm font-medium text-gray-700">{option.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-64 mb-4">
        <svg className="w-full h-full" viewBox="0 0 800 300">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="60"
              y1={50 + i * 50}
              x2="750"
              y2={50 + i * 50}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {years.map(year => (
            <line
              key={year}
              x1={60 + (year - 1) * 69}
              y1="50"
              x2={60 + (year - 1) * 69}
              y2="250"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map(i => (
            <text
              key={i}
              x="50"
              y={255 - i * 50}
              textAnchor="end"
              className="text-xs fill-gray-600"
            >
              {formatCurrency((maxValue / 4) * i)}
            </text>
          ))}

          {/* X-axis labels */}
          {years.map(year => (
            <text
              key={year}
              x={60 + (year - 1) * 69}
              y="270"
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {year}
            </text>
          ))}

          {/* Projection lines */}
          {projections.map(option => {
            const points = option.projections.map((point, index) => {
              const x = 60 + index * 69;
              const y = 250 - (point.value / maxValue) * 200;
              return `${x},${y}`;
            }).join(' ');

            return (
              <g key={option.name}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={option.color}
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {option.projections.map((point, index) => (
                  <circle
                    key={index}
                    cx={60 + index * 69}
                    cy={250 - (point.value / maxValue) * 200}
                    r="4"
                    fill={option.color}
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">Years</p>
      </div>
    </div>
  );
}