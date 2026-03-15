
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateHighScores } from '@/lib/storage';
import { Eye, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    }, 2000);
  }, []);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    startLevel(1);
  };

  const handleTileClick = (idx: number) => {
    if (gameState !== 'playing') return;
    if (userPattern.includes(idx)) return;

    if (pattern.includes(idx)) {
      const newUserPattern = [...userPattern, idx];
      setUserPattern(newUserPattern);
      
      if (newUserPattern.length === pattern.length) {
        setScore(prev => prev + level * 10);
        setLevel(prev => prev + 1);
        setTimeout(() => startLevel(level + 1), 500);
      }
    } else {
      setGameState('ended');
      updateHighScores('pattern', score);
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
            <Eye className="text-primary w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-bold">Pattern Recall</CardTitle>
          <CardDescription className="text-lg">Enhance visual short-term memory. Memorize the tiles that flash and tap them correctly.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full font-bold py-6 text-xl" onClick={startGame}>Start Memory Training</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full max-w-lg mx-auto border-none shadow-xl bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Pattern Broken!</CardTitle>
          <CardDescription className="text-lg">You reached Level {level} with {score} points.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button size="lg" className="w-full" onClick={startGame}>Try Again</Button>
          <Button variant="outline" size="lg" className="w-full" onClick={onBack}>Menu</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Score</span>
          <span className="text-2xl font-bold text-primary">{score}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Level</span>
          <span className="text-2xl font-bold text-accent">{level}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Status</span>
          <span className="text-sm font-bold text-foreground">
            {gameState === 'showing' ? 'MEMORIZE...' : 'YOUR TURN'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 bg-white p-4 rounded-2xl shadow-xl border">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            onClick={() => handleTileClick(i)}
            className={cn(
              "aspect-square rounded-lg border-2 transition-all duration-300 cursor-pointer flex items-center justify-center",
              gameState === 'showing' && pattern.includes(i) ? "bg-primary border-primary scale-95" : "bg-muted/30 border-muted",
              gameState === 'playing' && userPattern.includes(i) ? "bg-accent border-accent scale-95" : "",
              gameState === 'playing' && !userPattern.includes(i) ? "hover:border-primary/40" : ""
            )}
          >
            {userPattern.includes(i) && <CheckCircle2 className="text-white w-6 h-6" />}
          </div>
        ))}
      </div>
      
      <p className="text-center text-sm text-muted-foreground font-medium">
        {gameState === 'showing' ? 'Look closely!' : `Select ${pattern.length} tiles from memory.`}
      </p>
    </div>
  );
}
