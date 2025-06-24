import { FinancialInputs, AccountBalance, InvestmentOption, ProjectionResult, ExportData, DashboardMetrics } from '../types/financial';

export function compoundInterestWithGrowth(
  principal: number,
  rate: number,
  years: number,
  annualIncrease: number,
  currentAge: number
): ProjectionResult[] {
  const results: ProjectionResult[] = [];
  let totalContributions = principal;
  
  for (let y = 1; y <= years; y++) {
    const adjustedPrincipal = principal * Math.pow(1 + annualIncrease, y - 1);
    const value = adjustedPrincipal * Math.pow(1 + rate, y);
    const interest = value - totalContributions;
    
    results.push({ 
      year: y, 
      age: currentAge + y,
      value,
      contributions: totalContributions,
      interest: Math.max(0, interest)
    });
    
    totalContributions += adjustedPrincipal * annualIncrease;
  }
  
  return results;
}

export function calculateAdjustedReturns(
  principal: number,
  grossRate: number,
  years: number,
  annualIncrease: number,
  taxRate: number,
  inflationRate: number,
  currentAge: number
): ProjectionResult[] {
  const taxedRate = grossRate * (1 - taxRate);
  const nominal = compoundInterestWithGrowth(principal, taxedRate, years, annualIncrease, currentAge);
  
  return nominal.map((result, index) => ({
    ...result,
    value: result.value / Math.pow(1 + inflationRate, index + 1)
  }));
}

export function generateInvestmentProjections(
  inputs: FinancialInputs
): InvestmentOption[] {
  const { initialInvestment, growthRate, taxRate, inflationRate, currentAge } = inputs;
  const projectionYears = Math.min(inputs.targetAge - inputs.currentAge, 30);
  
  return [
    {
      name: 'High Yield Savings',
      rate: 0.05,
      color: '#3B82F6',
      projections: calculateAdjustedReturns(initialInvestment, 0.05, projectionYears, growthRate, taxRate, inflationRate, currentAge)
    },
    {
      name: 'Certificate of Deposit',
      rate: 0.045,
      color: '#8B5CF6',
      projections: calculateAdjustedReturns(initialInvestment, 0.045, projectionYears, growthRate, taxRate, inflationRate, currentAge)
    },
    {
      name: 'Index Fund ETF',
      rate: 0.08,
      color: '#10B981',
      projections: calculateAdjustedReturns(initialInvestment, 0.08, projectionYears, growthRate, taxRate, inflationRate, currentAge)
    },
    {
      name: 'Aggressive Growth',
      rate: 0.12,
      color: '#F59E0B',
      projections: calculateAdjustedReturns(initialInvestment, 0.12, projectionYears, growthRate, taxRate, inflationRate, currentAge)
    }
  ];
}

export function calculateRecommendedSavings(inputs: FinancialInputs) {
  const yearsToSave = inputs.targetAge - inputs.currentAge;
  const monthsToSave = yearsToSave * 12;
  const recommendedMonthlySave = inputs.monthlyIncome * inputs.incomeSavingRate;
  const recommendedTotalSave = recommendedMonthlySave * monthsToSave;
  
  return {
    yearsToSave,
    monthsToSave,
    recommendedMonthlySave,
    recommendedTotalSave
  };
}

export function calculateAccountProgress(accounts: AccountBalance[], goalAmount: number) {
  const totalSaved = accounts.reduce((sum, account) => sum + account.balance, 0);
  const progressPercentage = (totalSaved / goalAmount) * 100;
  
  return {
    totalSaved,
    progressPercentage: Math.min(progressPercentage, 100)
  };
}

export function calculateDashboardMetrics(
  accounts: AccountBalance[],
  projections: InvestmentOption[],
  inputs: FinancialInputs
): DashboardMetrics {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const bestProjection = projections.find(p => p.name.includes('Index Fund'));
  const monthlyGrowth = bestProjection ? 
    (bestProjection.projections[0]?.value - inputs.initialInvestment) / 12 : 0;
  
  const goalProgress = (totalBalance / inputs.goalAmount) * 100;
  
  // Calculate risk level based on investment allocation
  const investmentAccounts = accounts.filter(a => a.type === 'investment' || a.type === 'retirement');
  const investmentRatio = investmentAccounts.reduce((sum, a) => sum + a.balance, 0) / totalBalance;
  
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (investmentRatio > 0.7) riskLevel = 'high';
  else if (investmentRatio > 0.4) riskLevel = 'medium';
  
  // Calculate diversification score
  const accountTypes = new Set(accounts.map(a => a.type));
  const diversificationScore = (accountTypes.size / 4) * 100; // 4 possible types
  
  return {
    totalBalance,
    monthlyGrowth,
    goalProgress,
    riskLevel,
    diversificationScore
  };
}

export function exportToCSV(data: ExportData): void {
  const csvContent = [
    ['Financial Planning Export'],
    ['Generated:', data.generatedAt],
    [''],
    ['INPUTS'],
    ['Goal Amount', data.inputs.goalAmount],
    ['Current Age', data.inputs.currentAge],
    ['Target Age', data.inputs.targetAge],
    ['Initial Investment', data.inputs.initialInvestment],
    ['Monthly Income', data.inputs.monthlyIncome],
    ['Income Saving Rate', `${(data.inputs.incomeSavingRate * 100).toFixed(1)}%`],
    ['Growth Rate', `${(data.inputs.growthRate * 100).toFixed(1)}%`],
    ['Inflation Rate', `${(data.inputs.inflationRate * 100).toFixed(1)}%`],
    ['Tax Rate', `${(data.inputs.taxRate * 100).toFixed(1)}%`],
    [''],
    ['CURRENT ACCOUNTS'],
    ['Account Name', 'Balance', 'Type'],
    ...data.accounts.map(account => [account.name, account.balance, account.type]),
    [''],
    ['PROJECTIONS'],
    ['Investment Type', 'Year 1', 'Year 5', 'Year 10', 'Final Year'],
    ...data.projections.map(proj => [
      proj.name,
      proj.projections[0]?.value.toFixed(2) || '0',
      proj.projections[4]?.value.toFixed(2) || '0',
      proj.projections[9]?.value.toFixed(2) || '0',
      proj.projections[proj.projections.length - 1]?.value.toFixed(2) || '0'
    ]),
    [''],
    ['SUMMARY'],
    ['Total Current Savings', data.summary.totalCurrentSavings],
    ['Projected Value', data.summary.projectedValue],
    ['Monthly Required', data.summary.monthlyRequired],
    ['Years to Goal', data.summary.yearsToGoal],
    ['On Track', data.summary.onTrack ? 'Yes' : 'No']
  ];

  const csv = csvContent.map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `financial-plan-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function exportToJSON(data: ExportData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `financial-plan-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}