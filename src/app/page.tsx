
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStats, UserStats } from '@/lib/storage';
import { 
  Brain, 
  Zap, 
  Eye, 
  Grid, 
  TrendingUp, 
  Flame, 
  Award,
  ChevronRight,
  Target,
  Hash,
  RefreshCw,
  Search,
  Timer,
  ArrowRightLeft
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

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ActiveGame = 'none' | 'stroop' | 'math' | 'pattern' | 'schulte' | 'digitSpan' | 'reverseWord' | 'oddOneOut' | 'reactionTime' | 'directionalSwipe';

export default function Home() {
  const [activeGame, setActiveGame] = useState<ActiveGame>('none');
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, [activeGame]);

  if (!stats) return null;

  if (activeGame !== 'none') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full max-w-2xl">
          {activeGame === 'stroop' && <StroopTest onBack={() => setActiveGame('none')} />}
          {activeGame === 'math' && <MathRush onBack={() => setActiveGame('none')} />}
          {activeGame === 'pattern' && <PatternRecall onBack={() => setActiveGame('none')} />}
          {activeGame === 'schulte' && <SchulteTable onBack={() => setActiveGame('none')} />}
          {activeGame === 'digitSpan' && <DigitSpan onBack={() => setActiveGame('none')} />}
          {activeGame === 'reverseWord' && <ReverseWord onBack={() => setActiveGame('none')} />}
          {activeGame === 'oddOneOut' && <OddOneOut onBack={() => setActiveGame('none')} />}
          {activeGame === 'reactionTime' && <ReactionTime onBack={() => setActiveGame('none')} />}
          {activeGame === 'directionalSwipe' && <DirectionalSwipe onBack={() => setActiveGame('none')} />}
        </div>
      </div>
    );
  }

  const chartData = stats.history.slice(-7);

  return (
    <div className="min-h-screen pb-12 bg-slate-50/50">
      <header className="bg-primary pt-12 pb-24 px-4 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-xl">
                <Brain className="text-primary w-8 h-8" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tighter">NeuroSharp</h1>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold text-primary-foreground/70">Streak</span>
                <div className="flex items-center gap-1">
                  <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
                  <span className="font-bold text-xl">{stats.streak}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-xl">
            <p className="text-primary-foreground/80 mb-2 font-medium">Cognitive Score</p>
            <h2 className="text-6xl font-black mb-4">{stats.brainScore.toLocaleString()}</h2>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                <span className="block text-[10px] uppercase font-bold text-primary-foreground/70">Mental Level</span>
                <span className="font-bold text-lg">Elite</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                <span className="block text-[10px] uppercase font-bold text-primary-foreground/70">Global Rank</span>
                <span className="font-bold text-lg">Top 5%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 -mt-12 space-y-12 max-w-6xl">
        <section>
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" /> Training Modules
            </h3>
            <span className="text-sm text-muted-foreground font-semibold">9 Exercises Available</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <GameCard 
              title="Digit Span" 
              desc="Sequence Memory" 
              icon={<Hash className="w-6 h-6" />}
              highScore={stats.highScores.digitSpan}
              color="bg-purple-500"
              onClick={() => setActiveGame('digitSpan')}
            />
            <GameCard 
              title="Reaction Time" 
              desc="Neural Reflexes" 
              icon={<Timer className="w-6 h-6" />}
              highScore={stats.highScores.reactionTime}
              unit="ms"
              color="bg-orange-500"
              onClick={() => setActiveGame('reactionTime')}
            />
            <GameCard 
              title="Reverse Word" 
              desc="Language Logic" 
              icon={<RefreshCw className="w-6 h-6" />}
              highScore={stats.highScores.reverseWord}
              color="bg-pink-500"
              onClick={() => setActiveGame('reverseWord')}
            />
            <GameCard 
              title="Inhibition" 
              desc="Directional Swipe" 
              icon={<ArrowRightLeft className="w-6 h-6" />}
              highScore={stats.highScores.directionalSwipe}
              color="bg-teal-500"
              onClick={() => setActiveGame('directionalSwipe')}
            />
            <GameCard 
              title="Odd One Out" 
              desc="Visual Perception" 
              icon={<Search className="w-6 h-6" />}
              highScore={stats.highScores.oddOneOut}
              color="bg-emerald-500"
              onClick={() => setActiveGame('oddOneOut')}
            />
            <GameCard 
              title="Stroop Test" 
              desc="Focus & Attention" 
              icon={<Target className="w-6 h-6" />}
              highScore={stats.highScores.stroop}
              color="bg-red-500"
              onClick={() => setActiveGame('stroop')}
            />
            <GameCard 
              title="Math Rush" 
              desc="Speed & Logic" 
              icon={<Zap className="w-6 h-6" />}
              highScore={stats.highScores.math}
              color="bg-yellow-500"
              onClick={() => setActiveGame('math')}
            />
            <GameCard 
              title="Pattern Recall" 
              desc="Visual Memory" 
              icon={<Eye className="w-6 h-6" />}
              highScore={stats.highScores.pattern}
              color="bg-blue-500"
              onClick={() => setActiveGame('pattern')}
            />
            <GameCard 
              title="Schulte Table" 
              desc="Peripheral Vision" 
              icon={<Grid className="w-6 h-6" />}
              highScore={stats.highScores.schulte}
              unit="s"
              color="bg-indigo-500"
              onClick={() => setActiveGame('schulte')}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          <Card className="lg:col-span-2 border-none shadow-2xl bg-white overflow-hidden rounded-3xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="w-5 h-5 text-primary" /> Progress Analytics
              </CardTitle>
              <CardDescription>Daily cognitive activity and performance trends</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] mt-4">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
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
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-slate-50 rounded-2xl border border-dashed">
                  <p className="font-medium">Complete your first training to unlock analytics</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="w-5 h-5 text-primary" /> Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AchievementItem 
                title="Early Adopter" 
                desc="Completed first training" 
                unlocked={stats.brainScore > 0} 
              />
              <AchievementItem 
                title="Pattern Master" 
                desc="Pattern Recall Level 10+" 
                unlocked={stats.highScores.pattern >= 100} 
              />
              <AchievementItem 
                title="Light Speed" 
                desc="Reaction Time < 250ms" 
                unlocked={stats.highScores.reactionTime > 0 && stats.highScores.reactionTime < 250} 
              />
              <AchievementItem 
                title="Memory Vault" 
                desc="Digit Span 10+ digits" 
                unlocked={stats.highScores.digitSpan >= 10} 
              />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="py-12 border-t bg-white/50 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <Brain className="w-6 h-6 text-primary/40" />
            <Zap className="w-6 h-6 text-primary/40" />
            <Target className="w-6 h-6 text-primary/40" />
          </div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">NeuroSharp • Offline Training</p>
        </div>
      </footer>
    </div>
  );
}

