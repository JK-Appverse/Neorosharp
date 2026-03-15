
export interface UserStats {
  name: string;
  brainScore: number;
  streak: number;
  lastPlayed: string | null;
  highScores: {
    stroop: number;
    math: number;
    pattern: number;
    schulte: number;
    digitSpan: number;
    reverseWord: number;
    oddOneOut: number;
    reactionTime: number; // stores lowest time in ms
    directionalSwipe: number;
  };
  history: {
    date: string;
    score: number;
  }[];
}

const STORAGE_KEY = 'neurosharp_user_stats';

const DEFAULT_STATS: UserStats = {
  name: 'Sharp Mind',
  brainScore: 0,
  streak: 0,
  lastPlayed: null,
  highScores: {
    stroop: 0,
    math: 0,
    pattern: 0,
    schulte: 0,
    digitSpan: 0,
    reverseWord: 0,
    oddOneOut: 0,
    reactionTime: 0,
    directionalSwipe: 0,
  },
  history: [],
};

export function getStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_STATS;
  try {
    const parsed = JSON.parse(saved);
    // Merge with defaults to handle new keys added in updates
    return { 
      ...DEFAULT_STATS, 
      ...parsed, 
      highScores: { ...DEFAULT_STATS.highScores, ...parsed.highScores } 
    };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: UserStats) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function updateUserName(name: string) {
  const stats = getStats();
  stats.name = name;
  saveStats(stats);
}

export function updateHighScores(game: keyof UserStats['highScores'], score: number) {
  const stats = getStats();
  const currentHigh = stats.highScores[game];
  
  let isNewHigh = false;
  if (game === 'schulte' || game === 'reactionTime') {
    // For time-based games, lower is better (if not 0)
    if (score > 0 && (currentHigh === 0 || score < currentHigh)) {
      stats.highScores[game] = score;
      isNewHigh = true;
    }
  } else {
    if (score > currentHigh) {
      stats.highScores[game] = score;
      isNewHigh = true;
    }
  }

  if (isNewHigh) {
    stats.brainScore += 50; // Bonus for new high score
  }

  // Update history
  const today = new Date().toISOString().split('T')[0];
  const lastHistory = stats.history[stats.history.length - 1];
  
  if (lastHistory && lastHistory.date === today) {
    lastHistory.score += score;
  } else {
    stats.history.push({ date: today, score });
  }

  // Update streak
  if (stats.lastPlayed !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (stats.lastPlayed === yesterdayStr) {
      stats.streak += 1;
    } else if (stats.lastPlayed !== today) {
      stats.streak = 1;
    }
    stats.lastPlayed = today;
  }

  // Add some points for playing regardless of high score
  stats.brainScore += Math.floor(score / 10) > 0 ? Math.floor(score / 10) : 5;
  saveStats(stats);
}
