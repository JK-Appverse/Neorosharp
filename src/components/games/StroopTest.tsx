
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateHighScores } from '@/lib/storage';
import { Progress } from "@/components/ui/progress";
import { Brain, ArrowLeft } from "lucide-react";

const COLORS = [
  { name: 'RED', value: '#ef4444', class: 'text-red-500' },
  { name: 'BLUE', value: '#3b82f6', class: 'text-blue-500' },
  { name: 'GREEN', value: '#22c55e', class: 'text-green-500' },
  { name: 'YELLOW', value: '#eab308', class: 'text-yellow-500' },
  { name: 'PURPLE', value: '#a855f7', class: 'text-purple-500' },
];

export default function StroopTest({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [currentWord, setCurrentWord] = useState(COLORS[0]);
  const [currentColor, setCurrentColor] = useState(COLORS[1]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const nextChallenge = useCallback(() => {
    const randomWordIdx = Math.floor(Math.random() * COLORS.length);
    const randomColorIdx = Math.floor(Math.random() * COLORS.length);
    setCurrentWord(COLORS[randomWordIdx]);
    setCurrentColor(COLORS[randomColorIdx]);
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    nextChallenge();
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('ended');
      updateHighScores('stroop', score);
    }
  }, [gameState, timeLeft, score]);

  const handleChoice = (colorValue: string) => {
    if (colorValue === currentColor.value) {
      setScore(prev => prev + 10);
      nextChallenge();
    } else {
      setScore(prev => Math.max(0, prev - 5));
      nextChallenge();
    }
  };

  if (gameState === 'idle') {
    return (
      <Card className="w-full max-w-lg mx-auto border-none shadow-xl bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Button variant="ghost" size="sm" className="w-fit mb-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Brain className="text-primary w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Stroop Test</CardTitle>
          <CardDescription className="text-lg">Train your selective attention. Identify the <b>ink color</b>, not the word itself.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="p-8 bg-muted/50 rounded-xl text-center w-full">
            <p className="text-sm text-muted-foreground mb-4 uppercase tracking-widest font-bold">Example</p>
            <p className="text-4xl font-extrabold text-blue-500">RED</p>
            <p className="mt-4 text-sm">Correct answer: <span className="text-blue-500 font-bold">BLUE</span></p>
          </div>
          <Button size="lg" className="w-full py-6 text-xl font-bold" onClick={startGame}>Start Training</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full max-w-lg mx-auto border-none shadow-xl bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Time's Up!</CardTitle>
          <CardDescription className="text-lg">You scored {score} points.</CardDescription>
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
          <span className="text-xs text-muted-foreground font-bold uppercase">Score</span>
          <span className="text-2xl font-bold text-primary">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground font-bold uppercase">Time Left</span>
          <span className={`text-2xl font-bold ${timeLeft < 10 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>{timeLeft}s</span>
        </div>
      </div>
      
      <Progress value={(timeLeft / 30) * 100} className="h-2" />

      <Card className="border-none shadow-2xl bg-white h-64 flex items-center justify-center">
        <CardContent>
          <p className="text-6xl font-black tracking-tighter transition-all transform duration-200" style={{ color: currentColor.value }}>
            {currentWord.name}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {COLORS.map((c) => (
          <Button
            key={c.name}
            variant="outline"
            className="h-20 text-xl font-bold border-2 hover:bg-muted transition-colors hover:text-slate-900"
            onClick={() => handleChoice(c.value)}
          >
            {c.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
