// Core financial data types based on YNAB API and our app needs

// ============================================================================
// NEW: Income-Based Types (Phase 2A Redesign)
// ============================================================================

export interface IncomeTracking {
  monthYear: string; // e.g., "2024-12"
  currentDate: number; // Day of month (1-31)
  daysInMonth: number;
  percentOfMonthElapsed: number; // 0-100 (for time progress bar)

  // Income data
  expectedIncome: number; // User-set monthly income (e.g., $7,500)
  earnedIncome: number; // Actual income from YNAB transactions this month
  incomeGoal: number; // Same as expectedIncome (for consistency)

  // Spending data
  totalSpent: number; // Sum of tracked categories
  spendingGoalAmount: number; // Dollar amount (e.g., $6,000)
  spendingGoalPercent: number; // Percentage (e.g., 80%)
  percentOfIncomeSpent: number; // totalSpent / expectedIncome * 100

  // Status calculation
  successLevel: 'amazing' | 'good' | 'over';
  // amazing: spending < goal (e.g., < 80%)
  // good: spending < 100% income but > goal
  // over: spending > 100% income

  // Amounts for display
  remainingToGoal: number; // spendingGoalAmount - totalSpent
  remainingToIncome: number; // expectedIncome - totalSpent
  overageAmount: number; // If over, how much over income
}

export interface CategoryTracking {
  categoryId: string;
  categoryName: string;
  categoryGroupName: string;
  isTracked: boolean; // User selected this category

  // Target vs budgeted (priority: target > budgeted)
  target?: number; // YNAB monthly funding goal
  budgeted?: number; // YNAB budgeted amount (fallback)
  effectiveGoal: number; // target ?? budgeted ?? 0

  spent: number;
  percentSpent: number; // spent / effectiveGoal * 100
  remaining: number; // effectiveGoal - spent
  status: 'under' | 'at-goal' | 'over';
}

export interface IncomeSettings {
  expectedMonthlyIncome: number; // Default: 6000
  spendingGoalPercent: number; // Default: 80
  spendingGoalAmount: number; // Calculated from above
  trackedCategoryIds: string[]; // User-selected categories
  currency: string; // e.g., "USD"
}

export interface IncomeTransaction {
  transactionId: string;
  date: string; // ISO date
  amount: number;
  payeeName: string;
  categoryName?: string; // YNAB category if categorized
}

export interface SpendingStreakInfo {
  currentStreak: number; // Months under spending goal
  longestStreak: number;
  streakStatus: 'active' | 'broken';
  lastStreakEnd?: string; // ISO date when last streak ended

  // New: track different streak levels
  underGoalStreak: number; // Months under goal (amazing)
  underIncomeStreak: number; // Months under 100% income (good)
}

export interface DashboardData {
  currentMonth: IncomeTracking;
  streakInfo: SpendingStreakInfo;
  trackedCategories: CategoryTracking[];
  incomeTransactions: IncomeTransaction[];
  settings: IncomeSettings;
  lastSyncTime: string;
}

// ============================================================================
// DEPRECATED: Budget-Based Types (kept temporarily for backward compatibility)
// Will be removed in Phase H
// ============================================================================

/**
 * @deprecated Use IncomeTracking instead
 */
export interface OldDashboardData {
  currentMonth: MonthlyPacing;
  streakInfo: StreakInfo;
  topCategories: CategorySpending[];
  lastSyncTime: string;
}

export interface MonthlyPacing {
  monthYear: string; // e.g., "2024-11"
  currentDate: number; // Day of month (1-31)
  daysInMonth: number;
  percentOfMonthElapsed: number; // 0-100

  // Financial data
  budgeted: number; // Total budgeted for the month
  spent: number; // Total spent so far
  percentSpent: number; // 0-100

  // Calculated pacing
  expectedSpending: number; // What should have been spent by now
  pacingPercentage: number; // spent / expectedSpending * 100
  pacingStatus: 'under' | 'on-track' | 'over'; // under 95%, 95-105%, over 105%

  // Projections
  projectedEndOfMonthSpending: number; // Based on current pace
  projectedOverage: number; // If pace continues, how much over budget?

  // Time vs Money comparison
  timeAheadBehind: number; // Positive = ahead of schedule, negative = behind
  moneyAheadBehind: number; // Positive = under budget, negative = over budget
}

export interface StreakInfo {
  currentStreak: number; // Number of consecutive months under budget
  longestStreak: number;
  streakStatus: 'active' | 'broken';
  lastStreakEnd?: string; // ISO date when last streak ended
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  categoryGroupName: string;
  budgeted: number;
  spent: number;
  percentSpent: number;
  pacingStatus: 'under' | 'on-track' | 'over';
}

// Updated Historical Month (income-based)
export interface HistoricalMonth {
  monthYear: string;
  expectedIncome: number;
  earnedIncome: number;
  totalSpent: number;
  spendingGoal: number;
  percentOfIncomeSpent: number;
  successLevel: 'amazing' | 'good' | 'over';
  variance: number; // expectedIncome - totalSpent
}

export interface TrendData {
  months: HistoricalMonth[];
  averageMonthlySpending: number;
  averagePercentSpent: number;
  monthsUnderGoal: number; // Months under spending goal
  monthsUnderIncome: number; // Months under 100% income
  monthsOverIncome: number; // Months over income
}

// User settings
export interface UserSettings {
  userId: string;
  ynabAccessToken?: string;
  ynabBudgetId?: string;

  // Alert preferences
  alertsEnabled: boolean;
  alertThresholds: AlertThresholds;
  emailNotificationsEnabled: boolean;
  email?: string;

  // Display preferences
  darkMode: boolean;
  currency: string; // e.g., "USD"
}

export interface AlertThresholds {
  dailyCheck: boolean; // Check pacing daily
  warningThreshold: number; // e.g., 105 = warn at 105% pacing
  criticalThreshold: number; // e.g., 110 = critical at 110% pacing
  notifyOnStreakBreak: boolean;
}

// Alert history
export interface Alert {
  alertId: string;
  userId: string;
  timestamp: string; // ISO date
  alertType: 'warning' | 'critical' | 'streak-break';
  monthYear: string;
  message: string;
  pacingPercentage?: number;
  acknowledged: boolean;
}

// For the dev tools (simulation date picker and scenario switcher)
export interface DevToolsState {
  simulationDate?: Date; // Override current date for testing
  scenarioId?: string; // Switch between mock data scenarios
}

// Mock data scenarios for testing different spending situations
export type MockScenario =
  | 'amazing' // Spending < 80% goal
  | 'good' // Spending 80-100% of income
  | 'slightly-over' // Spending 100-110% of income
  | 'way-over' // Spending > 110% of income
  | 'variable-income'; // Testing income variation
