export interface FinancialInputs {
  goalAmount: number;
  currentAge: number;
  targetAge: number;
  initialInvestment: number;
  monthlyIncome: number;
  incomeSavingRate: number;
  growthRate: number;
  inflationRate: number;
  taxRate: number;
}

export interface AccountBalance {
  name: string;
  balance: number;
  type: 'savings' | 'investment' | 'retirement' | 'emergency';
  color?: string;
}

export interface ProjectionResult {
  year: number;
  age: number;
  value: number;
  contributions: number;
  interest: number;
}

export interface InvestmentOption {
  name: string;
  rate: number;
  color: string;
  projections: ProjectionResult[];
}

export interface ExportData {
  inputs: FinancialInputs;
  accounts: AccountBalance[];
  projections: InvestmentOption[];
  summary: {
    totalCurrentSavings: number;
    projectedValue: number;
    monthlyRequired: number;
    yearsToGoal: number;
    onTrack: boolean;
  };
  generatedAt: string;
}

export interface DashboardMetrics {
  totalBalance: number;
  monthlyGrowth: number;
  goalProgress: number;
  riskLevel: 'low' | 'medium' | 'high';
  diversificationScore: number;
}