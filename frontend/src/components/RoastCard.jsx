import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Flame, Sparkles, RefreshCw, Zap, ShieldAlert, FastForward } from 'lucide-react';

export default function RoastCard({ roastText, isFetchingRoast, onReset }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef(null);
  const streamContainerRef = useRef(null);

  // Separate main body from final verdict
  const { bodyToStream, finalVerdict } = useMemo(() => {
    if (!roastText) return { bodyToStream: '', finalVerdict: null };

    const clean = roastText.replace(/\r\n/g, '\n').trim();
    const verdictMatch = clean.match(/(?:\*\*Final Verdict\*\*|Final Verdict:?)\s*([\s\S]*)$/i);

    if (verdictMatch) {
      return {
        bodyToStream: clean.substring(0, verdictMatch.index).trim(),
        finalVerdict: verdictMatch[1].trim(),
      };
    }

    return {
      bodyToStream: clean,
      finalVerdict: null,
    };
  }, [roastText]);

  // Break text into natural continuous token chunks (1 to 2 words per chunk)
  const tokenChunks = useMemo(() => {
    if (!bodyToStream) return [];

    // Split into tokens preserving spaces and newlines
    const rawTokens = bodyToStream.match(/\S+|\s+/g) || [];
    const chunks = [];
    let buffer = '';

    for (let i = 0; i < rawTokens.length; i++) {
      const tok = rawTokens[i];
      buffer += tok;
      // If token is a word or newline, group every 1-2 words into a chunk
      if (/\S/.test(tok)) {
        chunks.push(buffer);
        buffer = '';
      }
    }
    if (buffer) chunks.push(buffer);

    return chunks;
  }, [bodyToStream]);

  // Flip and start continuous stream
  const handleReveal = () => {
    setIsFlipped(true);
    setStreamedText('');
    setIsCompleted(false);

    // If text is already loaded, start continuous streaming after flip completes
    if (tokenChunks.length > 0) {
      startContinuousStream(0);
    }
  };

  const startContinuousStream = (startIndex = 0) => {
    setIsStreaming(true);
    let index = startIndex;

    // Wait 750ms for card flip animation to finish
    const initialDelay = setTimeout(() => {
      const step = () => {
        if (index < tokenChunks.length) {
          // Stream 1 chunk at a time for fluid continuous reading
          setStreamedText((prev) => prev + tokenChunks[index]);
          index++;

          // Auto-scroll lightly if needed
          if (streamContainerRef.current) {
            streamContainerRef.current.scrollTop = streamContainerRef.current.scrollHeight;
          }

          // Small natural cadence: ~45ms between chunks
          timerRef.current = setTimeout(step, 45);
        } else {
          setIsStreaming(false);
          setIsCompleted(true);
        }
      };
      step();
    }, 750);

    timerRef.current = initialDelay;
  };

  // If roast was fetching while flipped, resume when ready
  useEffect(() => {
    if (isFlipped && !isStreaming && !isCompleted && tokenChunks.length > 0) {
      startContinuousStream(0);
    }
  }, [isFlipped, tokenChunks]);

  // Skip / speed up animation on demand
  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStreamedText(bodyToStream);
    setIsStreaming(false);
    setIsCompleted(true);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Format streamed text into clean elements (bold, bullet lines, paragraphs)
  const renderedContent = useMemo(() => {
    if (!streamedText) return null;

    const lines = streamedText.split('\n');
    return lines.map((line, lIdx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={lIdx} style={{ height: '0.65rem' }} />;

      const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
      let content = trimmed;
      if (isBullet) {
        content = trimmed.replace(/^[-*]\s+/, '');
      }

      // Parse inline **bold**
      const parts = content.split(/(\*\*[^*]+\*\*)/g);

      const parsedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} style={{ color: '#fff', fontWeight: 700 }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={lIdx} className="roast-chunk-item bullet-chunk">
            <span className="roast-chunk-bullet">▪</span>
            <span>{parsedParts}</span>
          </div>
        );
      }

      const isHeading = trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes(':');
      return (
        <div
          key={lIdx}
          className={`roast-chunk-item ${isHeading ? 'bold-chunk' : ''}`}
          style={isHeading ? { fontSize: '1.25rem', color: '#fff', marginBottom: '0.75rem' } : {}}
        >
          {parsedParts}
        </div>
      );
    });
  }, [streamedText]);

  return (
    <div className={`roast-section ${isFlipped ? 'is-flipped' : ''}`}>
      {/* Broad Atmospheric Glow (60-120px) */}
      <div className="roast-card-atmosphere" aria-hidden="true" />

      {/* 3D Flipper Container */}
      <div className="roast-card-flipper">
        {/* ================= FRONT FACE ================= */}
        <div className="roast-face roast-face-front">
          <div className="roast-front-badge">
            <Sparkles size={14} />
            <span>AI Roast Ready</span>
          </div>

          <h2 className="roast-front-title">Your profile is ready.</h2>
          <p className="roast-front-subtitle">
            Groq GPT-OSS 120B has dissected your statistics. Think you can handle the roast?
          </p>

          <button
            type="button"
            className="roast-reveal-btn"
            onClick={handleReveal}
            aria-label="Reveal my roast"
          >
            <Flame size={20} />
            <span>Reveal My Roast</span>
          </button>
        </div>

        {/* ================= BACK FACE ================= */}
        <div className="roast-face roast-face-back">
          <div className="roast-back-header">
            <div>
              <span className="roast-back-label">LeetCheck AI</span>
              <h3 className="roast-back-title">Your Roast</h3>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {isStreaming && (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="detail-chip"
                  style={{ cursor: 'pointer', borderColor: 'rgba(34, 211, 238, 0.3)', color: 'var(--cyan)' }}
                  title="Show all immediately"
                >
                  <FastForward size={12} />
                  <span>Skip</span>
                </button>
              )}
              <span className="roast-ai-badge">Groq GPT-OSS 120B</span>
            </div>
          </div>

          {/* Continuous progressive streaming area */}
          <div className="roast-stream-content" ref={streamContainerRef}>
            {isFetchingRoast && !streamedText ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--cyan)', padding: '2rem 0' }}>
                <Zap size={20} className="pulse-icon" />
                <span>Brewing your personalized roast...</span>
              </div>
            ) : (
              <>
                {renderedContent}
                {isStreaming && (
                  <span
                    className="streaming-cursor"
                    aria-hidden="true"
                  />
                )}
              </>
            )}
          </div>

          {/* Final Verdict Callout Box */}
          {isCompleted && finalVerdict && (
            <div className="final-verdict-box">
              <div className="verdict-header-row">
                <ShieldAlert size={16} />
                <span>Final Verdict</span>
              </div>
              <p className="verdict-text">{finalVerdict}</p>
            </div>
          )}

          {/* Action to roast another profile */}
          {isCompleted && (
            <div className="roast-footer-actions">
              <button
                type="button"
                className="roast-another-btn"
                onClick={onReset}
              >
                <RefreshCw size={15} />
                <span>Roast Another Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
