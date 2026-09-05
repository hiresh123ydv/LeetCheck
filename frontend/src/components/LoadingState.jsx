import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, Activity } from 'lucide-react';

const SCAN_MESSAGES = [
  'Finding your stats...',
  'Reading your problem history...',
  'Checking your contest history...',
  'Analyzing your profile...',
  'Preparing your roast...',
];

export default function LoadingState({ username }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Cycle messages at a natural, readable cadence (~700ms)
    const msgInterval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % SCAN_MESSAGES.length);
    }, 700);

    // Progress bar increments smoothly
    const progInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 96) return 96;
        return prev + Math.floor(Math.random() * 8 + 4);
      });
    }, 200);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
    };
  }, []);

  return (
    <div className="modern-loading-experience" aria-live="polite">
      {/* HUD Scanner Container */}
      <div className="classy-scanner-box">
        {/* Decorative HUD Corner Accents */}
        <div className="hud-corner top-left" />
        <div className="hud-corner top-right" />
        <div className="hud-corner bottom-left" />
        <div className="hud-corner bottom-right" />

        {/* Central Holographic Radar */}
        <div className="holo-radar-wrapper">
          {/* Ambient Glow Aura */}
          <div className="holo-glow-aura" />

          {/* SVG Animated Concentric Rings */}
          <svg className="holo-svg-rings" viewBox="0 0 160 160">
            <defs>
              <linearGradient id="scannerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>

            {/* Outer dashed ring */}
            <circle
              className="holo-ring-outer"
              cx="80"
              cy="80"
              r="72"
            />

            {/* Middle counter-rotating ring */}
            <circle
              className="holo-ring-middle"
              cx="80"
              cy="80"
              r="52"
            />

            {/* Inner target circle */}
            <circle
              className="holo-ring-inner"
              cx="80"
              cy="80"
              r="32"
            />

            {/* Crosshairs */}
            <line x1="80" y1="10" x2="80" y2="30" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5" />
            <line x1="80" y1="130" x2="80" y2="150" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5" />
            <line x1="10" y1="80" x2="30" y2="80" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5" />
            <line x1="130" y1="80" x2="150" y2="80" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5" />
          </svg>

          {/* Rotating Conic Radar Sweep */}
          <div className="radar-sweep-beam" />

          {/* Vertical Laser Scanline */}
          <div className="radar-scanline-laser" />

          {/* Core Center Pulse */}
          <div className="radar-core-pulse">
            <Activity size={18} color="#22d3ee" />
          </div>
        </div>
      </div>

      {/* Status Meta Pill */}
      <div className="scanner-status-pill">
        <span className="live-status-dot" />
        <span className="scanner-status-label">
          SCANNING {username ? `@${username.toUpperCase()}` : 'PROFILE'}
        </span>
      </div>

      {/* Main Title */}
      <h2 className="classy-loading-title">SCANNING PROFILE...</h2>

      {/* Cycling Status Messages with Console Prompt */}
      <div className="classy-message-stream">
        <div className="message-prompt-row" key={msgIdx}>
          <span className="prompt-arrow">&gt;</span>
          <span className="prompt-text">{SCAN_MESSAGES[msgIdx]}</span>
          <span className="prompt-cursor" />
        </div>
      </div>

      {/* Sleek Progress Telemetry */}
      <div className="scanner-telemetry">
        <div className="telemetry-bar-bg">
          <div
            className="telemetry-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="telemetry-labels">
          <span>DECRYPTING METRICS</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
