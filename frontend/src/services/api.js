/**
 * API service for LeetCheck backend
 * Endpoint: /analyze/{username} and /roast/{username}
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

export async function analyzeUser(username) {
  const cleanUsername = username.trim();
  if (!cleanUsername) {
    throw new Error('Please enter a LeetCode username.');
  }

  // 1. Fetch profile from /analyze/{username}
  const analyzeUrl = `${API_BASE}/analyze/${encodeURIComponent(cleanUsername)}`;
  let analyzeRes;
  try {
    analyzeRes = await fetch(analyzeUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });
  } catch (err) {
    throw new Error('Unable to reach the LeetCheck backend server.');
  }

  if (!analyzeRes.ok) {
    let errorDetail = 'Failed to analyze user profile.';
    try {
      const errData = await analyzeRes.json();
      if (errData.detail) {
        errorDetail = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
      }
    } catch {
      if (analyzeRes.status === 404) {
        errorDetail = `LeetCode user '${cleanUsername}' was not found.`;
      } else if (analyzeRes.status === 502) {
        errorDetail = `Failed to fetch data from LeetCode. Please check the username or try again.`;
      }
    }
    throw new Error(errorDetail);
  }

  const analyzeData = await analyzeRes.json();
  const userData = analyzeData.user || analyzeData;

  // Check if roast was returned directly in analyzeData or userData
  let roastText = analyzeData.roast || userData.roast || null;

  // If roast was not in /analyze, fetch from /roast/{username}
  if (!roastText) {
    try {
      const roastUrl = `${API_BASE}/roast/${encodeURIComponent(cleanUsername)}`;
      const roastRes = await fetch(roastUrl, {
        headers: { 'Accept': 'application/json' },
      });
      if (roastRes.ok) {
        const roastData = await roastRes.json();
        roastText = roastData.roast || null;
      }
    } catch (e) {
      console.warn('Could not pre-fetch roast from /roast endpoint:', e);
    }
  }

  return {
    ...userData,
    roast: roastText,
  };
}

export async function fetchRoast(username) {
  const cleanUsername = username.trim();
  const roastUrl = `${API_BASE}/roast/${encodeURIComponent(cleanUsername)}`;
  const res = await fetch(roastUrl, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) {
    throw new Error('Failed to generate roast.');
  }
  const data = await res.json();
  return data.roast;
}
