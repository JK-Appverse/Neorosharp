
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
  Sun, Moon, AlertTriangle, Image as ImageIcon, Link as LinkIcon, Info, Home as HomeIcon
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
import ImagePuzzle from '@/components/games/ImagePuzzle';
import WordChain from '@/components/games/WordChain';
import VersusMode from '@/components/games/VersusMode';
import AdBanner from '@/components/AdBanner';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ActiveView = 'none' | 'stroop' | 'math' | 'pattern' | 'schulte' | 'digitSpan' | 'reverseWord' | 'oddOneOut' | 'reactionTime' | 'directionalSwipe' | 'numberPyramid' | 'vowelHunter' | 'speedMatch' | 'emojiHunt' | 'wordScramble' | 'logicTraps' | 'imagePuzzle' | 'wordChain' | 'profile' | 'versus';

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('none');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setStats(getStats());
    
    // Initialize theme: force 'light' for first time users
    const savedTheme = localStorage.getItem('neurosharp_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('neurosharp_theme', 'light');
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
    const today = new Date().toISOString().split('T')[0];
    const hash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const games: ActiveView[] = ['stroop', 'math', 'pattern', 'schulte', 'digitSpan', 'reverseWord', 'oddOneOut', 'reactionTime', 'directionalSwipe', 'numberPyramid', 'vowelHunter', 'speedMatch', 'emojiHunt', 'wordScramble', 'logicTraps', 'imagePuzzle', 'wordChain'];
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

  const renderContent = () => {
    if (activeView === 'profile') {
      return <ProfileView stats={stats} onBack={() => setActiveView('none')} brainAge={brainAge} />;
    }

    if (activeView === 'versus') {
      return <VersusMode onBack={() => setActiveView('none')} />;
    }

    if (activeView !== 'none') {
      const isDaily = dailyChallengeGames.includes(activeView);
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <AdBanner />
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
            {activeView === 'wordChain' && <WordChain onBack={() => setActiveView('none')} />}
            <AdBanner />
          </div>
        </div>
      );
    }

    const chartData = stats.history.slice(-7);

    return (
      <div className="min-h-screen pb-24 bg-background">
        <header className="bg-primary pt-10 pb-16 px-4 text-white relative">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="bg-white p-1.5 rounded-xl dark:bg-slate-800">
                  <Brain className="text-primary w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tighter">NeuroSharp</h1>
              </div>
              <div className="flex gap-1.5">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-9 w-9 bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary transition-all"
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <p className="text-primary-foreground/80 mb-1 text-xs md:text-sm font-medium uppercase tracking-wider">Sharp Mind, {stats.name}</p>
              <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">{stats.brainScore.toLocaleString()}</h2>
              <div className="flex flex-wrap justify-center gap-3">
                <div className={`backdrop-blur-md px-4 py-1.5 rounded-xl border transition-colors duration-500 ${rank.color} ${rank.border}`}>
                  <span className="block text-[8px] uppercase font-bold text-primary-foreground/70">Rank</span>
                  <span className={`font-black text-sm md:text-lg ${rank.text}`}>{rank.name}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/20">
                  <span className="block text-[8px] uppercase font-bold text-primary-foreground/70">Brain Age</span>
                  <span className="font-black text-sm md:text-lg text-white">{brainAge}y</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 mt-6 space-y-6 max-w-6xl">
          {/* Ad 1 */}
          <AdBanner />

          {/* Daily Bonus Section */}
          <Card 
            className="rounded-[2rem] border-none shadow-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white overflow-hidden p-6 cursor-pointer hover:shadow-2xl transition-all active:scale-[0.98] group"
            onClick={() => window.open('https://www.profitablecpmratenetwork.com/e0tukiugmg?key=aa66468bdeeef3c2c0bf8a69a613d8ae', '_blank')}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl group-hover:bg-white/30 transition-colors">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Your Daily Bonus</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Click here to claim your reward</p>
                </div>
              </div>
              <div className="bg-white/10 p-2 rounded-full">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </Card>

          {/* Ad 2 */}
          <AdBanner />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-[2rem] border-none shadow-lg bg-card overflow-hidden p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black text-foreground text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Daily Goal</h3>
                <span className="text-[10px] font-black text-primary">{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold">{Math.floor(todayPlayTimeSeconds / 60)} / {goalMinutes} mins today</p>
            </Card>
            
            <Card className="rounded-[2rem] border-none shadow-lg bg-card overflow-hidden p-5 col-span-1 md:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black text-foreground text-sm flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" /> Daily Challenges</h3>
                <span className="text-[10px] font-black text-amber-600">2X Points</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {dailyChallengeGames.map((game, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    onClick={() => setActiveView(game)}
                    className="flex-shrink-0 w-28 md:flex-1 rounded-xl border-amber-100 dark:border-amber-900/50 hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 h-14 flex flex-col items-center justify-center p-1"
                  >
                    <span className="text-[8px] font-black uppercase text-amber-600 truncate w-full text-center">{game === 'stroop' ? 'Ink Color' : game === 'wordChain' ? 'Word Sequence' : game === 'pattern' ? 'Memory Grid' : game}</span>
                    <span className="text-[8px] font-bold text-slate-400">Challenge {i+1}</span>
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Ad 3 */}
          <AdBanner />

          <section>
            <div className="flex flex-col items-center justify-center mb-6 px-2">
              <h3 className="text-lg md:text-xl font-black flex items-center gap-2 text-foreground">
                <Target className="w-5 h-5 text-primary" /> Training Modules
              </h3>
              <div className="h-1 w-8 bg-primary/20 rounded-full mt-1"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <GameCard 
                title="Word Sequence Chain" 
                desc="Cumulative Memory" 
                icon={<LinkIcon className="w-5 h-5" />}
                highScore={stats.highScores.wordChain}
                color="bg-emerald-600"
                onClick={() => setActiveView('wordChain')}
              />
              <GameCard 
                title="Picture Slide Puzzle" 
                desc="Spatial Reassembly" 
                icon={<ImageIcon className="w-5 h-5" />}
                highScore={stats.highScores.imagePuzzle}
                unit="s"
                color="bg-cyan-600"
                onClick={() => setActiveView('imagePuzzle')}
              />
              <GameCard 
                title="Tricky Riddles" 
                desc="Logic & Focus" 
                icon={<AlertTriangle className="w-5 h-5" />}
                highScore={stats.highScores.logicTraps}
                color="bg-indigo-600"
                onClick={() => setActiveView('logicTraps')}
              />
              <GameCard 
                title="Shape Recall" 
                desc="Working Memory" 
                icon={<Sparkles className="w-5 h-5" />}
                highScore={stats.highScores.speedMatch}
                color="bg-blue-600"
                onClick={() => setActiveView('speedMatch')}
              />
              <GameCard 
                title="Emoji Search" 
                desc="Visual Identification" 
                icon={<Search className="w-5 h-5" />}
                highScore={stats.highScores.emojiHunt}
                color="bg-amber-600"
                onClick={() => setActiveView('emojiHunt')}
              />
              <GameCard 
                title="Unscramble Words" 
                desc="Language Logic" 
                icon={<Type className="w-5 h-5" />}
                highScore={stats.highScores.wordScramble}
                color="bg-pink-600"
                onClick={() => setActiveView('wordScramble')}
              />
              <GameCard 
                title="Math Pyramid" 
                desc="Sequential Sums" 
                icon={<Triangle className="w-5 h-5" />}
                highScore={stats.highScores.numberPyramid}
                color="bg-indigo-600"
                onClick={() => setActiveView('numberPyramid')}
              />
              <GameCard 
                title="Catch the Vowels" 
                desc="Fast Perception" 
                icon={<MousePointer2 className="w-5 h-5" />}
                highScore={stats.highScores.vowelHunter}
                color="bg-amber-600"
                onClick={() => setActiveView('vowelHunter')}
              />
              <GameCard 
                title="Number Sequence" 
                desc="Working Memory" 
                icon={<Hash className="w-5 h-5" />}
                highScore={stats.highScores.digitSpan}
                color="bg-purple-500"
                onClick={() => setActiveView('digitSpan')}
              />
              <GameCard 
                title="Reflex Test" 
                desc="Reaction Time" 
                icon={<Timer className="w-5 h-5" />}
                highScore={stats.highScores.reactionTime}
                unit="ms"
                color="bg-orange-500"
                onClick={() => setActiveView('reactionTime')}
              />
              <GameCard 
                title="Backward Words" 
                desc="Reverse Language" 
                icon={<RefreshCw className="w-5 h-5" />}
                highScore={stats.highScores.reverseWord}
                color="bg-pink-500"
                onClick={() => setActiveView('reverseWord')}
              />
              <GameCard 
                title="Arrow Rule Test" 
                desc="Response Inhibition" 
                icon={<ArrowRightLeft className="w-5 h-5" />}
                highScore={stats.highScores.directionalSwipe}
                color="bg-teal-500"
                onClick={() => setActiveView('directionalSwipe')}
              />
              <GameCard 
                title="Spot the Odd One" 
                desc="Visual Perception" 
                icon={<Search className="w-5 h-5" />}
                highScore={stats.highScores.oddOneOut}
                color="bg-emerald-500"
                onClick={() => setActiveView('oddOneOut')}
              />
              <GameCard 
                title="Ink Color Test" 
                desc="Selective Attention" 
                icon={<Target className="w-5 h-5" />}
                highScore={stats.highScores.stroop}
                color="bg-red-500"
                onClick={() => setActiveView('stroop')}
              />
              <GameCard 
                title="Speed Math" 
                desc="Mental Arithmetic" 
                icon={<Zap className="w-5 h-5" />}
                highScore={stats.highScores.math}
                color="bg-yellow-500"
                onClick={() => setActiveView('math')}
              />
              <GameCard 
                title="Memory Grid" 
                desc="Spatial Recall" 
                icon={<Eye className="w-5 h-5" />}
                highScore={stats.highScores.pattern}
                color="bg-blue-500"
                onClick={() => setActiveView('pattern')}
              />
              <GameCard 
                title="Number Finder" 
                desc="Peripheral Vision" 
                icon={<Grid className="w-5 h-5" />}
                highScore={stats.highScores.schulte}
                unit="s"
                color="bg-slate-500"
                onClick={() => setActiveView('schulte')}
              />
            </div>
          </section>

          {/* Ad 4 */}
          <AdBanner />

          <Card className="border-none shadow-lg bg-card overflow-hidden rounded-[2rem]">
            <CardHeader className="pb-2 p-5">
              <CardTitle className="flex items-center gap-2 text-lg font-black">
                <TrendingUp className="w-4 h-4 text-primary" /> Progress Analytics
              </CardTitle>
              <CardDescription className="text-[10px] font-bold">Performance trends over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] mt-2 p-5 pt-0">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))', fontSize: '10px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.1} 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/20 rounded-xl border border-dashed text-xs">
                  <p className="font-bold">Start training to unlock analytics</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ad 5 */}
          <AdBanner />
        </main>
        
        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t z-50 px-6 py-3 flex items-center justify-between md:hidden">
          <button 
            onClick={() => setActiveView('none')}
            className={`flex flex-col items-center gap-1 ${activeView === 'none' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
          </button>
          <button 
            onClick={() => setActiveView('versus')}
            className={`flex flex-col items-center gap-1 ${activeView === 'versus' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Swords className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Battle</span>
          </button>
          <button 
            onClick={() => setActiveView('profile')}
            className={`flex flex-col items-center gap-1 ${activeView === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
          </button>
        </div>

        <footer className="py-10 border-t bg-card/50 backdrop-blur-md hidden md:block">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center gap-6 mb-4">
              <Brain className="w-5 h-5 text-primary/40" />
              <Zap className="w-5 h-5 text-primary/40" />
              <Target className="w-5 h-5 text-primary/40" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">NeuroSharp • Mind Unleashed</p>
          </div>
        </footer>
      </div>
    );
  };

  return renderContent();
}

function GameCard({ title, desc, icon, highScore, unit = "", color, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="group relative flex flex-col p-5 rounded-[2rem] bg-card shadow hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/30 text-left active:scale-[0.98]"
    >
      <div className={`p-3 rounded-xl ${color} text-white mb-4 w-fit group-hover:scale-110 transition-transform duration-300 shadow-md`}>
        {icon}
      </div>
      <h4 className="font-bold text-base mb-0.5 text-foreground group-hover:text-primary transition-colors leading-tight">{title}</h4>
      <p className="text-[10px] text-muted-foreground mb-4 font-medium leading-tight group-hover:text-foreground/80 uppercase tracking-tighter">{desc}</p>
      <div className="mt-auto flex items-center justify-between bg-muted/30 p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
        <div className="flex flex-col">
          <span className="text-[7px] uppercase font-black text-muted-foreground tracking-widest">Record</span>
          <span className="font-black text-sm text-primary">{highScore || '—'}{highScore ? unit : ''}</span>
        </div>
        <div className="bg-card p-1.5 rounded-full shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
          <ChevronRight className="w-3.5 h-3.5" />
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
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      <div className="bg-primary pt-10 pb-24 px-4 text-white">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 mb-6 hidden md:flex" onClick={onBack}>
            <ArrowLeft className="mr-2 w-4 h-4" /> Dashboard
          </Button>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white/10 p-1 rounded-full border-2 border-white/20">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-full">
                <User className="w-12 h-12 md:w-16 md:h-16 text-primary" />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              {isEditing ? (
                <div className="flex flex-col gap-3">
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/10 border-white/30 text-white text-xl md:text-2xl font-black h-12 w-full max-w-sm rounded-xl"
                    placeholder="Enter Name"
                  />
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <span className="text-xs font-bold text-white/70">Daily Goal (mins):</span>
                    <Input 
                      type="number"
                      value={goal} 
                      onChange={(e) => setGoal(parseInt(e.target.value))}
                      className="bg-white/10 border-white/30 text-white w-20 rounded-xl h-9 text-center"
                    />
                  </div>
                  <Button onClick={handleSave} size="sm" className="bg-accent text-white hover:bg-accent/90 rounded-xl h-10 font-black">
                    <Save className="mr-2 w-4 h-4" /> Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <h2 className="text-3xl md:text-5xl font-black">{stats.name}</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2 justify-center md:justify-start mt-1">
                <p className="text-primary-foreground/70 text-xs md:text-sm font-black uppercase tracking-widest">Brain Age: {brainAge} Years</p>
                <Info className="w-3 h-3 text-primary-foreground/40" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 max-w-4xl space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBox label="Overall Score" value={stats.brainScore.toLocaleString()} />
          <StatBox label="Daily Streak" value={`${stats.streak} Days`} />
          <StatBox label="Daily Goal" value={`${goal} min`} />
          <StatBox label="Mind Level" value={brainAge < 25 ? 'Genius' : brainAge < 35 ? 'Sharp' : 'Learning'} />
        </div>

        <Card className="border-none shadow-md bg-primary/5 dark:bg-primary/10 rounded-[1.5rem] p-5 border border-primary/10">
          <div className="flex gap-3 items-start">
            <div className="bg-primary p-2 rounded-xl text-white">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-sm text-primary mb-1 uppercase tracking-tighter">What is Brain Age?</h4>
              <p className="text-[10px] md:text-xs text-muted-foreground font-medium leading-relaxed">
                Brain Age is a benchmark of your mental sharpness. It estimates how your cognitive speed, memory, and logic compare to baseline performance. A lower age indicates a more "fit" and agile mind. Keep training to stay sharp!
              </p>
            </div>
          </div>
        </Card>

        <Button onClick={handleDownloadReport} variant="outline" className="w-full bg-card text-primary hover:bg-muted h-14 rounded-[1.5rem] font-black text-sm shadow-sm border-2 border-primary/10">
          Generate Progress Report (PDF)
        </Button>

        <Card className="border-none shadow-lg bg-card rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-muted/30 border-b p-6 text-center">
            <CardTitle className="text-lg md:text-xl font-black flex items-center justify-center gap-2">
              <Award className="w-6 h-6 text-primary" /> Achievement Gallery
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Mobile Bottom Navigation Duplicate for consistency */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t z-50 px-6 py-3 flex items-center justify-between md:hidden">
          <button 
            onClick={() => onBack()}
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
          </button>
          <button 
            onClick={() => onBack()}
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <Swords className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Battle</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 text-primary"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
          </button>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-card p-4 rounded-[1.5rem] shadow-sm border border-border/50 flex flex-col items-center justify-center text-center">
      <span className="text-[8px] uppercase font-black text-muted-foreground tracking-widest mb-0.5">{label}</span>
      <span className="text-lg font-black text-primary">{value}</span>
    </div>
  );
}

function AchievementItem({ title, desc, unlocked }: any) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl transition-all border ${unlocked ? 'bg-card border-primary/10 shadow-sm' : 'opacity-40 grayscale bg-muted/20 border-transparent'}`}>
      <div className={`p-2.5 rounded-xl ${unlocked ? 'bg-primary/5 text-primary' : 'bg-muted text-muted-foreground'}`}>
        <Award className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-black leading-none text-foreground">{title}</p>
        <p className="text-[9px] text-muted-foreground mt-1.5 font-bold uppercase tracking-tighter">{desc}</p>
      </div>
      {unlocked && <CheckCircle2 className="w-4 h-4 text-accent" />}
    </div>
  );
}
