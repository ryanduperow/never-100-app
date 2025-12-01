import { useState } from 'react';
import styles from './DevTools.module.css';
import type { MockScenario } from '../types';

interface DevToolsProps {
  currentScenario: MockScenario;
  onScenarioChange: (scenario: MockScenario) => void;
  simulationDate: Date | null;
  onSimulationDateChange: (date: Date | null) => void;
}

const scenarios: { value: MockScenario; label: string; description: string }[] = [
  { value: 'amazing', label: '✨ Amazing', description: 'Spending under 80% goal' },
  { value: 'good', label: '✓ Good', description: 'Spending 80-100% of income' },
  { value: 'slightly-over', label: '⚠ Slightly Over', description: 'Spending 100-110% of income' },
  { value: 'way-over', label: '🔴 Way Over', description: 'Spending 125% of income' },
  { value: 'variable-income', label: '💰 Variable Income', description: 'Testing income variation' },
];

export default function DevTools({
  currentScenario,
  onScenarioChange,
  simulationDate,
  onSimulationDateChange,
}: DevToolsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onSimulationDateChange(new Date(e.target.value));
    } else {
      onSimulationDateChange(null);
    }
  };

  const resetDate = () => {
    onSimulationDateChange(null);
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className={styles.devTools}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className={styles.toggleIcon}>🛠️</span>
        Dev Tools
        <span className={styles.toggleArrow}>{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className={styles.devToolsContent}>
          {/* Scenario Switcher */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Test Scenarios</h4>
            <div className={styles.scenarioGrid}>
              {scenarios.map((scenario) => (
                <button
                  key={scenario.value}
                  className={`${styles.scenarioButton} ${
                    currentScenario === scenario.value ? styles.scenarioButtonActive : ''
                  }`}
                  onClick={() => onScenarioChange(scenario.value)}
                >
                  <div className={styles.scenarioLabel}>{scenario.label}</div>
                  <div className={styles.scenarioDescription}>{scenario.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Simulation Date Picker */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Simulation Date</h4>
            <div className={styles.dateControls}>
              <input
                type="date"
                className={styles.dateInput}
                value={formatDateForInput(simulationDate)}
                onChange={handleDateChange}
              />
              <button className={styles.resetButton} onClick={resetDate}>
                Reset to Today
              </button>
            </div>
            {simulationDate && (
              <div className={styles.dateInfo}>
                Simulating: {simulationDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            )}
          </div>

          {/* Info */}
          <div className={styles.infoBox}>
            <strong>Dev Mode Active:</strong> Using mock data for rapid UI testing. Switch scenarios
            and dates to see how the dashboard responds to different spending situations.
          </div>
        </div>
      )}
    </div>
  );
}
