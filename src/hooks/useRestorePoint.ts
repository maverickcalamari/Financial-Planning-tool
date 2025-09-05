import { useState, useCallback } from 'react';
import { FinancialInputs, AccountBalance } from '../types/financial';
import { useLocalStorage } from './useLocalStorage';

interface RestorePoint {
  id: string;
  name: string;
  timestamp: number;
  inputs: FinancialInputs;
  accounts: AccountBalance[];
}

export function useRestorePoint() {
  const [restorePoints, setRestorePoints] = useLocalStorage<RestorePoint[]>('financial-restore-points', []);
  const [isCreating, setIsCreating] = useState(false);

  const createRestorePoint = useCallback((
    name: string,
    inputs: FinancialInputs,
    accounts: AccountBalance[]
  ) => {
    setIsCreating(true);
    
    const newRestorePoint: RestorePoint = {
      id: `restore-${Date.now()}`,
      name,
      timestamp: Date.now(),
      inputs: { ...inputs },
      accounts: accounts.map(acc => ({ ...acc }))
    };

    setRestorePoints(prev => {
      const updated = [newRestorePoint, ...prev];
      // Keep only the last 10 restore points
      return updated.slice(0, 10);
    });

    setTimeout(() => setIsCreating(false), 500);
    return newRestorePoint.id;
  }, [setRestorePoints]);

  const deleteRestorePoint = useCallback((id: string) => {
    setRestorePoints(prev => prev.filter(point => point.id !== id));
  }, [setRestorePoints]);

  const clearAllRestorePoints = useCallback(() => {
    setRestorePoints([]);
  }, [setRestorePoints]);

  return {
    restorePoints,
    createRestorePoint,
    deleteRestorePoint,
    clearAllRestorePoints,
    isCreating
  };
}