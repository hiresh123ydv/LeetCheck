import React from 'react';
import { Award, ChevronRight } from 'lucide-react';

export default function BadgeSection({ badges }) {
  const badgeList = badges || [];
  const badgeCount = badgeList.length;
  const mostRecent = badgeList[0];

  return (
    <div className="badge-box">
      <div className="section-label-row">
        <span className="section-label">
          <Award size={15} />
          <span>Badges</span>
        </span>
        <span className="badge-count-pill">{badgeCount}</span>
      </div>

      {badgeCount > 0 ? (
        <>
          <div className="badges-list">
            {badgeList.slice(0, 5).map((badge) => (
              <div
                key={badge.id || badge.displayName || badge.name}
                className="badge-item"
                title={badge.displayName || badge.name}
              >
                {badge.icon ? (
                  <img
                    src={badge.icon.startsWith('http') ? badge.icon : `https://leetcode.com${badge.icon}`}
                    alt={badge.displayName || badge.name}
                    className="badge-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <Award size={24} color="#60a5fa" />
                )}
              </div>
            ))}
          </div>

          {mostRecent && (
            <div className="badge-recent-box">
              <div className="badge-recent-title">Most Recent Badge</div>
              <div className="badge-recent-name">{mostRecent.displayName || mostRecent.name}</div>
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--profile-muted)', fontSize: '0.9rem' }}>
          No badges earned yet. Time to start solving!
        </div>
      )}
    </div>
  );
}
