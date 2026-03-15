
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateHighScores } from '@/lib/storage';
import { ArrowLeft, Brain, Check, X, Circle, Square, Triangle, Pentagon } from "lucide-react";
import { playSound } from '@/lib/audio';

const SHAPES = [Circle, Square, Triangle, Pentagon];

export default function SpeedMatch({ onBack, isDaily }: { onBack: () => void, isDaily?: boolean }) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const startRound = useCallback(() => {
    setPrevIdx(currentIdx);
    setCurrentIdx(Math.floor(Math.random() * SHAPES.length));
  }, [currentIdx]);

  const startGame = () => {
    playSound('click');
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
    setCurrentIdx(Math.floor(Math.random() * SHAPES.length));
    setPrevIdx(null);
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'playing' && timeLeft <= 0) {
      playSound('error');
      setGameState('ended');
      updateHighScores('speedMatch', score, isDaily);
    }
  }, [gameState, timeLeft, score, isDaily]);

  const handleChoice = (same: boolean) => {
    if (prevIdx === null) {
      startRound();
      return;
    }

    const isCorrect = (prevIdx === currentIdx) === same;
    if (isCorrect) {
      playSound('success');
      setScore(prev => prev + 10);
    } else {
      playSound('error');
      setScore(prev => Math.max(0, prev - 5));
    }
    startRound();
  };

  const CurrentShape = SHAPES[currentIdx];

  if (gameState === 'idle') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-8">
          <Button variant="ghost" size="sm" className="w-fit mb-4 absolute left-4 top-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mx-auto bg-blue-100 p-5 rounded-3xl w-20 h-20 flex items-center justify-center mb-6">
            <Brain className="text-blue-600 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black">Speed Match</CardTitle>
          <CardDescription className="text-base font-medium px-4">
            Is the current shape identical to the previous one?
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4 px-8">
          <Button size="lg" className="w-full font-black py-7 text-xl rounded-2xl bg-blue-600 shadow-lg" onClick={startGame}>
            Start Matching
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden text-center p-10">
        <h2 className="text-3xl font-black mb-2">Round Over</h2>
        <p className="text-xl font-bold text-blue-600 mb-8">Score: {score}</p>
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
          <span className="text-3xl font-black text-blue-600">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Time Left</span>
          <span className={`text-3xl font-black ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>{timeLeft}s</span>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-10 flex flex-col items-center justify-center min-h-[300px]">
        <div className="p-12 rounded-[2rem] bg-slate-50 border-2 border-slate-100 mb-10 transition-transform duration-200">
           <CurrentShape className="w-32 h-32 text-blue-500 stroke-[3]" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full">
          <Button 
            className="h-24 text-xl font-black rounded-2xl bg-red-500 hover:bg-red-600"
            onClick={() => handleChoice(false)}
          >
            <X className="mr-2" /> NO
          </Button>
          <Button 
            className="h-24 text-xl font-black rounded-2xl bg-emerald-500 hover:bg-emerald-600"
            onClick={() => handleChoice(true)}
          >
            <Check className="mr-2" /> YES
          </Button>
        </div>
      </Card>
    </div>
  );
}
