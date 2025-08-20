import React from 'react';
import { X } from 'lucide-react';

interface Filter {
  id: string;
  label: string;
  value: string;
}

interface FilterChipsProps {
  filters: Filter[];
  onRemoveFilter: (filterId: string) => void;
  onClearAll: () => void;
}

export function FilterChips({ filters, onRemoveFilter, onClearAll }: FilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 mb-4 flex-wrap gap-2">
      <span className="text-sm text-secondary">Filters:</span>
      {filters.map((filter) => (
        <div
          key={filter.id}
          className="flex items-center space-x-2 bg-accent-primary bg-opacity-20 text-accent-primary px-3 py-1 rounded-full text-sm"
        >
          <span>{filter.label}: {filter.value}</span>
          <button
            onClick={() => onRemoveFilter(filter.id)}
            className="hover:bg-accent-primary hover:bg-opacity-30 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      {filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-secondary hover:text-primary underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}