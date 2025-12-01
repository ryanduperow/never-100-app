import type {
  DashboardData,
  MonthlyPacing,
  StreakInfo,
  CategorySpending,
  HistoricalMonth,
  TrendData,
  UserSettings,
  MockScenario,
} from '../types';

/**
 * Mock data service for UI development and testing
 * Provides realistic scenarios for different pacing situations
 */

class MockDataService {
  private currentScenario: MockScenario = 'healthy';
  private simulationDate: Date | null = null;

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
    const monthYear = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    return {
      currentMonth: this.generateMonthlyPacing(this.currentScenario, currentDate),
      streakInfo: this.generateStreakInfo(this.currentScenario),
      topCategories: this.generateTopCategories(this.currentScenario),
      lastSyncTime: new Date().toISOString(),
    };
  }

  async getTrendData(): Promise<TrendData> {
    await this.delay(300);

    const months = this.generateHistoricalMonths(12);
    const monthsUnderBudget = months.filter((m) => m.underBudget).length;

    return {
      months,
      averageMonthlySpending: months.reduce((sum, m) => sum + m.spent, 0) / months.length,
      averagePercentSpent: months.reduce((sum, m) => sum + m.percentSpent, 0) / months.length,
      monthsUnderBudget,
      monthsOverBudget: months.length - monthsUnderBudget,
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
        warningThreshold: 105,
        criticalThreshold: 110,
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

  private generateMonthlyPacing(scenario: MockScenario, date: Date): MonthlyPacing {
    const year = date.getFullYear();
    const month = date.getMonth();
    const dayOfMonth = date.getDate();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthYear = `${year}-${String(month + 1).padStart(2, '0')}`;

    const percentOfMonthElapsed = (dayOfMonth / daysInMonth) * 100;

    // Base budget amount
    const budgeted = 3500;

    // Calculate spent based on scenario
    let spent: number;
    let pacingMultiplier: number;

    switch (scenario) {
      case 'healthy':
        pacingMultiplier = 0.92; // 92% pacing - slightly under
        spent = budgeted * percentOfMonthElapsed * pacingMultiplier / 100;
        break;

      case 'slight-over':
        pacingMultiplier = 1.08; // 108% pacing
        spent = budgeted * percentOfMonthElapsed * pacingMultiplier / 100;
        break;

      case 'danger':
        pacingMultiplier = 1.18; // 118% pacing
        spent = budgeted * percentOfMonthElapsed * pacingMultiplier / 100;
        break;

      case 'way-under':
        pacingMultiplier = 0.65; // 65% pacing - way under
        spent = budgeted * percentOfMonthElapsed * pacingMultiplier / 100;
        break;

      case 'mid-month':
        // Force to day 15 for testing
        const midMonthPercent = (15 / daysInMonth) * 100;
        pacingMultiplier = 0.95;
        spent = budgeted * midMonthPercent * pacingMultiplier / 100;
        break;

      case 'end-of-month':
        // Force to day 28+ for testing
        const endMonthPercent = (Math.min(dayOfMonth, 28) / daysInMonth) * 100;
        pacingMultiplier = 0.98;
        spent = budgeted * endMonthPercent * pacingMultiplier / 100;
        break;

      default:
        pacingMultiplier = 1.0;
        spent = budgeted * percentOfMonthElapsed / 100;
    }

    const expectedSpending = budgeted * (percentOfMonthElapsed / 100);
    const percentSpent = (spent / budgeted) * 100;
    const pacingPercentage = (spent / expectedSpending) * 100;

    // Determine status
    let pacingStatus: 'under' | 'on-track' | 'over';
    if (pacingPercentage < 95) {
      pacingStatus = 'under';
    } else if (pacingPercentage > 105) {
      pacingStatus = 'over';
    } else {
      pacingStatus = 'on-track';
    }

    // Projections
    const projectedEndOfMonthSpending = (spent / percentOfMonthElapsed) * 100;
    const projectedOverage = Math.max(0, projectedEndOfMonthSpending - budgeted);

    // Time vs Money calculations
    const timeElapsedPercent = percentOfMonthElapsed;
    const moneySpentPercent = percentSpent;
    const timeAheadBehind = timeElapsedPercent - moneySpentPercent;
    const moneyAheadBehind = budgeted * (timeElapsedPercent / 100) - spent;

    return {
      monthYear,
      currentDate: dayOfMonth,
      daysInMonth,
      percentOfMonthElapsed,
      budgeted,
      spent,
      percentSpent,
      expectedSpending,
      pacingPercentage,
      pacingStatus,
      projectedEndOfMonthSpending,
      projectedOverage,
      timeAheadBehind,
      moneyAheadBehind,
    };
  }

  private generateStreakInfo(scenario: MockScenario): StreakInfo {
    switch (scenario) {
      case 'healthy':
      case 'slight-over':
        return {
          currentStreak: 7,
          longestStreak: 12,
          streakStatus: 'active',
        };

      case 'danger':
        return {
          currentStreak: 0,
          longestStreak: 12,
          streakStatus: 'broken',
          lastStreakEnd: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        };

      case 'way-under':
        return {
          currentStreak: 3,
          longestStreak: 8,
          streakStatus: 'active',
        };

      default:
        return {
          currentStreak: 5,
          longestStreak: 10,
          streakStatus: 'active',
        };
    }
  }

  private generateTopCategories(scenario: MockScenario): CategorySpending[] {
    const basePacing = scenario === 'danger' ? 1.15 : scenario === 'slight-over' ? 1.08 : 0.95;

    return [
      {
        categoryId: '1',
        categoryName: 'Groceries',
        categoryGroupName: 'Everyday Expenses',
        budgeted: 600,
        spent: 520 * basePacing,
        percentSpent: (520 * basePacing / 600) * 100,
        pacingStatus: basePacing > 1.05 ? 'over' : basePacing < 0.95 ? 'under' : 'on-track',
      },
      {
        categoryId: '2',
        categoryName: 'Dining Out',
        categoryGroupName: 'Everyday Expenses',
        budgeted: 300,
        spent: 285 * basePacing,
        percentSpent: (285 * basePacing / 300) * 100,
        pacingStatus: basePacing > 1.05 ? 'over' : basePacing < 0.95 ? 'under' : 'on-track',
      },
      {
        categoryId: '3',
        categoryName: 'Gas & Fuel',
        categoryGroupName: 'Transportation',
        budgeted: 200,
        spent: 175 * basePacing,
        percentSpent: (175 * basePacing / 200) * 100,
        pacingStatus: basePacing > 1.05 ? 'over' : basePacing < 0.95 ? 'under' : 'on-track',
      },
      {
        categoryId: '4',
        categoryName: 'Entertainment',
        categoryGroupName: 'Fun',
        budgeted: 250,
        spent: 240 * basePacing,
        percentSpent: (240 * basePacing / 250) * 100,
        pacingStatus: basePacing > 1.05 ? 'over' : basePacing < 0.95 ? 'under' : 'on-track',
      },
      {
        categoryId: '5',
        categoryName: 'Shopping',
        categoryGroupName: 'Fun',
        budgeted: 400,
        spent: 380 * basePacing,
        percentSpent: (380 * basePacing / 400) * 100,
        pacingStatus: basePacing > 1.05 ? 'over' : basePacing < 0.95 ? 'under' : 'on-track',
      },
    ];
  }

  private generateHistoricalMonths(count: number): HistoricalMonth[] {
    const months: HistoricalMonth[] = [];
    const now = new Date();

    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      // Randomize spending with tendency toward being under budget
      const budgeted = 3500;
      const variance = Math.random() * 0.3 - 0.05; // -5% to +25% variance
      const spent = budgeted * (1 + variance);
      const percentSpent = (spent / budgeted) * 100;
      const underBudget = spent <= budgeted;

      months.push({
        monthYear,
        budgeted,
        spent: Math.round(spent),
        percentSpent: Math.round(percentSpent * 10) / 10,
        underBudget,
        variance: Math.round(budgeted - spent),
      });
    }

    return months;
  }
}

// Export singleton instance
export const mockDataService = new MockDataService();
