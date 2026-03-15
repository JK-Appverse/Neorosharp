
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateHighScores } from '@/lib/storage';
import { ArrowLeft, ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight, Brain } from "lucide-react";

type Direction = 'up' | 'down' | 'left' | 'right';
type Color = 'blue' | 'red';

export default function DirectionalSwipe({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [challenge, setChallenge] = useState<{ dir: Direction, color: Color }>({ dir: 'up', color: 'blue' });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const startRound = useCallback(() => {
    const directions: Direction[] = ['up', 'down', 'left', 'right'];
    const colors: Color[] = ['blue', 'red'];
    setChallenge({
      dir: directions[Math.floor(Math.random() * directions.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }, []);

  const startGame = () => {
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
      setGameState('ended');
      updateHighScores('directionalSwipe', score);
    }
  }, [gameState, timeLeft, score]);

  const handleMove = (move: Direction) => {
    const { dir, color } = challenge;
    let isCorrect = false;

    if (color === 'blue') {
      isCorrect = move === dir;
    } else {
      // Opposite
      if (dir === 'up') isCorrect = move === 'down';
      if (dir === 'down') isCorrect = move === 'up';
      if (dir === 'left') isCorrect = move === 'right';
      if (dir === 'right') isCorrect = move === 'left';
    }

    if (isCorrect) {
      setScore(prev => prev + 10);
      startRound();
    } else {
      setScore(prev => Math.max(0, prev - 5));
      startRound();
    }
  };

  if (gameState === 'idle') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-8">
          <Button variant="ghost" size="sm" className="w-fit mb-4 absolute left-4 top-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mx-auto bg-teal-100 p-5 rounded-3xl w-20 h-20 flex items-center justify-center mb-6">
            <ArrowRight className="text-teal-600 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black">Inhibition Logic</CardTitle>
          <CardDescription className="text-base font-medium px-4 leading-relaxed">
            Follow the rules carefully:<br/>
            <span className="text-blue-600 font-bold">Blue Arrow</span>: Tap the SAME direction.<br/>
            <span className="text-red-600 font-bold">Red Arrow</span>: Tap the OPPOSITE direction.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4 px-8">
          <Button size="lg" className="w-full font-black py-7 text-xl rounded-2xl bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-200" onClick={startGame}>
            Start Inhibition Training
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-10">
          <CardTitle className="text-3xl font-black">Training Complete</CardTitle>
          <CardDescription className="text-lg font-bold text-teal-600">Accuracy Score: {score}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pb-10 px-8">
          <Button size="lg" className="w-full font-black py-6 rounded-2xl bg-teal-600" onClick={startGame}>Try Again</Button>
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
          <span className="text-3xl font-black text-teal-600">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Time Left</span>
          <span className={`text-3xl font-black ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>{timeLeft}s</span>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-10 flex flex-col items-center justify-center min-h-[300px]">
        <div className={`p-10 rounded-[2rem] bg-slate-50 transition-colors duration-300 ${challenge.color === 'blue' ? 'text-blue-500 bg-blue-50' : 'text-red-500 bg-red-50'}`}>
          {challenge.dir === 'up' && <ArrowUp className="w-24 h-24 stroke-[4]" />}
          {challenge.dir === 'down' && <ArrowDown className="w-24 h-24 stroke-[4]" />}
          {challenge.dir === 'left' && <ArrowLeftIcon className="w-24 h-24 stroke-[4]" />}
          {challenge.dir === 'right' && <ArrowRight className="w-24 h-24 stroke-[4]" />}
        </div>
        <p className={`mt-6 font-black uppercase tracking-widest ${challenge.color === 'blue' ? 'text-blue-400' : 'text-red-400'}`}>
          {challenge.color === 'blue' ? 'Same Way' : 'Opposite Way'}
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-20 rounded-2xl border-2 hover:bg-slate-50" onClick={() => handleMove('up')}><ArrowUp className="w-8 h-8" /></Button>
        <Button variant="outline" className="h-20 rounded-2xl border-2 hover:bg-slate-50" onClick={() => handleMove('down')}><ArrowDown className="w-8 h-8" /></Button>
        <Button variant="outline" className="h-20 rounded-2xl border-2 hover:bg-slate-50" onClick={() => handleMove('left')}><ArrowLeftIcon className="w-8 h-8" /></Button>
        <Button variant="outline" className="h-20 rounded-2xl border-2 hover:bg-slate-50" onClick={() => handleMove('right')}><ArrowRight className="w-8 h-8" /></Button>
      </div>
    </div>
  );
}
