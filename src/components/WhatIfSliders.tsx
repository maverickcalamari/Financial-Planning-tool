import React, { useState, useCallback, useMemo } from 'react';
import { FinancialInputs } from '../types/financial';
import { formatPercentage } from '../utils/calculations';
import { debounce } from '../utils/debounce';

interface WhatIfSlidersProps {
  inputs: FinancialInputs;
  onInputChange: (field: keyof FinancialInputs, value: number) => void;
}

export function WhatIfSliders({ inputs, onInputChange }: WhatIfSlidersProps) {
  const [localValues, setLocalValues] = useState({
    incomeSavingRate: inputs.incomeSavingRate,
    growthRate: inputs.growthRate,
    inflationRate: inputs.inflationRate,
    taxRate: inputs.taxRate,
  });

  // Debounced update function
  const debouncedUpdate = useMemo(
    () => debounce((field: keyof FinancialInputs, value: number) => {
      onInputChange(field, value);
    }, 150),
    [onInputChange]
  );

  const handleSliderChange = useCallback((field: keyof typeof localValues, value: number) => {
    setLocalValues(prev => ({ ...prev, [field]: value }));
    debouncedUpdate(field, value);
  }, [debouncedUpdate]);

  const sliders = [
    {
      key: 'incomeSavingRate' as const,
      label: 'Savings Rate',
      min: 0.05,
      max: 0.5,
      step: 0.01,
      icon: '💰',
      color: '#22C55E'
    },
    {
      key: 'growthRate' as const,
      label: 'Income Growth',
      min: 0,
      max: 0.1,
      step: 0.005,
      icon: '📈',
      color: '#2F81F7'
    },
    {
      key: 'inflationRate' as const,
      label: 'Inflation Rate',
      min: 0,
      max: 0.05,
      step: 0.005,
      icon: '📉',
      color: '#F59E0B'
    },
    {
      key: 'taxRate' as const,
      label: 'Tax Rate',
      min: 0,
      max: 0.4,
      step: 0.01,
      icon: '🏛️',
      color: '#EF4444'
    }
  ];

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-primary mb-6 flex items-center">
        <span className="mr-2">⚡</span>
        What-If Analysis
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sliders.map((slider) => (
          <div key={slider.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-secondary flex items-center">
                <span className="mr-2">{slider.icon}</span>
                {slider.label}
              </label>
              <div 
                className="text-sm font-semibold px-2 py-1 rounded"
                style={{ 
                  backgroundColor: `${slider.color}20`,
                  color: slider.color 
                }}
              >
                {formatPercentage(localValues[slider.key])}
              </div>
            </div>
            
            <div className="relative">
              <input
                type="range"
                value={localValues[slider.key]}
                onChange={(e) => handleSliderChange(slider.key, Number(e.target.value))}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${slider.color}40 0%, ${slider.color} 100%)`
                }}
              />
              <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: ${slider.color};
                  border: 2px solid white;
                  cursor: pointer;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }
                
                input[type="range"]::-moz-range-thumb {
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: ${slider.color};
                  border: 2px solid white;
                  cursor: pointer;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }
              `}</style>
            </div>
            
            <div className="flex justify-between text-xs text-secondary">
              <span>{formatPercentage(slider.min)}</span>
              <span>{formatPercentage(slider.max)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}