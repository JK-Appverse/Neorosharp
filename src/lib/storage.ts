
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
    speedMatch: number;
    emojiHunt: number;
    wordScramble: number;
    logicTraps: number;
    colorChaos: number;
    missingLink: number;
    rotationStation: number;
    soundMemory: number;
    chalkboardMath: number;
    focusGrid: number;
    reverseCount: number;
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
    speedMatch: 0,
    emojiHunt: 0,
    wordScramble: 0,
    logicTraps: 0,
    colorChaos: 0,
    missingLink: 0,
    rotationStation: 0,
    soundMemory: 0,
    chalkboardMath: 0,
    focusGrid: 0,
    reverseCount: 0,
  },
  history: [],
};

export function getStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_STATS;
  try {
    const parsed = JSON.parse(saved);
    const mergedScores = { ...DEFAULT_STATS.highScores, ...parsed.highScores };
    return { 
      ...DEFAULT_STATS, 
      ...parsed, 
      highScores: mergedScores,
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
  
  const reduction = Math.min(17, (totalScore / 1500) + (gameCount * 0.5));
  return Math.max(18, Math.round(baseAge - reduction));
}

export function updateHighScores(game: keyof UserStats['highScores'], score: number, isDailyChallenge: boolean = false) {
  const stats = getStats();
  const currentHigh = stats.highScores[game];
  
  let isNewHigh = false;
  const finalScore = isDailyChallenge ? score * 2 : score;

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

  const today = new Date().toISOString().split('T')[0];
  const lastHistory = stats.history[stats.history.length - 1];
  
  if (lastHistory && lastHistory.date === today) {
    lastHistory.score += finalScore;
  } else {
    stats.history.push({ date: today, score: finalScore });
  }

  if (stats.lastPlayed !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (stats.lastPlayed === yesterdayStr) {
      stats.streak += 1;
    } else {
      stats.streak = 1;
    }
    stats.lastPlayed = today;
  }

  stats.brainScore += finalScore;
  saveStats(stats);
}