function GameCard({ title, desc, icon, highScore, unit = "", color, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="group relative flex flex-col p-6 rounded-[2rem] bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-primary/30 text-left active:scale-[0.98]"
    >
      <div className={`p-4 rounded-2xl ${color} text-white mb-6 w-fit group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
        {icon}
      </div>
      <h4 className="font-bold text-xl mb-1 text-slate-800">{title}</h4>
      <p className="text-sm text-muted-foreground mb-6 font-medium leading-tight">{desc}</p>
      <div className="mt-auto flex items-center justify-between bg-slate-50 p-4 rounded-2xl group-hover:bg-primary/5 transition-colors">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">Record</span>
          <span className="font-black text-lg text-primary">{highScore || '—'}{highScore ? unit : ''}</span>
        </div>
        <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </button>
  );
}

function AchievementItem({ title, desc, unlocked }: any) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${unlocked ? 'bg-slate-50' : 'opacity-40 grayscale'}`}>
      <div className={`p-3 rounded-xl ${unlocked ? 'bg-white text-primary shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
        <Award className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-black leading-none text-slate-800">{title}</p>
        <p className="text-xs text-muted-foreground mt-1 font-medium">{desc}</p>
      </div>
      {unlocked && (
        <div className="ml-auto">
          <div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
        </div>
      )}
    </div>
  );
}
