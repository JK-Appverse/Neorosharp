
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStats, UserStats, updateUserName } from '@/lib/storage';
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
  ArrowRightLeft,
  User,
  ArrowLeft,
  CheckCircle2,
  Save
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

type ActiveView = 'none' | 'stroop' | 'math' | 'pattern' | 'schulte' | 'digitSpan' | 'reverseWord' | 'oddOneOut' | 'reactionTime' | 'directionalSwipe' | 'profile';

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('none');
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, [activeView]);

  if (!stats) return null;

  if (activeView === 'profile') {
    return <ProfileView stats={stats} onBack={() => setActiveView('none')} />;
  }

  if (activeView !== 'none') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            <div className="flex gap-4 items-center">
              <div className="flex flex-col items-center mr-2">
                <span className="text-[10px] uppercase font-bold text-primary-foreground/70">Streak</span>
                <div className="flex items-center gap-1">
                  <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
                  <span className="font-bold text-xl">{stats.streak}</span>
                </div>
              </div>
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
          
          <div className="max-w-xl">
            <p className="text-primary-foreground/80 mb-2 font-medium">Welcome back, {stats.name}</p>
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
            <GameCard 
              title="Pattern Recall" 
              desc="Visual Memory" 
              icon={<Eye className="w-6 h-6" />}
              highScore={stats.highScores.pattern}
              color="bg-blue-500"
              onClick={() => setActiveView('pattern')}
            />
            <GameCard 
              title="Schulte Table" 
              desc="Peripheral Vision" 
              icon={<Grid className="w-6 h-6" />}
              highScore={stats.highScores.schulte}
              unit="s"
              color="bg-indigo-500"
              onClick={() => setActiveView('schulte')}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          <Card className="lg:col-span-3 border-none shadow-2xl bg-white overflow-hidden rounded-3xl">
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
      <h4 className="font-bold text-xl mb-1 text-slate-800 group-hover:text-slate-950">{title}</h4>
      <p className="text-sm text-muted-foreground mb-6 font-medium leading-tight group-hover:text-slate-600">{desc}</p>
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

function ProfileView({ stats, onBack }: { stats: UserStats, onBack: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(stats.name);

  const handleSaveName = () => {
    updateUserName(name);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-primary pt-12 pb-32 px-4 text-white">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" className="text-white hover:bg-white/10 mb-8" onClick={onBack}>
            <ArrowLeft className="mr-2 w-5 h-5" /> Back to Training
          </Button>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="bg-white/10 p-1 rounded-full border-4 border-white/20">
              <div className="bg-white p-6 rounded-full">
                <User className="w-20 h-20 text-primary" />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              {isEditing ? (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/10 border-white/30 text-white text-3xl font-black h-16 w-full max-w-sm rounded-2xl focus:ring-white"
                    autoFocus
                  />
                  <Button onClick={handleSaveName} className="bg-accent text-white hover:bg-accent/90 rounded-2xl h-16 px-8 font-black text-xl">
                    <Save className="mr-2 w-6 h-6" /> Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <h2 className="text-5xl font-black">{stats.name}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-white/60 hover:text-white hover:bg-white/10">
                    Edit
                  </Button>
                </div>
              )}
              <p className="text-primary-foreground/70 text-lg mt-2 font-medium">Global Rank: Elite Master • Member since 2024</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 max-w-4xl space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Total Score" value={stats.brainScore.toLocaleString()} />
          <StatBox label="Daily Streak" value={`${stats.streak} Days`} />
          <StatBox label="Exercises Done" value="1,240" />
          <StatBox label="Mental Age" value="21" />
        </div>

        <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b p-8">
            <CardTitle className="text-2xl font-black flex items-center gap-2">
              <Award className="w-8 h-8 text-primary" /> Your Achievement Gallery
            </CardTitle>
            <CardDescription className="text-base font-medium">Tracking your mental growth and milestones</CardDescription>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            <AchievementItem 
              title="Math Wizard" 
              desc="Scored 500+ in Math Rush" 
              unlocked={stats.highScores.math >= 500} 
            />
            <AchievementItem 
              title="Focus Legend" 
              desc="Schulte Table < 15 seconds" 
              unlocked={stats.highScores.schulte > 0 && stats.highScores.schulte < 15} 
            />
            <AchievementItem 
              title="Dual Tasker" 
              desc="High Score in Stroop Test" 
              unlocked={stats.highScores.stroop >= 200} 
            />
            <AchievementItem 
              title="Consistency King" 
              desc="Reached a 7-day streak" 
              unlocked={stats.streak >= 7} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center">
      <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{label}</span>
      <span className="text-2xl font-black text-primary">{value}</span>
    </div>
  );
}

function AchievementItem({ title, desc, unlocked }: any) {
  return (
    <div className={`flex items-center gap-4 p-5 rounded-3xl transition-all border ${unlocked ? 'bg-white border-primary/10 shadow-md' : 'opacity-40 grayscale bg-slate-100 border-transparent'}`}>
      <div className={`p-4 rounded-2xl ${unlocked ? 'bg-primary/5 text-primary' : 'bg-slate-200 text-slate-400'}`}>
        <Award className="w-8 h-8" />
      </div>
      <div className="flex-1">
        <p className="text-base font-black leading-none text-slate-800">{title}</p>
        <p className="text-xs text-muted-foreground mt-2 font-bold uppercase tracking-tight">{desc}</p>
      </div>
      {unlocked && (
        <div className="flex flex-col items-center">
          <CheckCircle2 className="w-6 h-6 text-accent" />
          <span className="text-[8px] font-black text-accent mt-1">EARNED</span>
        </div>
      )}
    </div>
  );
}
