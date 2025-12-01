import { useEffect, useState } from 'react';
import styles from './TrackedCategories.module.css';
import type { CategoryTracking } from '../types';

interface TrackedCategoriesProps {
  categories: CategoryTracking[];
}

export default function TrackedCategories({ categories }: TrackedCategoriesProps) {
  // Filter to only show tracked categories
  const trackedCategories = categories.filter(cat => cat.isTracked);

  if (trackedCategories.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Tracked Categories</h2>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <div className={styles.emptyTitle}>No categories tracked yet</div>
          <div className={styles.emptyDescription}>
            Select categories in Settings to track your spending
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Tracked Categories</h2>
      <div className={styles.grid}>
        {trackedCategories.map((category, index) => (
          <CategoryCard key={category.categoryId} category={category} index={index} />
        ))}
      </div>
    </div>
  );
}

interface CategoryCardProps {
  category: CategoryTracking;
  index: number;
}

function CategoryCard({ category, index }: CategoryCardProps) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercent(category.percentSpent);
    }, index * 100);

    return () => clearTimeout(timer);
  }, [category.percentSpent, index]);

  const getStatusColor = () => {
    switch (category.status) {
      case 'over':
        return 'var(--color-over)';
      case 'under':
        return 'var(--color-amazing)';
      default:
        return 'var(--color-good)';
    }
  };

  // Calculate the stroke-dashoffset for the circular progress
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(animatedPercent, 100) / 100) * circumference;

  return (
    <div className={styles.card} style={{ animationDelay: `${index * 0.05}s` }}>
      {/* Circular gauge */}
      <div className={styles.gaugeContainer}>
        <svg className={styles.gauge} viewBox="0 0 84 84">
          {/* Background circle */}
          <circle
            cx="42"
            cy="42"
            r={radius}
            fill="none"
            stroke="var(--color-gauge-bg)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx="42"
            cy="42"
            r={radius}
            fill="none"
            stroke={getStatusColor()}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 42 42)"
            className={styles.gaugeProgress}
          />
        </svg>
        {/* Percentage in center */}
        <div className={styles.gaugeLabel}>
          <span className={styles.gaugePercent}>{Math.round(category.percentSpent)}</span>
          <span className={styles.gaugePercentSign}>%</span>
        </div>
      </div>

      {/* Category info */}
      <div className={styles.categoryInfo}>
        <div className={styles.categoryName}>{category.categoryName}</div>
        <div className={styles.categoryGroup}>{category.categoryGroupName}</div>
      </div>

      {/* Amount info */}
      <div className={styles.amountInfo}>
        <div className={styles.spent}>${Math.round(category.spent).toLocaleString()}</div>
        <div className={styles.goal}>of ${category.effectiveGoal.toLocaleString()}</div>
      </div>

      {/* Remaining/Overage indicator */}
      {category.remaining > 0 ? (
        <div className={styles.remaining}>
          ${Math.round(category.remaining).toLocaleString()} left
        </div>
      ) : (
        <div className={styles.overage}>
          ${Math.round(Math.abs(category.remaining)).toLocaleString()} over
        </div>
      )}
    </div>
  );
}
