import { useEffect, useState } from 'react';
import styles from './RunwayBars.module.css';
import type { IncomeTracking, IncomeTransaction } from '../types';

interface RunwayBarsProps {
  tracking: IncomeTracking;
  incomeTransactions: IncomeTransaction[];
}

export default function RunwayBars({ tracking, incomeTransactions }: RunwayBarsProps) {
  const [animatedTime, setAnimatedTime] = useState(0);
  const [animatedSpending, setAnimatedSpending] = useState(0);
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const [animatedEarned, setAnimatedEarned] = useState(0);

  // Animate bars and numbers on mount
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      setAnimatedTime(tracking.percentOfMonthElapsed * easeProgress);
      setAnimatedSpending(tracking.percentOfIncomeSpent * easeProgress);
      setAnimatedAmount(tracking.totalSpent * easeProgress);
      setAnimatedEarned(tracking.earnedIncome * easeProgress);

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedTime(tracking.percentOfMonthElapsed);
        setAnimatedSpending(tracking.percentOfIncomeSpent);
        setAnimatedAmount(tracking.totalSpent);
        setAnimatedEarned(tracking.earnedIncome);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [tracking.percentOfMonthElapsed, tracking.percentOfIncomeSpent, tracking.totalSpent, tracking.earnedIncome]);

  // Get status color and label
  const getStatusColor = () => {
    switch (tracking.successLevel) {
      case 'amazing':
        return 'var(--color-amazing)';
      case 'good':
        return 'var(--color-good)';
      case 'over':
        return 'var(--color-over)';
    }
  };

  const getStatusLabel = () => {
    switch (tracking.successLevel) {
      case 'amazing':
        return 'Amazing!';
      case 'good':
        return 'Good';
      case 'over':
        return 'Over Budget';
    }
  };

  const getStatusEmoji = () => {
    switch (tracking.successLevel) {
      case 'amazing':
        return '🎯';
      case 'good':
        return '👍';
      case 'over':
        return '😬';
    }
  };

  const getStatusMessage = () => {
    switch (tracking.successLevel) {
      case 'amazing':
        return `$${Math.round(tracking.remainingToGoal).toLocaleString()} remaining to goal`;
      case 'good':
        return `$${Math.round(tracking.remainingToIncome).toLocaleString()} remaining to 100%`;
      case 'over':
        return `$${Math.round(tracking.overageAmount).toLocaleString()} over income`;
    }
  };

  // Calculate bar widths (cap at 100% to prevent overflow)
  const timeBarWidth = Math.min(animatedTime, 100);
  const spendingBarWidth = Math.min(animatedSpending, 100);

  return (
    <div className={styles.container}>
      {/* Header with main amount */}
      <div className={styles.header}>
        <div className={styles.mainAmount}>
          <span className={styles.amountCurrency}>$</span>
          <span className={styles.amountValue}>{Math.round(animatedAmount).toLocaleString()}</span>
          <span className={styles.amountLabel}>spent</span>
        </div>
        <div className={styles.statusBadge} style={{ color: getStatusColor(), borderColor: getStatusColor() }}>
          <span className={styles.statusEmoji}>{getStatusEmoji()}</span>
          <span className={styles.statusText}>{getStatusLabel()}</span>
        </div>
      </div>

      {/* Runway bars container */}
      <div className={styles.runwayContainer}>
        {/* Time bar */}
        <div className={styles.barSection}>
          <div className={styles.barLabel}>
            <span className={styles.barLabelText}>Month Progress</span>
            <span className={styles.barValue}>{Math.round(animatedTime)}%</span>
          </div>
          <div className={styles.barTrack}>
            <div
              className={styles.barFillTime}
              style={{ width: `${timeBarWidth}%` }}
            />
          </div>
        </div>

        {/* Spending bar with zones */}
        <div className={styles.barSection}>
          <div className={styles.barLabel}>
            <span className={styles.barLabelText}>Money Spent</span>
            <span className={styles.barValue}>
              {Math.round(animatedSpending)}% of income
            </span>
          </div>
          <div className={styles.barTrack}>
            {/* Background zones */}
            <div className={styles.barZones}>
              <div
                className={styles.zoneAmazing}
                style={{ width: `${tracking.spendingGoalPercent}%` }}
              />
              <div
                className={styles.zoneGood}
                style={{ width: `${100 - tracking.spendingGoalPercent}%` }}
              />
            </div>

            {/* Actual spending fill */}
            <div
              className={styles.barFillSpending}
              style={{
                width: `${spendingBarWidth}%`,
                background: getStatusColor(),
              }}
            />

            {/* Goal marker */}
            <div
              className={styles.goalMarker}
              style={{ left: `${tracking.spendingGoalPercent}%` }}
              title={`${tracking.spendingGoalPercent}% Goal ($${tracking.spendingGoalAmount.toLocaleString()})`}
            >
              <div className={styles.goalMarkerLine} />
            </div>

            {/* 100% income marker */}
            <div
              className={styles.incomeMarker}
              style={{ left: '100%' }}
              title={`100% Income ($${tracking.expectedIncome.toLocaleString()})`}
            >
              <div className={styles.incomeMarkerLine} />
            </div>
          </div>
        </div>
      </div>

      {/* Status message */}
      <div className={styles.statusMessage} style={{ color: getStatusColor() }}>
        {getStatusMessage()}
      </div>

      {/* Budget info */}
      <div className={styles.budgetInfo}>
        <div className={styles.budgetItem}>
          <span className={styles.budgetLabel}>Goal</span>
          <span className={styles.budgetValue}>
            ${tracking.spendingGoalAmount.toLocaleString()}
          </span>
        </div>
        <div className={styles.budgetDivider} />
        <div className={styles.budgetItem}>
          <span className={styles.budgetLabel}>Earned</span>
          <span className={styles.budgetValue}>
            ${Math.round(animatedEarned).toLocaleString()}
          </span>
          <span className={styles.budgetSubtext}>
            of ${tracking.expectedIncome.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
