
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStats, UserStats, updateUserName, calculateBrainAge, updateDailyGoal } from '@/lib/storage';
import { 
  Brain, Zap, Eye, Grid, TrendingUp, Award, ChevronRight, Target, Hash, 
  RefreshCw, Search, Timer, ArrowRightLeft, User, ArrowLeft, CheckCircle2, 
  Save, Triangle, MousePointer2, Settings, BarChart3, Clock, Type, Swords, Sparkles,
  Sun, Moon, AlertTriangle, Image as ImageIcon
} from "lucide-react";

import StroopTest from '@/components/games/StroopTest';
import MathRush from '@/components/games/MathRush';
import PatternRecall from '@/components/games/PatternRecall';
import SchulteTable from '@/components/games/SchulteTable';
import DigitSpan from '@/components/games/DigitSpan';
import ReverseWord from '@/components/games/ReverseWord';
import OddOneOut from '@/components/games/OddOneOut';
import ReactionTime from '@/components/games/ReactionTime';
import DirectionalSwipe from '@/components/games/DirectionalSwipe';
import NumberPyramid from '@/components/games/NumberPyramid';
import VowelHunter from '@/components/games/VowelHunter';
import SpeedMatch from '@/components/games/SpeedMatch';
import EmojiHunt from '@/components/games/EmojiHunt';
import WordScramble from '@/components/games/WordScramble';
import LogicTraps from '@/components/games/LogicTraps';
import VersusMode from '@/components/games/VersusMode';
import ImagePuzzle from '@/components/games/ImagePuzzle';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ActiveView = 'none' | 'stroop' | 'math' | 'pattern' | 'schulte' | 'digitSpan' | 'reverseWord' | 'oddOneOut' | 'reactionTime' | 'directionalSwipe' | 'numberPyramid' | 'vowelHunter' | 'speedMatch' | 'emojiHunt' | 'wordScramble' | 'logicTraps' | 'imagePuzzle' | 'profile' | 'versus';

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('none');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setStats(getStats());
    
    // Initialize theme from storage or system preference
    const savedTheme = localStorage.getItem('neurosharp_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, [activeView]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('neurosharp_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const dailyChallengeGames = useMemo(() => {
    // Deterministic daily challenge based on date
    const today = new Date().toISOString().split('T')[0];
    const hash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const games: ActiveView[] = ['stroop', 'math', 'pattern', 'schulte', 'digitSpan', 'reverseWord', 'oddOneOut', 'reactionTime', 'directionalSwipe', 'numberPyramid', 'vowelHunter', 'speedMatch', 'emojiHunt', 'wordScramble', 'logicTraps', 'imagePuzzle'];
    return [
      games[hash % games.length],
      games[(hash + 3) % games.length],
      games[(hash + 7) % games.length]
    ];
  }, []);

  if (!stats) return null;

  const brainAge = calculateBrainAge(stats);
  const todayDate = new Date().toISOString().split('T')[0];
  const todayPlayTimeSeconds = stats.playTimeSeconds?.[todayDate] || 0;
  const goalMinutes = stats.dailyGoalMinutes || 15;
  const progressPercent = Math.min(100, (todayPlayTimeSeconds / (goalMinutes * 60)) * 100);

  const getRankDetails = (score: number) => {
    if (score < 1000) return { name: 'Bronze', color: 'bg-orange-700/40', border: 'border-orange-500/40', text: 'text-orange-200' };
    if (score < 5000) return { name: 'Silver', color: 'bg-slate-500/40', border: 'border-slate-300/40', text: 'text-slate-100' };
    if (score < 15000) return { name: 'Gold', color: 'bg-yellow-600/40', border: 'border-yellow-400/40', text: 'text-yellow-100' };
    if (score < 40000) return { name: 'Platinum', color: 'bg-cyan-600/40', border: 'border-cyan-300/40', text: 'text-cyan-100' };
    return { name: 'Diamond', color: 'bg-indigo-600/40', border: 'border-indigo-400/40', text: 'text-indigo-100' };
  };

  const rank = getRankDetails(stats.brainScore);

  if (activeView === 'profile') {
    return <ProfileView stats={stats} onBack={() => setActiveView('none')} brainAge={brainAge} />;
  }

  if (activeView === 'versus') {
    return <VersusMode onBack={() => setActiveView('none')} />;
  }

  if (activeView !== 'none') {
    const isDaily = dailyChallengeGames.includes(activeView);
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl">
          {activeView === 'stroop' && <StroopTest onBack={() => setActiveView('none')} />}
          {activeView === 'math' && <MathRush onBack={() => setActiveView('none')} />}
          {activeView === 'pattern' && <PatternRecall onBack={() => setActiveView('none')} />}
          {activeView === 'schulte' && <SchulteTable onBack={() => setActiveView('none')} />}
          {activeView === 'digitSpan' && <DigitSpan onBack={() => setActiveView('none')} />}
          {activeView === 'reverseWord' && <ReverseWord onBack={() => setActiveView('none')} />}
          {activeView === 'oddOneOut' && <OddOneOut onBack={() => setActiveView('none')} />}
          {activeView === 'reactionTime' && <ReactionTime onBack={() => setActiveView('none')} />}
          {activeView === 'directionalSwipe' && <DirectionalSwipe onBack={() => setActiveView('none')} />}
          {activeView === 'numberPyramid' && <NumberPyramid onBack={() => setActiveView('none')} />}
          {activeView === 'vowelHunter' && <VowelHunter onBack={() => setActiveView('none')} />}
          {activeView === 'speedMatch' && <SpeedMatch onBack={() => setActiveView('none')} isDaily={isDaily} />}
          {activeView === 'emojiHunt' && <EmojiHunt onBack={() => setActiveView('none')} isDaily={isDaily} />}
          {activeView === 'wordScramble' && <WordScramble onBack={() => setActiveView('none')} isDaily={isDaily} />}
          {activeView === 'logicTraps' && <LogicTraps onBack={() => setActiveView('none')} />}
          {activeView === 'imagePuzzle' && <ImagePuzzle onBack={() => setActiveView('none')} />}
        </div>
      </div>
    );
  }

  const chartData = stats.history.slice(-7);

  return (
    <div className="min-h-screen pb-12 bg-background">
      <header className="bg-primary pt-12 pb-24 px-4 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-xl dark:bg-slate-800">
                <Brain className="text-primary w-8 h-8" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tighter">NeuroSharp</h1>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary transition-all"
                onClick={toggleTheme}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary transition-all"
                onClick={() => setActiveView('versus')}
              >
                <Swords className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary transition-all"
                onClick={() => setActiveView('profile')}
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <p className="text-primary-foreground/80 mb-2 font-medium">Sharp Mind, {stats.name}</p>
            <h2 className="text-7xl font-black mb-6 tracking-tighter">{stats.brainScore.toLocaleString()}</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <div className={`backdrop-blur-md px-6 py-2 rounded-xl border transition-colors duration-500 ${rank.color} ${rank.border}`}>
                <span className="block text-[10px] uppercase font-bold text-primary-foreground/70 mb-0.5">Rank</span>
                <span className={`font-black text-xl ${rank.text}`}>{rank.name}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-xl border border-white/20">
                <span className="block text-[10px] uppercase font-bold text-primary-foreground/70 mb-0.5">Brain Age</span>
                <span className="font-black text-xl text-white">{brainAge}y</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 -mt-12 space-y-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-card overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-foreground flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Daily Goal</h3>
              <span className="text-xs font-black text-primary">{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-4 w-full bg-muted rounded-full overflow-hidden mb-2">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="text-xs text-muted-foreground font-bold">{Math.floor(todayPlayTimeSeconds / 60)} / {goalMinutes} mins today</p>
          </Card>
          
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-card overflow-hidden p-6 col-span-1 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-foreground flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-500" /> Daily Challenges</h3>
              <span className="text-xs font-black text-amber-600">2X Points</span>
            </div>
            <div className="flex gap-4">
              {dailyChallengeGames.map((game, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  onClick={() => setActiveView(game)}
                  className="flex-1 rounded-2xl border-amber-100 dark:border-amber-900/50 hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 h-16 flex flex-col items-center justify-center"
                >
                  <span className="text-[10px] font-black uppercase text-amber-600">{game}</span>
                  <span className="text-xs font-bold text-slate-400">Bonus</span>
                </Button>
              ))}
            </div>
          </Card>
        </div>

        <section>
          <div className="flex flex-col items-center justify-center mb-10 px-2">
            <h3 className="text-2xl font-black flex items-center gap-2 text-foreground">
              <Target className="w-7 h-7 text-primary" /> Training Modules
            </h3>
            <span className="text-xs text-muted-foreground font-black uppercase tracking-widest mt-1">Advanced Exercises Available</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <GameCard 
              title="Image Puzzle" 
              desc="Visual Reassembly" 
              icon={<ImageIcon className="w-6 h-6" />}
              highScore={stats.highScores.imagePuzzle}
              unit="s"
              color="bg-cyan-600"
              onClick={() => setActiveView('imagePuzzle')}
            />
            <GameCard 
              title="Logic Traps" 
              desc="Focus & Deduction" 
              icon={<AlertTriangle className="w-6 h-6" />}
              highScore={stats.highScores.logicTraps}
              color="bg-indigo-600"
              onClick={() => setActiveView('logicTraps')}
            />
            <GameCard 
              title="Speed Match" 
              desc="Working Memory" 
              icon={<Sparkles className="w-6 h-6" />}
              highScore={stats.highScores.speedMatch}
              color="bg-blue-600"
              onClick={() => setActiveView('speedMatch')}
            />
            <GameCard 
              title="Emoji Hunt" 
              desc="Visual Search" 
              icon={<Search className="w-6 h-6" />}
              highScore={stats.highScores.emojiHunt}
              color="bg-amber-600"
              onClick={() => setActiveView('emojiHunt')}
            />
            <GameCard 
              title="Word Scramble" 
              desc="Language Processing" 
              icon={<Type className="w-6 h-6" />}
              highScore={stats.highScores.wordScramble}
              color="bg-pink-600"
              onClick={() => setActiveView('wordScramble')}
            />
            <GameCard 
              title="Number Pyramid" 
              desc="Mental Addition" 
              icon={<Triangle className="w-6 h-6" />}
              highScore={stats.highScores.numberPyramid}
              color="bg-indigo-600"
              onClick={() => setActiveView('numberPyramid')}
            />
            <GameCard 
              title="Vowel Hunter" 
              desc="Speed Selection" 
              icon={<MousePointer2 className="w-6 h-6" />}
              highScore={stats.highScores.vowelHunter}
              color="bg-amber-600"
              onClick={() => setActiveView('vowelHunter')}
            />
            <GameCard 
              title="Digit Span" 
              desc="Sequence Memory" 
              icon={<Hash className="w-6 h-6" />}
              highScore={stats.highScores.digitSpan}
              color="bg-purple-500"
              onClick={() => setActiveView('digitSpan')}
            />
            <GameCard 
              title="Reaction Time" 
              desc="Neural Reflexes" 
              icon={<Timer className="w-6 h-6" />}
              highScore={stats.highScores.reactionTime}
              unit="ms"
              color="bg-orange-500"
              onClick={() => setActiveView('reactionTime')}
            />
            <GameCard 
              title="Reverse Word" 
              desc="Language Logic" 
              icon={<RefreshCw className="w-6 h-6" />}
              highScore={stats.highScores.reverseWord}
              color="bg-pink-500"
              onClick={() => setActiveView('reverseWord')}
            />
            <GameCard 
              title="Inhibition" 
              desc="Directional Swipe" 
              icon={<ArrowRightLeft className="w-6 h-6" />}
              highScore={stats.highScores.directionalSwipe}
              color="bg-teal-500"
              onClick={() => setActiveView('directionalSwipe')}
            />
            <GameCard 
              title="Odd One Out" 
              desc="Visual Perception" 
              icon={<Search className="w-6 h-6" />}
              highScore={stats.highScores.oddOneOut}
              color="bg-emerald-500"
              onClick={() => setActiveView('oddOneOut')}
            />
            <GameCard 
              title="Stroop Test" 
              desc="Focus & Attention" 
              icon={<Target className="w-6 h-6" />}
              highScore={stats.highScores.stroop}
              color="bg-red-500"
              onClick={() => setActiveView('stroop')}
            />
            <GameCard 
              title="Math Rush" 
              desc="Speed & Logic" 
              icon={<Zap className="w-6 h-6" />}
              highScore={stats.highScores.math}
              color="bg-yellow-500"
              onClick={() => setActiveView('math')}
            />
          </div>
        </section>

        <Card className="border-none shadow-2xl bg-card overflow-hidden rounded-[2.5rem]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl font-black">
              <TrendingUp className="w-5 h-5 text-primary" /> Progress Analytics
            </CardTitle>
            <CardDescription className="font-bold">Daily cognitive activity and performance trends</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] mt-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.1} 
                    strokeWidth={4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/20 rounded-2xl border border-dashed">
                <p className="font-bold">Complete your first training to unlock analytics</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <footer className="py-12 border-t bg-card/50 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <Brain className="w-6 h-6 text-primary/40" />
            <Zap className="w-6 h-6 text-primary/40" />
            <Target className="w-6 h-6 text-primary/40" />
          </div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">NeuroSharp • Mind Unleashed</p>
        </div>
      </footer>
    </div>
  );
}

