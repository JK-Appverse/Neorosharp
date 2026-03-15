
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateHighScores } from '@/lib/storage';
import { ArrowLeft, Search, Zap } from "lucide-react";
import { playSound } from '@/lib/audio';

const EMOJI_SETS = [
  { base: '😎', odd: '🕶️' },
  { base: '😊', odd: '😋' },
  { base: '🐶', odd: '🐱' },
  { base: '🍎', odd: '🍒' },
  { base: '⚽', odd: '🏀' },
  { base: '💎', odd: '💍' },
  { base: '🔥', odd: '💥' },
  { base: '🚀', odd: '🛸' },
];

export default function EmojiHunt({ onBack, isDaily }: { onBack: () => void, isDaily?: boolean }) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [grid, setGrid] = useState<string[]>([]);
  const [oddIndex, setOddIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const startRound = useCallback(() => {
    const set = EMOJI_SETS[Math.floor(Math.random() * EMOJI_SETS.length)];
    const size = 20;
    const newGrid = Array(size).fill(set.base);
    const randomIndex = Math.floor(Math.random() * size);
    newGrid[randomIndex] = set.odd;
    setGrid(newGrid);
    setOddIndex(randomIndex);
  }, []);

  const startGame = () => {
    playSound('click');
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
    startRound();
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (gameState === 'playing' && timeLeft <= 0) {
      playSound('error');
      setGameState('ended');
      updateHighScores('emojiHunt', score, isDaily);
    }
  }, [gameState, timeLeft, score, isDaily]);

  const handleTileClick = (idx: number) => {
    if (idx === oddIndex) {
      playSound('success');
      setScore(prev => prev + 15);
      startRound();
    } else {
      playSound('error');
      setScore(prev => Math.max(0, prev - 10));
    }
  };

  if (gameState === 'idle') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-8">
          <Button variant="ghost" size="sm" className="w-fit mb-4 absolute left-4 top-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mx-auto bg-amber-100 p-5 rounded-3xl w-20 h-20 flex items-center justify-center mb-6">
            <Search className="text-amber-600 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black">Emoji Hunt</CardTitle>
          <CardDescription className="text-base font-medium px-4">
            Find the unique emoji in the grid as fast as you can!
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4 px-8">
          <Button size="lg" className="w-full font-black py-7 text-xl rounded-2xl bg-amber-600 shadow-lg" onClick={startGame}>
            Start Hunting
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden text-center p-10">
        <h2 className="text-3xl font-black mb-2">Hunt Over</h2>
        <p className="text-xl font-bold text-amber-600 mb-8">Score: {score}</p>
        <div className="space-y-4">
          <Button size="lg" className="w-full font-black rounded-2xl" onClick={startGame}>Try Again</Button>
          <Button variant="outline" size="lg" className="w-full font-black rounded-2xl" onClick={onBack}>Menu</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Score</span>
          <span className="text-3xl font-black text-amber-600">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Time</span>
          <span className={`text-3xl font-black ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>{timeLeft}s</span>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 bg-white p-6 rounded-[2.5rem] shadow-2xl">
        {grid.map((emoji, i) => (
          <button
            key={i}
            onClick={() => handleTileClick(i)}
            className="aspect-square flex items-center justify-center text-4xl rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all active:scale-90"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
