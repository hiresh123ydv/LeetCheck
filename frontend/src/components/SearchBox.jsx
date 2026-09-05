import React, { useState } from 'react';
import { ArrowRight, Sparkles, Terminal, AlertCircle } from 'lucide-react';

export default function SearchBox({ onSearch, isLoading, error }) {
  const [username, setUsername] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isBursting, setIsBursting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = username.trim();
    if (!clean || isLoading) return;

    // Trigger expanding light effect on submit
    setIsBursting(true);
    setTimeout(() => {
      setIsBursting(false);
      onSearch(clean);
    }, 400);
  };

  return (
    <div className={`search-container ${isFocused ? 'is-focused' : ''} ${isBursting ? 'is-active' : ''}`}>
      {/* Broad Soft Atmospheric Luminous Glow (50-120px) */}
      <div className="search-atmosphere" aria-hidden="true">
        <div className="search-glow-layer-1" />
        <div className="search-glow-layer-2" />
      </div>

      {/* Burst pulse animation on click */}
      {isBursting && <div className="expanding-burst" aria-hidden="true" />}

      {/* Main Input Wrapper */}
      <form onSubmit={handleSubmit} className="search-box-wrapper">
        <div className="search-box-inner">
          <span className="search-icon-prefix">
            <Terminal size={18} />
          </span>
          <input
            id="leetcode-username-input"
            type="text"
            className="search-input"
            placeholder="Enter LeetCode username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
            aria-label="LeetCode username"
          />
          <button
            type="submit"
            className="search-submit-btn"
            disabled={isLoading || !username.trim()}
            aria-label="Submit search"
          >
            <span>ROAST ME</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>

      {/* Secondary affordance / quick hint */}
      <div className="roast-cta-action">
        <button
          type="button"
          className="roast-cta-btn"
          onClick={handleSubmit}
          disabled={isLoading || !username.trim()}
        >
          <Sparkles size={14} />
          <span>Reveal the truth</span>
        </button>
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="search-error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
