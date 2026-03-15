
export interface UserStats {
  brainScore: number;
  streak: number;
  lastPlayed: string | null;
  highScores: {
    stroop: number;
    math: number;
    pattern: number;
    schulte: number;
  };
  history: {
    date: string;
    score: number;
  }[];
}

const STORAGE_KEY = 'neurosharp_user_stats';

const DEFAULT_STATS: UserStats = {
  brainScore: 0,
  streak: 0,
  lastPlayed: null,
  highScores: {
    stroop: 0,
    math: 0,
    pattern: 0,
    schulte: 0,
  },
  history: [],
};

export function getStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_STATS;
  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: UserStats) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function updateHighScores(game: keyof UserStats['highScores'], score: number) {
  const stats = getStats();
  const currentHigh = stats.highScores[game];
  
  if (score > currentHigh || (game === 'schulte' && (currentHigh === 0 || score < currentHigh))) {
    stats.highScores[game] = score;
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

  stats.brainScore += Math.floor(score / 10);
  saveStats(stats);
}
