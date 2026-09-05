import React, { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const containerRef = useRef(null);
  const targetPos = useRef({ x: -1000, y: -1000 });
  const currentPos = useRef({ x: -1000, y: -1000 });
  const targetOpacity = useRef(0);
  const currentOpacity = useRef(0);
  const rafId = useRef(null);
  const isRunning = useRef(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return; // Respect reduced motion
    }

    const container = containerRef.current;
    if (!container) return;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      // Smooth interpolation for inertia
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.12);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.12);
      currentOpacity.current = lerp(currentOpacity.current, targetOpacity.current, 0.1);

      // Apply CSS custom properties to container
      container.style.setProperty('--mouse-x', `${currentPos.current.x.toFixed(2)}px`);
      container.style.setProperty('--mouse-y', `${currentPos.current.y.toFixed(2)}px`);
      container.style.setProperty('--mouse-opacity', currentOpacity.current.toFixed(3));

      // Continue animation loop if still moving or fading
      const dx = Math.abs(targetPos.current.x - currentPos.current.x);
      const dy = Math.abs(targetPos.current.y - currentPos.current.y);
      const dop = Math.abs(targetOpacity.current - currentOpacity.current);

      if (dx > 0.1 || dy > 0.1 || dop > 0.005) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        isRunning.current = false;
      }
    };

    const startAnimation = () => {
      if (!isRunning.current) {
        isRunning.current = true;
        rafId.current = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;
      targetOpacity.current = 1;

      // First move initialization
      if (currentPos.current.x < -500) {
        currentPos.current.x = e.clientX;
        currentPos.current.y = e.clientY;
      }

      startAnimation();
    };

    const handleMouseLeave = () => {
      targetOpacity.current = 0;
      startAnimation();
    };

    const handleMouseEnter = (e) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;
      targetOpacity.current = 1;
      startAnimation();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="interactive-grid-canvas" ref={containerRef} aria-hidden="true">
      {/* 1. Base subtle neutral dot matrix (#09090B background) */}
      <div className="grid-layer-base" />

      {/* 2. Soft diffused atmospheric glow following the cursor */}
      <div className="grid-layer-glow" />

      {/* 3. Illuminated dot matrix (highlighted in soft blue & violet under cursor) */}
      <div className="grid-layer-highlight" />
    </div>
  );
}
