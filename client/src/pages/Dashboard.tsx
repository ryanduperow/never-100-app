import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styles from './Dashboard.module.css';
import RunwayBars from '../components/RunwayBars';
import TrackedCategories from '../components/TrackedCategories';
import DevTools from '../components/DevTools';
import { mockDataService } from '../services/mockDataService';
import type { MockScenario } from '../types';

export default function Dashboard() {
  const [currentScenario, setCurrentScenario] = useState<MockScenario>('amazing');
  const [simulationDate, setSimulationDate] = useState<Date | null>(null);

  // Fetch dashboard data using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', currentScenario, simulationDate],
    queryFn: async () => {
      // Update mock service with current scenario and date
      mockDataService.setScenario(currentScenario);
      mockDataService.setSimulationDate(simulationDate);
      return mockDataService.getDashboardData();
    },
  });

  const handleScenarioChange = (scenario: MockScenario) => {
    setCurrentScenario(scenario);
  };

  const handleSimulationDateChange = (date: Date | null) => {
    setSimulationDate(date);
  };

  if (isLoading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading your financial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.error}>
          <h2>Oops! Something went wrong</h2>
          <p>We couldn't load your dashboard data. Please try again.</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Never 100</h1>
        <p className={styles.subtitle}>Spend less than you earn</p>
      </header>

      {/* Main grid */}
      <div className={styles.grid}>
        {/* Runway Bars - Full width */}
        <div className={styles.gaugeSection}>
          <RunwayBars
            tracking={data.currentMonth}
            incomeTransactions={data.incomeTransactions}
          />
        </div>

        {/* Tracked Categories - Full width */}
        <div className={styles.categoriesSection}>
          <TrackedCategories categories={data.trackedCategories} />
        </div>
      </div>

      {/* Dev Tools */}
      <DevTools
        currentScenario={currentScenario}
        onScenarioChange={handleScenarioChange}
        simulationDate={simulationDate}
        onSimulationDateChange={handleSimulationDateChange}
      />
    </div>
  );
}
