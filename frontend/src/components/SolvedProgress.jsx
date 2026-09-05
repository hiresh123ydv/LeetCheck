import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

// Current active catalog sizes in LeetCode
const DEFAULT_TOTAL_QUESTIONS = 4042;

export default function SolvedProgress({ solvedList }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const allStat = solvedList?.find((item) => item.difficulty === 'All') || { count: 0, submissions: 0 };
  const solvedCount = allStat.count || 0;
  const submissionsCount = allStat.submissions || 0;
  
  // Total LeetCode questions pool reference
  const totalQuestions = DEFAULT_TOTAL_QUESTIONS;
  const percentage = Math.min(100, Math.round((solvedCount / totalQuestions) * 100 * 10) / 10);

  // SVG circular dimensions
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(percentage);
    }, 150);
    return () => clearTimeout(timer);
  }, [percentage]);

  const acceptanceRate = submissionsCount > 0 
    ? Math.min(100, Math.round((solvedCount / submissionsCount) * 100 * 10) / 10) 
    : null;

  return (
    <div className="solved-card">
      <div className="circular-chart-wrapper">
        <svg viewBox="0 0 100 100" className="circular-chart">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="60%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            className="circle-bg"
            cx="50"
            cy="50"
            r={radius}
          />

          {/* Animated Progress circle */}
          <circle
            className="circle-progress"
            cx="50"
            cy="50"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className="chart-center-content">
          <span className="chart-number-highlight">{solvedCount}</span>
          <span className="chart-total-sub">/ {totalQuestions}</span>
          <span className="chart-solved-label">
            <Check size={14} /> Solved
          </span>
        </div>
      </div>

      <div className="solved-footer-stats">
        <div className="sub-metric">
          <div className="sub-metric-label">Completed</div>
          <div className="sub-metric-val">{percentage}%</div>
        </div>
        {acceptanceRate !== null && (
          <div className="sub-metric">
            <div className="sub-metric-label">Acceptance</div>
            <div className="sub-metric-val">{acceptanceRate}%</div>
          </div>
        )}
        <div className="sub-metric">
          <div className="sub-metric-label">Submissions</div>
          <div className="sub-metric-val">{submissionsCount.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
