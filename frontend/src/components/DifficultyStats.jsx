import React, { useEffect, useState } from 'react';

const DIFFICULTY_TOTALS = {
  Easy: 962,
  Medium: 2109,
  Hard: 971,
};

export default function DifficultyStats({ solvedList }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const getStat = (diffName) => {
    return solvedList?.find((item) => item.difficulty.toLowerCase() === diffName.toLowerCase()) || {
      count: 0,
      submissions: 0,
    };
  };

  const categories = [
    {
      key: 'easy',
      name: 'Easy',
      total: DIFFICULTY_TOTALS.Easy,
      stat: getStat('Easy'),
      cardClass: 'diff-card-easy',
    },
    {
      key: 'medium',
      name: 'Medium',
      total: DIFFICULTY_TOTALS.Medium,
      stat: getStat('Medium'),
      cardClass: 'diff-card-medium',
    },
    {
      key: 'hard',
      name: 'Hard',
      total: DIFFICULTY_TOTALS.Hard,
      stat: getStat('Hard'),
      cardClass: 'diff-card-hard',
    },
  ];

  return (
    <div className="difficulty-wrapper">
      {categories.map((cat) => {
        const solved = cat.stat.count || 0;
        const total = cat.total;
        const pct = Math.min(100, Math.round((solved / total) * 100 * 10) / 10);

        return (
          <div key={cat.key} className={`difficulty-card ${cat.cardClass}`}>
            <div className="diff-info">
              <span className="diff-title">
                <span className="diff-indicator" />
                {cat.name}
              </span>
              <div className="diff-counts">
                <span className="diff-solved-val">{solved}</span>
                <span className="diff-total-val">/ {total}</span>
              </div>
              {cat.stat.submissions > 0 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--profile-muted)' }}>
                  {cat.stat.submissions} attempts
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div className="diff-bar-container">
                <div
                  className="diff-bar-fill"
                  style={{ width: animated ? `${Math.max(3, pct)}%` : '0%' }}
                />
              </div>
              <span className="diff-percentage-tag">{pct}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
