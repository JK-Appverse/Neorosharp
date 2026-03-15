
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateHighScores } from '@/lib/storage';
import { Search, ArrowLeft, Zap } from "lucide-react";

const SETS = [
  { char: 'M', odd: 'N' },
  { char: 'O', odd: 'Q' },
  { char: 'E', odd: 'F' },
  { char: 'V', odd: 'U' },
  { char: 'B', odd: '8' },
  { char: '5', odd: 'S' },
  { char: '1', odd: 'I' },
  { char: 'P', odd: 'R' },
  { char: '6', odd: '9' },
  { char: 'C', odd: 'G' },
];

export default function OddOneOut({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [grid, setGrid] = useState<string[]>([]);
  const [oddIndex, setOddIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);

  const startRound = useCallback(() => {
    const set = SETS[Math.floor(Math.random() * SETS.length)];
    const size = 20;
    const newGrid = Array(size).fill(set.char);
    const randomIndex = Math.floor(Math.random() * size);
    newGrid[randomIndex] = set.odd;
    setGrid(newGrid);
    setOddIndex(randomIndex);
    setTimeLeft(5);
  }, []);

  const startGame = () => {
    setScore(0);
    setGameState('playing');
    startRound();
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft(prev => Math.round((prev - 0.1) * 10) / 10), 100);
      return () => clearInterval(interval);
    } else if (gameState === 'playing' && timeLeft <= 0) {
      setGameState('ended');
      updateHighScores('oddOneOut', score);
    }
  }, [gameState, timeLeft, score]);

  const handleTileClick = (idx: number) => {
    if (idx === oddIndex) {
      setScore(prev => prev + 10);
      startRound();
    } else {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }
  };

  if (gameState === 'idle') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-8">
          <Button variant="ghost" size="sm" className="w-fit mb-4 absolute left-4 top-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mx-auto bg-emerald-100 p-5 rounded-3xl w-20 h-20 flex items-center justify-center mb-6">
            <Search className="text-emerald-600 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black">Odd One Out</CardTitle>
          <CardDescription className="text-base font-medium px-4">
            Find the symbol that is different from others. Be quick, the clock is ticking!
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4">
          <Button size="lg" className="w-full font-black py-7 text-xl rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200" onClick={startGame}>
            Start Searching
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-10">
          <CardTitle className="text-3xl font-black">Time's Up!</CardTitle>
          <CardDescription className="text-lg font-bold text-emerald-600">Points Collected: {score}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pb-10 px-8">
          <Button size="lg" className="w-full font-black py-6 rounded-2xl" onClick={startGame}>Try Again</Button>
          <Button variant="outline" size="lg" className="w-full font-black py-6 rounded-2xl" onClick={onBack}>Menu</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Score</span>
          <span className="text-3xl font-black text-emerald-600">{score}</span>
        </div>
        <div className="flex flex-col items-center flex-1 mx-4">
           <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Timer</span>
           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 transition-all duration-100" style={{ width: `${(timeLeft / 5) * 100}%` }}></div>
           </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl font-black text-slate-800">{timeLeft.toFixed(1)}s</span>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-50">
        {grid.map((char, i) => (
          <button
            key={i}
            onClick={() => handleTileClick(i)}
            className="aspect-square flex items-center justify-center text-4xl font-black rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-slate-950 transition-all active:scale-90 border border-transparent hover:border-emerald-200"
          >
            {char}
          </button>
        ))}
      </div>
      
      <p className="text-center text-sm text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
        <Zap className="w-4 h-4 text-emerald-400" /> Focus Your Vision
      </p>
    </div>
  );
}