function GameCard({ title, desc, icon, highScore, unit = "", color, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="group relative flex flex-col p-6 rounded-[2.5rem] bg-card shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-primary/30 text-left active:scale-[0.98]"
    >
      <div className={`p-4 rounded-2xl ${color} text-white mb-6 w-fit group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
        {icon}
      </div>
      <h4 className="font-bold text-xl mb-1 text-foreground group-hover:text-primary transition-colors">{title}</h4>
      <p className="text-sm text-muted-foreground mb-6 font-medium leading-tight group-hover:text-foreground/80">{desc}</p>
      <div className="mt-auto flex items-center justify-between bg-muted/30 p-4 rounded-2xl group-hover:bg-primary/10 transition-colors">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em]">Record</span>
          <span className="font-black text-lg text-primary">{highScore || '—'}{highScore ? unit : ''}</span>
        </div>
        <div className="bg-card p-2 rounded-full shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </button>
  );
}

function ProfileView({ stats, onBack, brainAge }: { stats: UserStats, onBack: () => void, brainAge: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(stats.name);
  const [goal, setGoal] = useState(stats.dailyGoalMinutes);

  const handleSave = () => {
    updateUserName(name);
    updateDailyGoal(goal);
    setIsEditing(false);
  };

  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary pt-12 pb-32 px-4 text-white">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" className="text-white hover:bg-white/10 mb-8" onClick={onBack}>
            <ArrowLeft className="mr-2 w-5 h-5" /> Dashboard
          </Button>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="bg-white/10 p-1 rounded-full border-4 border-white/20">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-full">
                <User className="w-20 h-20 text-primary" />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              {isEditing ? (
                <div className="flex flex-col gap-4">
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/10 border-white/30 text-white text-3xl font-black h-16 w-full max-w-sm rounded-2xl"
                    placeholder="Enter Name"
                  />
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-white/70">Daily Goal (mins):</span>
                    <Input 
                      type="number"
                      value={goal} 
                      onChange={(e) => setGoal(parseInt(e.target.value))}
                      className="bg-white/10 border-white/30 text-white w-24 rounded-2xl h-12 text-center"
                    />
                  </div>
                  <Button onClick={handleSave} className="bg-accent text-white hover:bg-accent/90 rounded-2xl h-14 font-black">
                    <Save className="mr-2 w-5 h-5" /> Save Changes
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <h2 className="text-5xl font-black">{stats.name}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-white/60 hover:text-white hover:bg-white/10">
                    <Settings className="w-5 h-5" />
                  </Button>
                </div>
              )}
              <p className="text-primary-foreground/70 text-lg mt-2 font-black uppercase tracking-widest">Brain Age: {brainAge} Years</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 max-w-4xl space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Overall Score" value={stats.brainScore.toLocaleString()} />
          <StatBox label="Daily Streak" value={`${stats.streak} Days`} />
          <StatBox label="Daily Goal" value={`${goal} min`} />
          <StatBox label="Mind Level" value={brainAge < 25 ? 'Genius' : brainAge < 35 ? 'Sharp' : 'Learning'} />
        </div>

        <Button onClick={handleDownloadReport} className="w-full bg-card text-primary hover:bg-muted h-16 rounded-[2rem] font-black text-xl shadow-xl border-2 border-primary/10">
          Generate Progress Report (PDF)
        </Button>

        <Card className="border-none shadow-2xl bg-card rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-muted/30 border-b p-8 text-center">
            <CardTitle className="text-2xl font-black flex items-center justify-center gap-2">
              <Award className="w-8 h-8 text-primary" /> Achievement Gallery
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AchievementItem title="Early Adopter" desc="Completed first training" unlocked={stats.brainScore > 0} />
            <AchievementItem title="Consistent" desc="3-day streak" unlocked={stats.streak >= 3} />
            <AchievementItem title="Focused" desc="Math Rush > 100" unlocked={stats.highScores.math >= 100} />
            <AchievementItem title="Eagle Eye" desc="Odd One Out > 200" unlocked={stats.highScores.oddOneOut >= 200} />
            <AchievementItem title="Pyramid King" desc="Number Pyramid > 300" unlocked={stats.highScores.numberPyramid >= 300} />
            <AchievementItem title="Logic Master" desc="Escaped all Logic Traps" unlocked={stats.highScores.logicTraps > 500} />
            <AchievementItem title="Puzzle Pro" desc="Solved Image Puzzle < 60s" unlocked={stats.highScores.imagePuzzle > 0 && stats.highScores.imagePuzzle < 60} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-card p-6 rounded-[2rem] shadow-xl border border-border/50 flex flex-col items-center justify-center text-center">
      <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">{label}</span>
      <span className="text-2xl font-black text-primary">{value}</span>
    </div>
  );
}

function AchievementItem({ title, desc, unlocked }: any) {
  return (
    <div className={`flex items-center gap-4 p-5 rounded-3xl transition-all border ${unlocked ? 'bg-card border-primary/10 shadow-md' : 'opacity-40 grayscale bg-muted/20 border-transparent'}`}>
      <div className={`p-4 rounded-2xl ${unlocked ? 'bg-primary/5 text-primary' : 'bg-muted text-muted-foreground'}`}>
        <Award className="w-8 h-8" />
      </div>
      <div className="flex-1">
        <p className="text-base font-black leading-none text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-2 font-bold uppercase tracking-tight">{desc}</p>
      </div>
      {unlocked && <CheckCircle2 className="w-6 h-6 text-accent" />}
    </div>
  );
}
