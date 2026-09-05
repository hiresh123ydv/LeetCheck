import React from 'react';
import { Trophy, TrendingUp, Users, Target } from 'lucide-react';

export default function ContestStats({ contest }) {
  if (!contest || contest.attendedContestsCount === 0) {
    return (
      <div className="contest-box">
        <div className="section-label-row">
          <span className="section-label">
            <Trophy size={15} />
            <span>Contest Rating</span>
          </span>
        </div>
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--profile-muted)', fontSize: '0.9rem' }}>
          No contest participation recorded.
        </div>
      </div>
    );
  }

  const rating = contest.rating ? Math.round(contest.rating) : 'Unrated';
  const attended = contest.attendedContestsCount || 0;
  const globalRank = contest.globalRanking ? contest.globalRanking.toLocaleString() : null;
  const topPercentage = contest.topPercentage ? `${contest.topPercentage.toFixed(1)}%` : null;

  return (
    <div className="contest-box">
      <div className="section-label-row">
        <span className="section-label">
          <Trophy size={15} />
          <span>Contest Rating</span>
        </span>
        <span className="badge-count-pill" style={{ background: 'rgba(34, 211, 238, 0.15)', color: '#a5f3fc' }}>
          {rating} Rating
        </span>
      </div>

      <div className="contest-metrics-grid">
        <div className="contest-metric-card">
          <div className="contest-metric-title">Contests Attended</div>
          <div className="contest-metric-value">{attended}</div>
        </div>

        {topPercentage && (
          <div className="contest-metric-card">
            <div className="contest-metric-title">Top Percentage</div>
            <div className="contest-metric-value">{topPercentage}</div>
          </div>
        )}

        {globalRank && (
          <div className="contest-metric-card">
            <div className="contest-metric-title">Contest Rank</div>
            <div className="contest-metric-value" style={{ fontSize: '1.15rem' }}>#{globalRank}</div>
          </div>
        )}

        {contest.totalParticipants && (
          <div className="contest-metric-card">
            <div className="contest-metric-title">Participants</div>
            <div className="contest-metric-value" style={{ fontSize: '1.15rem' }}>
              {(contest.totalParticipants / 1000).toFixed(0)}k
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
