
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateHighScores } from '@/lib/storage';
import { Grid, ArrowLeft, Trophy } from "lucide-react";

export default function SchulteTable({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [nextExpected, setNextExpected] = useState(1);
  const [timer, setTimer] = useState(0);

  const shuffleNumbers = useCallback(() => {
    const arr = Array.from({ length: 25 }, (_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setNumbers(arr);
  }, []);

  const startGame = () => {
    shuffleNumbers();
    setNextExpected(1);
    setTimer(0);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => setTimer(prev => prev + 0.1), 100);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const handleNumClick = (n: number) => {
    if (gameState !== 'playing') return;
    if (n === nextExpected) {
      if (n === 25) {
        setGameState('ended');
        updateHighScores('schulte', Math.round(timer * 10) / 10);
      } else {
        setNextExpected(prev => prev + 1);
      }
    }
  };

  if (gameState === 'idle') {
    return (
      <Card className="w-full max-w-lg mx-auto border-none shadow-xl bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Button variant="ghost" size="sm" className="w-fit mb-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Grid className="text-primary w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-bold">Schulte Table</CardTitle>
          <CardDescription className="text-lg">Train peripheral vision and processing speed. Tap numbers 1 to 25 in order as fast as possible.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full font-bold py-6 text-xl" onClick={startGame}>Start Challenge</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full max-w-lg mx-auto border-none shadow-xl bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto bg-yellow-400/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Trophy className="text-yellow-600 w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-bold">Completed!</CardTitle>
          <CardDescription className="text-lg">Your time: {timer.toFixed(1)}s</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button size="lg" className="w-full" onClick={startGame}>Beat Time</Button>
          <Button variant="outline" size="lg" className="w-full" onClick={onBack}>Menu</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Time</span>
          <span className="text-2xl font-bold text-primary">{timer.toFixed(1)}s</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Next Target</span>
          <span className="text-2xl font-bold text-accent">{nextExpected}</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 bg-white p-4 rounded-2xl shadow-xl border">
        {numbers.map((n) => (
          <button
            key={n}
            onClick={() => handleNumClick(n)}
            className={`aspect-square rounded-lg flex items-center justify-center text-xl font-bold transition-all ${
              n < nextExpected 
              ? "bg-accent/20 text-accent/40 border-accent/10 cursor-default" 
              : "bg-muted/20 hover:bg-muted text-foreground hover:text-slate-900 border border-muted hover:border-primary active:scale-90"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      
      <p className="text-center text-sm text-muted-foreground font-medium italic">Keep your eyes in the center to improve peripheral vision.</p>
    </div>
  );
}
