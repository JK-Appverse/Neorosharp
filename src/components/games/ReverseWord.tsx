
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateHighScores } from '@/lib/storage';
import { RefreshCw, ArrowLeft, Brain } from "lucide-react";
import { playSound } from '@/lib/audio';

const WORDS = [
  'APPLE', 'BRAIN', 'FOCUS', 'SMART', 'LIGHT', 'DREAM', 'THINK', 'SHARP',
  'PLANET', 'GUITAR', 'WINDOW', 'BOTTLE', 'FLOWER', 'COFFEE', 'SILVER',
  'DYNAMIC', 'MYSTERY', 'SCIENCE', 'FORWARD', 'NEURON', 'CRYSTAL'
];

export default function ReverseWord({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'ended'>('idle');
  const [word, setWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(2);

  const startRound = useCallback(() => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(newWord);
    setUserInput('');
    setGameState('showing');
    setTimer(2);
  }, []);

  const startGame = () => {
    playSound('click');
    setScore(0);
    startRound();
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
    const reversed = word.split('').reverse().join('');
    if (userInput.toUpperCase() === reversed) {
      playSound('success');
      setScore(prev => prev + word.length * 10);
      updateHighScores('reverseWord', score + word.length * 10);
      startRound();
    } else {
      playSound('error');
      setGameState('ended');
    }
  };

  if (gameState === 'idle') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl">
        <CardHeader className="text-center pt-8">
          <Button variant="ghost" size="sm" className="w-fit mb-4 absolute left-4 top-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mx-auto bg-pink-100 p-5 rounded-3xl w-20 h-20 flex items-center justify-center mb-6">
            <RefreshCw className="text-pink-600 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black">Backward Words</CardTitle>
          <CardDescription className="text-base font-medium px-4">
            A word will flash for 2 seconds. You must type it backwards correctly.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4">
          <Button size="lg" className="w-full font-black py-7 text-xl rounded-2xl bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-200" onClick={startGame}>
            Start Challenge
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl">
        <CardHeader className="text-center pt-10">
          <CardTitle className="text-3xl font-black">Game Over</CardTitle>
          <CardDescription className="text-lg font-bold text-pink-600">Final Score: {score}</CardDescription>
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
          <span className="text-3xl font-black text-pink-600">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Status</span>
          <span className="text-lg font-bold text-slate-700">{gameState === 'showing' ? 'WATCH' : 'REVERSE IT'}</span>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-10 flex flex-col items-center justify-center min-h-[350px]">
        {gameState === 'showing' ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <p className="text-7xl font-black text-pink-600 tracking-tight">{word}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
            <div className="text-center">
              <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em] mb-2">Original Word was {word.length} letters</p>
              <Brain className="w-8 h-8 text-pink-200 mx-auto" />
            </div>
            <Input
              autoFocus
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type backward..."
              className="text-center text-4xl h-24 font-black border-4 rounded-3xl focus:ring-pink-500 border-pink-50 border-b-pink-200 uppercase"
            />
            <Button size="lg" className="w-full font-black py-8 text-xl rounded-2xl bg-pink-600">Submit Word</Button>
          </form>
        )}
      </Card>
    </div>
  );
}
