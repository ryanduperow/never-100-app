import { useState } from 'react';
import styles from './Settings.module.css';

export default function Settings() {
  // Mock settings state (will be replaced with real data in Phase 6+)
  const [expectedIncome, setExpectedIncome] = useState(7500);
  const [spendingGoalPercent, setSpendingGoalPercent] = useState(80);
  const [spendingGoalAmount, setSpendingGoalAmount] = useState(6000);
  const [currency] = useState('USD');

  // Handle income change
  const handleIncomeChange = (value: number) => {
    setExpectedIncome(value);
    setSpendingGoalAmount(Math.round(value * (spendingGoalPercent / 100)));
  };

  // Handle goal percent change
  const handleGoalPercentChange = (value: number) => {
    setSpendingGoalPercent(value);
    setSpendingGoalAmount(Math.round(expectedIncome * (value / 100)));
  };

  // Handle goal amount change
  const handleGoalAmountChange = (value: number) => {
    setSpendingGoalAmount(value);
    setSpendingGoalPercent(Math.round((value / expectedIncome) * 100));
  };

  return (
    <div className={styles.settings}>
      <header className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Configure your income tracking and spending goals</p>
      </header>

      <div className={styles.content}>
        {/* Income Settings Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Income Settings</h2>
          <p className={styles.sectionDescription}>
            Set your expected monthly income to track spending against
          </p>

          <div className={styles.settingGroup}>
            <label className={styles.label}>
              Expected Monthly Income
              <div className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>{currency === 'USD' ? '$' : currency}</span>
                <input
                  type="number"
                  value={expectedIncome}
                  onChange={(e) => handleIncomeChange(Number(e.target.value))}
                  className={styles.input}
                  min="0"
                  step="100"
                />
              </div>
            </label>
            <p className={styles.helpText}>
              Your typical monthly take-home income (after taxes)
            </p>
          </div>
        </section>

        {/* Spending Goal Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Spending Goal</h2>
          <p className={styles.sectionDescription}>
            Set your spending goal to stay below your income
          </p>

          <div className={styles.goalInputs}>
            <div className={styles.settingGroup}>
              <label className={styles.label}>
                Goal Percentage
                <div className={styles.inputWrapper}>
                  <input
                    type="number"
                    value={spendingGoalPercent}
                    onChange={(e) => handleGoalPercentChange(Number(e.target.value))}
                    className={styles.input}
                    min="1"
                    max="100"
                    step="1"
                  />
                  <span className={styles.inputSuffix}>%</span>
                </div>
              </label>
            </div>

            <div className={styles.goalDivider}>
              <span className={styles.goalDividerText}>=</span>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.label}>
                Goal Amount
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>{currency === 'USD' ? '$' : currency}</span>
                  <input
                    type="number"
                    value={spendingGoalAmount}
                    onChange={(e) => handleGoalAmountChange(Number(e.target.value))}
                    className={styles.input}
                    min="0"
                    step="100"
                  />
                </div>
              </label>
            </div>
          </div>

          <div className={styles.goalExplainer}>
            <div className={styles.goalTier}>
              <span className={styles.goalTierIcon} style={{ color: 'var(--color-amazing)' }}>✓</span>
              <div>
                <div className={styles.goalTierTitle}>Amazing</div>
                <div className={styles.goalTierDescription}>
                  Spending under ${spendingGoalAmount.toLocaleString()} ({spendingGoalPercent}% of income)
                </div>
              </div>
            </div>
            <div className={styles.goalTier}>
              <span className={styles.goalTierIcon} style={{ color: 'var(--color-good)' }}>•</span>
              <div>
                <div className={styles.goalTierTitle}>Good</div>
                <div className={styles.goalTierDescription}>
                  Spending between ${spendingGoalAmount.toLocaleString()} and ${expectedIncome.toLocaleString()} (under 100% of income)
                </div>
              </div>
            </div>
            <div className={styles.goalTier}>
              <span className={styles.goalTierIcon} style={{ color: 'var(--color-over)' }}>⚠</span>
              <div>
                <div className={styles.goalTierTitle}>Over</div>
                <div className={styles.goalTierDescription}>
                  Spending over ${expectedIncome.toLocaleString()} (exceeds income)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Tracking Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Category Tracking</h2>
          <p className={styles.sectionDescription}>
            Select which YNAB categories to track (coming in Phase 6)
          </p>

          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>📊</div>
            <div className={styles.placeholderText}>
              Category selection will be available after YNAB integration
            </div>
          </div>
        </section>

        {/* Alert Settings Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Alert Settings</h2>
          <p className={styles.sectionDescription}>
            Configure email alerts (coming in Phase 9)
          </p>

          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>🔔</div>
            <div className={styles.placeholderText}>
              Alert configuration will be available after email integration
            </div>
          </div>
        </section>

        {/* Save button */}
        <div className={styles.actions}>
          <button className={styles.saveButton}>
            Save Settings
          </button>
          <p className={styles.saveNote}>
            Settings are currently simulated and will not persist
          </p>
        </div>
      </div>
    </div>
  );
}
