import React, { useMemo } from 'react';
import { Activity, Flame, Calendar, Award } from 'lucide-react';

export default function SubmissionHeatmap({ solvedList, submissionCalendar }) {
  const allStat = solvedList?.find((item) => item.difficulty === 'All') || { count: 0, submissions: 0 };
  const totalSubmissionsStat = allStat.submissions || 0;
  const totalSolvedStat = allStat.count || 0;

  const {
    weeksData,
    monthHeaders,
    totalActiveDays,
    maxStreak,
    currentStreak,
    totalCalendarSubmissions,
  } = useMemo(() => {
    // 1. Parse LeetCode submissionCalendar: { "1768435200": 1, ... }
    let calendarMap = {};
    if (submissionCalendar) {
      try {
        calendarMap = typeof submissionCalendar === 'string'
          ? JSON.parse(submissionCalendar)
          : submissionCalendar;
      } catch (e) {
        console.error('Failed to parse submissionCalendar', e);
      }
    }

    // Convert timestamps to normalized Date strings (YYYY-MM-DD) for exact lookup
    const dateCounts = {};
    for (const [timestampStr, count] of Object.entries(calendarMap)) {
      const ts = parseInt(timestampStr, 10);
      if (!isNaN(ts)) {
        const d = new Date(ts * 1000);
        const dateKey = d.toISOString().split('T')[0];
        dateCounts[dateKey] = (dateCounts[dateKey] || 0) + Number(count);
      }
    }

    // 2. Generate the last 52 weeks grid (Sunday to Saturday)
    const today = new Date();
    // End on current week's Saturday to complete the grid cleanly
    const endDate = new Date(today);
    const dayOfWeek = endDate.getDay();
    endDate.setDate(endDate.getDate() + (6 - dayOfWeek));

    // Start 52 weeks prior
    const totalDays = 52 * 7;
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (totalDays - 1));

    const weeks = [];
    let currentWeek = [];
    const months = [];
    let lastMonth = -1;

    let activeDaysCount = 0;
    let totalSubCount = 0;
    let currentStreakCount = 0;
    let maxStreakCount = 0;
    let tempStreak = 0;

    const todayStr = today.toISOString().split('T')[0];
    let isPastOrToday = true;

    for (let i = 0; i < totalDays; i++) {
      const cur = new Date(startDate);
      cur.setDate(cur.getDate() + i);
      const dateStr = cur.toISOString().split('T')[0];
      const isFuture = cur > today;

      const count = isFuture ? 0 : (dateCounts[dateStr] || 0);

      // Streak calculation
      if (!isFuture) {
        if (count > 0) {
          activeDaysCount++;
          totalSubCount += count;
          tempStreak++;
          if (tempStreak > maxStreakCount) {
            maxStreakCount = tempStreak;
          }
        } else {
          tempStreak = 0;
        }

        // Check if yesterday or today for current streak
        if (dateStr === todayStr) {
          currentStreakCount = tempStreak;
        }
      }

      // Intensity level in LeetCheck blue/cyan scale
      let level = 0;
      if (count >= 10) level = 4;
      else if (count >= 6) level = 3;
      else if (count >= 3) level = 2;
      else if (count >= 1) level = 1;

      currentWeek.push({
        dateStr,
        count,
        level,
        isFuture,
        formattedDate: cur.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      });

      // Month header placement
      if (cur.getDay() === 0) {
        const m = cur.getMonth();
        if (m !== lastMonth && i < totalDays - 14) {
          months.push({
            weekIndex: weeks.length,
            label: cur.toLocaleDateString('en-US', { month: 'short' }),
          });
          lastMonth = m;
        }
      }

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    return {
      weeksData: weeks,
      monthHeaders: months,
      totalActiveDays: activeDaysCount,
      maxStreak: maxStreakCount,
      currentStreak: currentStreakCount,
      totalCalendarSubmissions: totalSubCount || totalSubmissionsStat,
    };
  }, [submissionCalendar, totalSubmissionsStat]);

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <div className="section-label" style={{ color: 'var(--cyan)' }}>
          <Activity size={16} />
          <span>Real Submission Activity</span>
        </div>

        <div className="heatmap-metrics-summary">
          <div className="heatmap-summary-item">
            <Calendar size={14} />
            <span>Submissions:</span>
            <span className="heatmap-summary-val">{totalCalendarSubmissions.toLocaleString()}</span>
          </div>
          <div className="heatmap-summary-item">
            <Flame size={14} style={{ color: 'var(--cyan)' }} />
            <span>Active Days:</span>
            <span className="heatmap-summary-val">{totalActiveDays}</span>
          </div>
          {maxStreak > 0 && (
            <div className="heatmap-summary-item">
              <Award size={14} style={{ color: 'var(--bright-blue)' }} />
              <span>Max Streak:</span>
              <span className="heatmap-summary-val">{maxStreak} days</span>
            </div>
          )}
        </div>
      </div>

      <div className="heatmap-scroll-area">
        {/* Month labels header */}
        <div className="heatmap-months-row">
          {monthHeaders.map((m, idx) => (
            <span
              key={idx}
              className="heatmap-month-label"
              style={{ left: `${m.weekIndex * 15}px` }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* 52-week activity grid */}
        <div className="heatmap-grid">
          {weeksData.map((week, wIdx) => (
            <div key={wIdx} className="heatmap-col">
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  className={`heatmap-cell level-${day.level} ${day.isFuture ? 'cell-future' : ''}`}
                  title={
                    day.isFuture
                      ? ''
                      : day.count > 0
                      ? `${day.count} submission${day.count > 1 ? 's' : ''} on ${day.formattedDate}`
                      : `No submissions on ${day.formattedDate}`
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="heatmap-legend">
        <span>Less</span>
        <div className="legend-cells">
          <div className="heatmap-cell level-0" title="0 submissions" />
          <div className="heatmap-cell level-1" title="1-2 submissions" />
          <div className="heatmap-cell level-2" title="3-5 submissions" />
          <div className="heatmap-cell level-3" title="6-9 submissions" />
          <div className="heatmap-cell level-4" title="10+ submissions" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
