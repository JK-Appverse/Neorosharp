
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateHighScores } from '@/lib/storage';
import { Eye, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { playSound } from '@/lib/audio';

export default function PatternRecall({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'ended'>('idle');
  const [level, setLevel] = useState(1);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const startLevel = useCallback((l: number) => {
    const numTiles = 3 + Math.floor(l / 2);
    const newPattern: number[] = [];
    while (newPattern.length < numTiles) {
      const idx = Math.floor(Math.random() * 16);
      if (!newPattern.includes(idx)) newPattern.push(idx);
    }
    setPattern(newPattern);
    setUserPattern([]);
    setGameState('showing');
    
    setTimeout(() => {
      setGameState('playing');
    }, 1500 + (l * 100));
  }, []);

  const startGame = () => {
    playSound('click');
    setScore(0);
    setLevel(1);
    startLevel(1);
  };

  const handleTileClick = (idx: number) => {
    if (gameState !== 'playing') return;
    if (userPattern.includes(idx)) return;

    if (pattern.includes(idx)) {
      playSound('click');
      const newUserPattern = [...userPattern, idx];
      setUserPattern(newUserPattern);
      
      if (newUserPattern.length === pattern.length) {
        playSound('success');
        setScore(prev => prev + level * 10);
        setLevel(prev => prev + 1);
        setTimeout(() => startLevel(level + 1), 500);
      }
    } else {
      playSound('error');
      setGameState('ended');
      updateHighScores('pattern', score);
    }
  };

  if (gameState === 'idle') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-8">
          <Button variant="ghost" size="sm" className="w-fit mb-4 absolute left-4 top-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mx-auto bg-blue-100 p-5 rounded-3xl w-20 h-20 flex items-center justify-center mb-6">
            <Eye className="text-blue-600 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black">Pattern Recall</CardTitle>
          <CardDescription className="text-base font-medium px-4">
            Enhance visual short-term memory. Memorize the tiles that flash and tap them correctly.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4 px-8">
          <Button size="lg" className="w-full font-black py-7 text-xl rounded-2xl bg-blue-600 shadow-lg shadow-blue-200" onClick={startGame}>Start Training</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-10">
          <CardTitle className="text-3xl font-black text-slate-800">Pattern Broken!</CardTitle>
          <CardDescription className="text-lg font-bold text-blue-600">Reached Level {level}</CardDescription>
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
          <span className="text-3xl font-black text-blue-600">{score}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Level</span>
          <span className="text-3xl font-black text-slate-800">{level}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Status</span>
          <span className="text-sm font-bold text-slate-600">
            {gameState === 'showing' ? 'MEMORIZE' : 'YOUR TURN'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-50">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            onClick={() => handleTileClick(i)}
            className={cn(
              "aspect-square rounded-2xl border-2 transition-all duration-300 cursor-pointer flex items-center justify-center",
              gameState === 'showing' && pattern.includes(i) ? "bg-blue-600 border-blue-600 scale-95" : "bg-slate-50 border-slate-100",
              gameState === 'playing' && userPattern.includes(i) ? "bg-emerald-500 border-emerald-500 scale-95" : "",
              gameState === 'playing' && !userPattern.includes(i) ? "hover:border-blue-400 hover:bg-blue-50/30" : ""
            )}
          >
            {userPattern.includes(i) && <CheckCircle2 className="text-white w-8 h-8" />}
          </div>
        ))}
      </div>
      
      <p className="text-center text-xs font-black uppercase tracking-widest text-slate-400">
        {gameState === 'showing' ? 'Look closely at the grid' : `Tap the ${pattern.length} memorized tiles`}
      </p>
    </div>
  );
}
