
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
  Target
} from "lucide-react";
import StroopTest from '@/components/games/StroopTest';
import MathRush from '@/components/games/MathRush';
import PatternRecall from '@/components/games/PatternRecall';
import SchulteTable from '@/components/games/SchulteTable';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ActiveGame = 'none' | 'stroop' | 'math' | 'pattern' | 'schulte';

export default function Home() {
  const [activeGame, setActiveGame] = useState<ActiveGame>('none');
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, [activeGame]);

  if (!stats) return null;

  if (activeGame !== 'none') {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeGame === 'stroop' && <StroopTest onBack={() => setActiveGame('none')} />}
        {activeGame === 'math' && <MathRush onBack={() => setActiveGame('none')} />}
        {activeGame === 'pattern' && <PatternRecall onBack={() => setActiveGame('none')} />}
        {activeGame === 'schulte' && <SchulteTable onBack={() => setActiveGame('none')} />}
      </div>
    );
  }

  const chartData = stats.history.slice(-7);

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-primary pt-12 pb-24 px-4 text-white">
        <div className="container mx-auto">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-primary-foreground/80 mb-2 font-medium">Global Cognitive Score</p>
              <h2 className="text-6xl font-black mb-4">{stats.brainScore.toLocaleString()}</h2>
              <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                  <span className="block text-[10px] uppercase font-bold text-primary-foreground/70">Mental Age</span>
                  <span className="font-bold text-lg">Elite</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                  <span className="block text-[10px] uppercase font-bold text-primary-foreground/70">Rank</span>
                  <span className="font-bold text-lg">Top 5%</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="score" stroke="#fff" fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 -mt-12 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Training Modules
            </h3>
            <span className="text-sm text-muted-foreground font-medium">Daily Focus</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              color="bg-accent"
              onClick={() => setActiveGame('schulte')}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-xl bg-white overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="w-5 h-5 text-primary" /> Progress Overview
              </CardTitle>
              <CardDescription>Daily cognitive activity and performance trends</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" hide />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
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
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <p>Start playing to see your progress!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="w-5 h-5 text-primary" /> Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AchievementItem 
                title="Early Adopter" 
                desc="Completed first training" 
                unlocked={stats.brainScore > 0} 
              />
              <AchievementItem 
                title="Focus Master" 
                desc="Stroop High Score > 100" 
                unlocked={stats.highScores.stroop > 100} 
              />
              <AchievementItem 
                title="Mathematician" 
                desc="Math Rush Score > 150" 
                unlocked={stats.highScores.math > 150} 
              />
              <AchievementItem 
                title="Sharpshooter" 
                desc="Schulte Table < 20s" 
                unlocked={stats.highScores.schulte > 0 && stats.highScores.schulte < 20} 
              />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="mt-12 py-8 border-t bg-white/50 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm font-medium">© 2024 NeuroSharp. Completely Offline Cognitive Training.</p>
        </div>
      </footer>
    </div>
  );
}

function GameCard({ title, desc, icon, highScore, unit = "", color, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="group relative flex flex-col p-6 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-primary/20 text-left"
    >
      <div className={`p-4 rounded-2xl ${color} text-white mb-6 w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        {icon}
      </div>
      <h4 className="font-bold text-xl mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground mb-4 font-medium">{desc}</p>
      <div className="mt-auto flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">High Score</span>
          <span className="font-bold text-lg text-primary">{highScore}{unit}</span>
        </div>
        <div className="bg-muted p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-300">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </button>
  );
}

function AchievementItem({ title, desc, unlocked }: any) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-xl transition-all ${unlocked ? 'bg-white' : 'opacity-40 grayscale'}`}>
      <div className={`p-2 rounded-lg ${unlocked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
        <Award className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-bold leading-none">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </div>
      {unlocked && (
        <div className="ml-auto">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </div>
      )}
    </div>
  );
}
