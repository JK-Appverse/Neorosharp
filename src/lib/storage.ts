
export interface UserStats {
  name: string;
  brainScore: number;
  streak: number;
  lastPlayed: string | null;
  dailyGoalMinutes: number;
  playTimeSeconds: Record<string, number>; // date string -> seconds
  highScores: {
    stroop: number;
    math: number;
    pattern: number;
    schulte: number;
    digitSpan: number;
    reverseWord: number;
    oddOneOut: number;
    reactionTime: number; 
    directionalSwipe: number;
    numberPyramid: number;
    vowelHunter: number;
    gridRotation: number;
    colorSequence: number;
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
  dailyGoalMinutes: 15,
  playTimeSeconds: {},
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
    numberPyramid: 0,
    vowelHunter: 0,
    gridRotation: 0,
    colorSequence: 0,
  },
  history: [],
};

export function getStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_STATS;
  try {
    const parsed = JSON.parse(saved);
    return { 
      ...DEFAULT_STATS, 
      ...parsed, 
      highScores: { ...DEFAULT_STATS.highScores, ...parsed.highScores },
      playTimeSeconds: parsed.playTimeSeconds || {}
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

export function updateDailyGoal(minutes: number) {
  const stats = getStats();
  stats.dailyGoalMinutes = minutes;
  saveStats(stats);
}

export function addPlayTime(seconds: number) {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];
  stats.playTimeSeconds[today] = (stats.playTimeSeconds[today] || 0) + seconds;
  saveStats(stats);
}

export function calculateBrainAge(stats: UserStats): number {
  const baseAge = 35;
  const totalScore = stats.brainScore;
  const gameCount = Object.values(stats.highScores).filter(s => s > 0).length;
  
  if (gameCount === 0) return baseAge;
  
  // Reduction based on mastery (1 year younger for every 2000 points)
  const reduction = Math.min(15, totalScore / 2000);
  return Math.max(18, Math.round(baseAge - reduction));
}

export function updateHighScores(game: keyof UserStats['highScores'], score: number) {
  const stats = getStats();
  const currentHigh = stats.highScores[game];
  
  let isNewHigh = false;
  if (game === 'schulte' || game === 'reactionTime') {
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
    stats.brainScore += 50; 
  }

  const today = new Date().toISOString().split('T')[0];
  const lastHistory = stats.history[stats.history.length - 1];
  
  if (lastHistory && lastHistory.date === today) {
    lastHistory.score += score;
  } else {
    stats.history.push({ date: today, score });
  }

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

  stats.brainScore += Math.floor(score / 10) > 0 ? Math.floor(score / 10) : 5;
  saveStats(stats);
}
