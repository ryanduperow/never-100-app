import type {
  DashboardData,
  IncomeTracking,
  SpendingStreakInfo,
  CategoryTracking,
  IncomeTransaction,
  IncomeSettings,
  HistoricalMonth,
  TrendData,
  UserSettings,
  MockScenario,
} from '../types';

/**
 * Mock data service for UI development and testing
 * Provides realistic scenarios for different income-based spending situations
 */

class MockDataService {
  private currentScenario: MockScenario = 'amazing';
  private simulationDate: Date | null = null;

  // Income settings (default values)
  private settings: IncomeSettings = {
    expectedMonthlyIncome: 7500,
    spendingGoalPercent: 80,
    spendingGoalAmount: 6000, // 80% of 7500
    trackedCategoryIds: ['1', '2', '3', '4', '5'], // All categories tracked by default
    currency: 'USD',
  };

  // Scenario management
  setScenario(scenario: MockScenario): void {
    this.currentScenario = scenario;
  }

  getScenario(): MockScenario {
    return this.currentScenario;
  }

  setSimulationDate(date: Date | null): void {
    this.simulationDate = date;
  }

  getSimulationDate(): Date | null {
    return this.simulationDate;
  }

  getCurrentDate(): Date {
    return this.simulationDate || new Date();
  }

  // API methods (simulating backend calls)
  async getDashboardData(): Promise<DashboardData> {
    // Simulate network delay
    await this.delay(300);

    const currentDate = this.getCurrentDate();

    return {
      currentMonth: this.generateIncomeTracking(this.currentScenario, currentDate),
      streakInfo: this.generateStreakInfo(this.currentScenario),
      trackedCategories: this.generateTrackedCategories(this.currentScenario),
      incomeTransactions: this.generateIncomeTransactions(currentDate),
      settings: this.settings,
      lastSyncTime: new Date().toISOString(),
    };
  }

  async getTrendData(): Promise<TrendData> {
    await this.delay(300);

    const months = this.generateHistoricalMonths(12);
    const monthsUnderGoal = months.filter((m) => m.successLevel === 'amazing').length;
    const monthsUnderIncome = months.filter((m) => m.successLevel !== 'over').length;

    return {
      months,
      averageMonthlySpending: months.reduce((sum, m) => sum + m.totalSpent, 0) / months.length,
      averagePercentSpent: months.reduce((sum, m) => sum + m.percentOfIncomeSpent, 0) / months.length,
      monthsUnderGoal,
      monthsUnderIncome,
      monthsOverIncome: months.length - monthsUnderIncome,
    };
  }

  async getUserSettings(): Promise<UserSettings> {
    await this.delay(200);

    return {
      userId: 'mock-user-123',
      ynabBudgetId: 'mock-budget-456',
      alertsEnabled: true,
      alertThresholds: {
        dailyCheck: true,
        warningThreshold: 100, // Alert at 100% of income
        criticalThreshold: 110, // Critical at 110% of income
        notifyOnStreakBreak: true,
      },
      emailNotificationsEnabled: true,
      email: 'user@example.com',
      darkMode: false,
      currency: 'USD',
    };
  }

