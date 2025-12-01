// Core financial data types based on YNAB API and our app needs

export interface DashboardData {
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

export interface HistoricalMonth {
  monthYear: string;
  budgeted: number;
  spent: number;
  percentSpent: number;
  underBudget: boolean;
  variance: number; // budgeted - spent
}

export interface TrendData {
  months: HistoricalMonth[];
  averageMonthlySpending: number;
  averagePercentSpent: number;
  monthsUnderBudget: number;
  monthsOverBudget: number;
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

// Mock data scenarios for testing different pacing situations
export type MockScenario =
  | 'healthy' // Under budget, good pace
  | 'slight-over' // Slightly over pace (105-110%)
  | 'danger' // Significantly over pace (>115%)
  | 'way-under' // Spending too slowly
  | 'mid-month' // Testing mid-month display
  | 'end-of-month'; // Testing end of month
