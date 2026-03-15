
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateHighScores } from '@/lib/storage';
import { Hash, ArrowLeft, Trophy } from "lucide-react";
import { playSound } from '@/lib/audio';

export default function DigitSpan({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'ended'>('idle');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState('');
  const [level, setLevel] = useState(3);
  const [timer, setTimer] = useState(0);

  const startLevel = useCallback((l: number) => {
    const newSeq = Array.from({ length: l }, () => Math.floor(Math.random() * 10));
    setSequence(newSeq);
    setUserInput('');
    setGameState('showing');
    setTimer(l + 1);
  }, []);

  const startGame = () => {
    playSound('click');
    setLevel(3);
    startLevel(3);
  };

  useEffect(() => {
    if (gameState === 'showing' && timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (gameState === 'showing' && timer === 0) {
      setGameState('playing');
    }
  }, [gameState, timer]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const isCorrect = userInput === sequence.join('');
    if (isCorrect) {
      playSound('success');
      const nextLevel = level + 1;
      setLevel(nextLevel);
      updateHighScores('digitSpan', level);
      startLevel(nextLevel);
    } else {
      playSound('error');
      setGameState('ended');
    }
  };

  if (gameState === 'idle') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-8">
          <Button variant="ghost" size="sm" className="w-fit mb-4 absolute left-4 top-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mx-auto bg-purple-100 p-5 rounded-3xl w-20 h-20 flex items-center justify-center mb-6">
            <Hash className="text-purple-600 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black text-slate-800">Digit Span</CardTitle>
          <CardDescription className="text-base font-medium px-4">
            Memorize the sequence of numbers and type them back correctly. The sequence grows longer with each win.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4">
          <Button size="lg" className="w-full font-black py-7 text-xl rounded-2xl bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200" onClick={startGame}>
            Start Memorizing
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-10">
          <div className="mx-auto bg-slate-100 p-5 rounded-full w-20 h-20 flex items-center justify-center mb-6">
            <Trophy className="text-slate-400 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black text-slate-800">Sequence Broken</CardTitle>
          <CardDescription className="text-lg font-bold text-purple-600">
            Max Digits: {level - 1}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pb-10">
          <Button size="lg" className="w-full font-black py-6 rounded-2xl" onClick={startGame}>Try Again</Button>
          <Button variant="outline" size="lg" className="w-full font-black py-6 rounded-2xl" onClick={onBack}>Main Menu</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-xl border-slate-100 border">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Target Digits</span>
          <span className="text-3xl font-black text-purple-600">{level}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Mode</span>
          <span className="text-lg font-bold text-slate-700">{gameState === 'showing' ? 'MEMORIZE' : 'RECALL'}</span>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-10 flex flex-col items-center justify-center min-h-[300px]">
        {gameState === 'showing' ? (
          <div className="text-center animate-in zoom-in duration-300">
            <p className="text-7xl font-black text-purple-600 tracking-tighter mb-4">{sequence.join(' ')}</p>
            <p className="text-slate-400 font-black uppercase text-sm tracking-widest">Disappearing in {timer}s</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
            <p className="text-center text-slate-500 font-medium text-lg">What was the sequence?</p>
            <Input
              autoFocus
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="text-center text-4xl h-24 font-black border-4 rounded-3xl focus:ring-purple-500 border-purple-100"
            />
            <Button size="lg" className="w-full font-black py-8 text-xl rounded-2xl bg-purple-600">Confirm Recall</Button>
          </form>
        )}
      </Card>
    </div>
  );
}