  async updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    await this.delay(300);
    const current = await this.getUserSettings();
    return { ...current, ...settings };
  }

  // Private helper methods
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private generateIncomeTracking(scenario: MockScenario, date: Date): IncomeTracking {
    const year = date.getFullYear();
    const month = date.getMonth();
    const dayOfMonth = date.getDate();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthYear = `${year}-${String(month + 1).padStart(2, '0')}`;

    const percentOfMonthElapsed = (dayOfMonth / daysInMonth) * 100;

    const expectedIncome = this.settings.expectedMonthlyIncome;
    const spendingGoalAmount = this.settings.spendingGoalAmount;
    const spendingGoalPercent = this.settings.spendingGoalPercent;

    // Simulate earned income (usually around expected, varies by scenario)
    const earnedIncomeRatio = scenario === 'variable-income' ? 0.85 : 0.96;
    const earnedIncome = expectedIncome * earnedIncomeRatio * (percentOfMonthElapsed / 100);

    // Calculate spending based on scenario
    let totalSpent: number;
    switch (scenario) {
      case 'amazing':
        // 70% of goal (well under)
        totalSpent = spendingGoalAmount * 0.70;
        break;

      case 'good':
        // 90% of income (under income but over goal)
        totalSpent = expectedIncome * 0.90;
        break;

      case 'slightly-over':
        // 105% of income (slightly over)
        totalSpent = expectedIncome * 1.05;
        break;

      case 'way-over':
        // 125% of income (way over)
        totalSpent = expectedIncome * 1.25;
        break;

      case 'variable-income':
        // 85% of expected income (proportional to month progress)
        totalSpent = expectedIncome * 0.85 * (percentOfMonthElapsed / 100);
        break;

      default:
        totalSpent = spendingGoalAmount * 0.75;
    }

    const percentOfIncomeSpent = (totalSpent / expectedIncome) * 100;

    // Determine success level
    let successLevel: 'amazing' | 'good' | 'over';
    if (totalSpent <= spendingGoalAmount) {
      successLevel = 'amazing';
    } else if (totalSpent <= expectedIncome) {
      successLevel = 'good';
    } else {
      successLevel = 'over';
    }

    // Calculate amounts for display
    const remainingToGoal = Math.max(0, spendingGoalAmount - totalSpent);
    const remainingToIncome = Math.max(0, expectedIncome - totalSpent);
    const overageAmount = Math.max(0, totalSpent - expectedIncome);

    return {
      monthYear,
      currentDate: dayOfMonth,
      daysInMonth,
      percentOfMonthElapsed,
      expectedIncome,
      earnedIncome,
      incomeGoal: expectedIncome,
      totalSpent,
      spendingGoalAmount,
      spendingGoalPercent,
      percentOfIncomeSpent,
      successLevel,
      remainingToGoal,
      remainingToIncome,
      overageAmount,
    };
  }

  private generateStreakInfo(scenario: MockScenario): SpendingStreakInfo {
    switch (scenario) {
      case 'amazing':
        return {
          currentStreak: 7,
          longestStreak: 12,
          streakStatus: 'active',
          underGoalStreak: 7,
          underIncomeStreak: 7,
        };

      case 'good':
        return {
          currentStreak: 5,
          longestStreak: 12,
          streakStatus: 'active',
          underGoalStreak: 3, // Sometimes over goal
          underIncomeStreak: 5, // Always under income
        };

      case 'way-over':
        return {
          currentStreak: 0,
          longestStreak: 12,
          streakStatus: 'broken',
          lastStreakEnd: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          underGoalStreak: 0,
          underIncomeStreak: 0,
        };

      case 'variable-income':
        return {
          currentStreak: 4,
          longestStreak: 8,
          streakStatus: 'active',
          underGoalStreak: 2,
          underIncomeStreak: 4,
        };

      default:
        return {
          currentStreak: 6,
          longestStreak: 10,
          streakStatus: 'active',
          underGoalStreak: 4,
          underIncomeStreak: 6,
        };
    }
  }

  private generateTrackedCategories(scenario: MockScenario): CategoryTracking[] {
    const spendingMultiplier =
      scenario === 'way-over' ? 1.2 :
      scenario === 'slightly-over' ? 1.05 :
      scenario === 'amazing' ? 0.7 :
      0.9;

    const categories: CategoryTracking[] = [
      {
        categoryId: '1',
        categoryName: 'Groceries',
        categoryGroupName: 'Everyday Expenses',
        isTracked: true,
        target: 600, // Has YNAB target
        budgeted: 650, // Also has budgeted (target takes precedence)
        effectiveGoal: 600,
        spent: 520 * spendingMultiplier,
        percentSpent: 0,
        remaining: 0,
        status: 'under',
      },
      {
        categoryId: '2',
        categoryName: 'Dining Out',
        categoryGroupName: 'Everyday Expenses',
        isTracked: true,
        budgeted: 300, // No target, use budgeted
        effectiveGoal: 300,
        spent: 285 * spendingMultiplier,
        percentSpent: 0,
        remaining: 0,
        status: 'under',
      },
      {
        categoryId: '3',
        categoryName: 'Gas & Fuel',
        categoryGroupName: 'Transportation',
        isTracked: true,
        target: 200,
        budgeted: 200,
        effectiveGoal: 200,
        spent: 175 * spendingMultiplier,
        percentSpent: 0,
        remaining: 0,
        status: 'under',
      },
      {
        categoryId: '4',
        categoryName: 'Entertainment',
        categoryGroupName: 'Fun',
        isTracked: true,
        target: 250,
        budgeted: 250,
        effectiveGoal: 250,
        spent: 240 * spendingMultiplier,
        percentSpent: 0,
        remaining: 0,
        status: 'under',
      },
      {
        categoryId: '5',
        categoryName: 'Shopping',
        categoryGroupName: 'Fun',
        isTracked: true,
        target: 400,
        budgeted: 400,
        effectiveGoal: 400,
        spent: 380 * spendingMultiplier,
        percentSpent: 0,
        remaining: 0,
        status: 'under',
      },
    ];

    // Calculate derived fields
    return categories.map(cat => {
      const percentSpent = (cat.spent / cat.effectiveGoal) * 100;
      const remaining = cat.effectiveGoal - cat.spent;

      let status: 'under' | 'at-goal' | 'over';
      if (percentSpent < 95) status = 'under';
      else if (percentSpent > 105) status = 'over';
      else status = 'at-goal';

      return {
        ...cat,
        percentSpent,
        remaining,
        status,
      };
    });
  }

  private generateIncomeTransactions(date: Date): IncomeTransaction[] {
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const transactions: IncomeTransaction[] = [];

    // Typical paycheck on 1st and 15th
    if (dayOfMonth >= 1) {
      transactions.push({
        transactionId: 'income-1',
        date: `${year}-${month}-01`,
        amount: 3750, // Half of monthly income
        payeeName: 'Employer Paycheck',
        categoryName: 'Income: Salary',
      });
    }

    if (dayOfMonth >= 15) {
      transactions.push({
        transactionId: 'income-2',
        date: `${year}-${month}-15`,
        amount: 3750, // Second half
        payeeName: 'Employer Paycheck',
        categoryName: 'Income: Salary',
      });
    }

    return transactions;
  }

  private generateHistoricalMonths(count: number): HistoricalMonth[] {
    const months: HistoricalMonth[] = [];
    const now = new Date();

    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      const expectedIncome = this.settings.expectedMonthlyIncome;
      const spendingGoal = this.settings.spendingGoalAmount;

      // Randomize spending with tendency toward being under income
      const variance = Math.random() * 0.3 - 0.1; // -10% to +20% variance
      const totalSpent = expectedIncome * (0.85 + variance);
      const percentOfIncomeSpent = (totalSpent / expectedIncome) * 100;

      // Earned income is usually close to expected
      const earnedIncome = expectedIncome * (0.95 + Math.random() * 0.1);

      // Determine success level
      let successLevel: 'amazing' | 'good' | 'over';
      if (totalSpent <= spendingGoal) {
        successLevel = 'amazing';
      } else if (totalSpent <= expectedIncome) {
        successLevel = 'good';
      } else {
        successLevel = 'over';
      }

      months.push({
        monthYear,
        expectedIncome,
        earnedIncome: Math.round(earnedIncome),
        totalSpent: Math.round(totalSpent),
        spendingGoal,
        percentOfIncomeSpent: Math.round(percentOfIncomeSpent * 10) / 10,
        successLevel,
        variance: Math.round(expectedIncome - totalSpent),
      });
    }

    return months;
  }
}

// Export singleton instance
export const mockDataService = new MockDataService();
