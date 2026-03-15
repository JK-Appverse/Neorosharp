
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateHighScores, addPlayTime } from '@/lib/storage';
import { MousePointer2, ArrowLeft, Target } from "lucide-react";
import { playSound } from '@/lib/audio';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const VOWELS = "AEIOU";

export default function VowelHunter({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [items, setItems] = useState<{ id: number, char: string, x: number }[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const itemCounter = useRef(0);
  const [startTime, setStartTime] = useState(0);

  const startGame = () => {
    playSound('click');
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
    setItems([]);
    setStartTime(Date.now());
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const spawnInterval = setInterval(() => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        setItems(prev => [...prev, { id: itemCounter.current++, char, x: Math.random() * 80 + 10 }]);
      }, 600);

      const timerInterval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('ended');
            updateHighScores('vowelHunter', score);
            addPlayTime(30);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(spawnInterval);
        clearInterval(timerInterval);
      };
    }
  }, [gameState, score]);

  const handleTap = (id: number, char: string) => {
    if (VOWELS.includes(char)) {
      playSound('success');
      setScore(prev => prev + 10);
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      playSound('error');
      setScore(prev => Math.max(0, prev - 5));
      setItems(prev => prev.filter(i => i.id !== id));
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
            <MousePointer2 className="text-amber-600 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black">Catch the Vowels</CardTitle>
          <CardDescription className="text-base font-medium px-4">
            Characters will fall from the top. Tap ONLY the vowels (A, E, I, O, U) before they disappear!
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4 px-8">
          <Button size="lg" className="w-full font-black py-7 text-xl rounded-2xl bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-200" onClick={startGame}>
            Start Hunting
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden text-center p-10">
        <Target className="w-16 h-16 text-amber-200 mx-auto mb-6" />
        <h2 className="text-3xl font-black mb-2">Hunt Over</h2>
        <p className="text-xl font-bold text-amber-600 mb-8">Final Score: {score}</p>
        <div className="space-y-4">
          <Button size="lg" className="w-full font-black rounded-2xl" onClick={startGame}>Try Again</Button>
          <Button variant="outline" size="lg" className="w-full font-black rounded-2xl" onClick={onBack}>Menu</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full h-[600px] flex flex-col space-y-4">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Score</span>
          <span className="text-3xl font-black text-amber-600">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Time Left</span>
          <span className={`text-3xl font-black ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>{timeLeft}s</span>
        </div>
      </div>

      <div className="relative flex-1 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-50">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTap(item.id, item.char)}
            className="absolute animate-vowel-fall text-4xl font-black w-16 h-16 flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-slate-100 hover:bg-slate-900 hover:text-white transition-colors"
            style={{ left: `${item.x}%`, top: '-50px' }}
          >
            {item.char}
          </button>
        ))}
      </div>
    </div>
  );
}
