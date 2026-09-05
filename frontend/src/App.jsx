import React, { useState, useCallback } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import SearchBox from './components/SearchBox';
import LoadingState from './components/LoadingState';
import ProfileHeader from './components/ProfileHeader';
import SolvedProgress from './components/SolvedProgress';
import DifficultyStats from './components/DifficultyStats';
import BadgeSection from './components/BadgeSection';
import ContestStats from './components/ContestStats';
import SubmissionHeatmap from './components/SubmissionHeatmap';
import RoastCard from './components/RoastCard';
import InteractiveBackground from './components/InteractiveBackground';
import { analyzeUser, fetchRoast } from './services/api';
import './App.css';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'loading' | 'profile'
  const [activeUsername, setActiveUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [roastText, setRoastText] = useState(null);
  const [isFetchingRoast, setIsFetchingRoast] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = useCallback(async (username) => {
    setError(null);
    setActiveUsername(username);
    setView('loading');

    const startTime = Date.now();

    try {
      // 1. Fetch user analysis from backend /analyze/{username}
      const data = await analyzeUser(username);
      setUserData(data);

      if (data.roast) {
        setRoastText(data.roast);
      } else {
        // Pre-fetch roast in parallel if not bundled
        setIsFetchingRoast(true);
        fetchRoast(username)
          .then((r) => setRoastText(r))
          .catch((err) => console.warn('Roast fetch failed:', err))
          .finally(() => setIsFetchingRoast(false));
      }

      // Ensure scanning animation and message sequence are experienced
      const elapsed = Date.now() - startTime;
      const minScanningDuration = 2600;
      const remaining = Math.max(0, minScanningDuration - elapsed);

      setTimeout(() => {
        setView('profile');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, remaining);

    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setView('landing');
    }
  }, []);

  const handleReset = useCallback(() => {
    setView('landing');
    setUserData(null);
    setRoastText(null);
    setError(null);
    setActiveUsername('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className={`app-container ${view === 'profile' ? 'profile-theme' : ''}`}>
      {/* Interactive Background Grid Canvas with Cursor Lighting */}
      <InteractiveBackground />

      {/* Top Brand Bar */}
      <header className="site-header">
        <div className="brand-logo" onClick={handleReset} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleReset()}>
          <div className="brand-icon">
            <Flame size={17} color="#fff" />
          </div>
          <span className="brand-name">LeetCheck</span>
        </div>

        <div className="badge-pill">
          <Sparkles size={11} style={{ display: 'inline', marginRight: '4px' }} />
          <span>Groq GPT-OSS 120B</span>
        </div>
      </header>

      {/* Main Page States */}
      <main>
        {view === 'landing' && (
          <section className="hero-section">
            <div className="hero-brand-title">LEETCHECK</div>

            <div className="hero-tag">
              <span className="hero-tag-dot" />
              <span>GROQ GPT-OSS 120B — AI PROFILE ROASTER</span>
            </div>

            <h1 className="hero-title">
              Your LeetCode profile <br />
              <span className="gradient-text">is about to get exposed.</span>
            </h1>

            <p className="hero-subtitle">
              Enter your username. We’ll do the rest.
            </p>

            <SearchBox
              onSearch={handleSearch}
              isLoading={false}
              error={error}
            />
          </section>
        )}

        {view === 'loading' && (
          <LoadingState username={activeUsername} />
        )}

        {view === 'profile' && userData && (
          <section className="profile-view">
            <div className="profile-content">
              {/* Profile Header */}
              <ProfileHeader user={userData} onReset={handleReset} />

              {/* Primary Analytics: Circular Solved Progress & Difficulty breakdown */}
              <div className="analytics-grid">
                <SolvedProgress solvedList={userData.solved} />
                <DifficultyStats solvedList={userData.solved} />
              </div>

              {/* Secondary Analytics: Badges and Contest Statistics */}
              <div className="secondary-stats-row">
                <BadgeSection badges={userData.badges} />
                <ContestStats contest={userData.contest} />
              </div>

              {/* Submission Activity Heatmap */}
              <SubmissionHeatmap
                solvedList={userData.solved}
                submissionCalendar={userData.submissionCalendar}
              />

              {/* The Signature Interactive Roast Card with 3D Flip */}
              <RoastCard
                roastText={roastText}
                isFetchingRoast={isFetchingRoast}
                onReset={handleReset}
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
