import React from 'react';
import { Globe, Award, Star, ArrowLeft } from 'lucide-react';

export default function ProfileHeader({ user, onReset }) {
  const profile = user?.profile || {};
  const username = user?.username || 'user';
  const realName = profile.realName;
  const country = profile.countryName;
  const ranking = profile.ranking;
  const reputation = profile.reputation;
  const starRating = profile.starRating;

  return (
    <header className="profile-header-card">
      <div className="profile-meta-primary">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <span className="profile-tag">LeetCode Profile</span>
          {ranking && (
            <span className="detail-chip ranking-chip">
              <Award size={12} />
              <span>Rank #{ranking.toLocaleString()}</span>
            </span>
          )}
        </div>

        <h1 className="profile-username">@{username}</h1>

        {realName && (
          <p className="profile-realname">{realName}</p>
        )}

        <div className="profile-extra-details" style={{ marginTop: '0.6rem' }}>
          {country && (
            <span className="detail-chip">
              <Globe size={13} />
              <span>{country}</span>
            </span>
          )}
          {starRating > 0 && (
            <span className="detail-chip">
              <Star size={13} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
              <span>{starRating.toFixed(1)} Stars</span>
            </span>
          )}
          {reputation > 0 && (
            <span className="detail-chip">
              <span>Rep: {reputation}</span>
            </span>
          )}
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={onReset}
          className="detail-chip highlight"
          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          aria-label="Roast another profile"
        >
          <ArrowLeft size={14} />
          <span>New Search</span>
        </button>
      </div>
    </header>
  );
}
