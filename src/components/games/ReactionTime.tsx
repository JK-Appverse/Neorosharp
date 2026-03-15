
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateHighScores } from '@/lib/storage';
import { Timer, ArrowLeft, Zap, Target, X } from "lucide-react";
import { playSound } from '@/lib/audio';

export default function ReactionTime({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'result' | 'early'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startWaiting = () => {
    playSound('click');
    setGameState('waiting');
    setReactionTime(null);
    const delay = Math.floor(Math.random() * 3000) + 2000;
    timeoutRef.current = setTimeout(() => {
      setGameState('ready');
      startTimeRef.current = performance.now();
    }, delay);
  };

  const handleTap = () => {
    if (gameState === 'waiting') {
      playSound('error');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('early');
    } else if (gameState === 'ready') {
      playSound('success');
      const endTime = performance.now();
      const diff = Math.round(endTime - startTimeRef.current);
      setReactionTime(diff);
      setGameState('result');
      updateHighScores('reactionTime', diff);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (gameState === 'idle') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-8">
          <Button variant="ghost" size="sm" className="w-fit mb-4 absolute left-4 top-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mx-auto bg-orange-100 p-5 rounded-3xl w-20 h-20 flex items-center justify-center mb-6">
            <Timer className="text-orange-600 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black">Reflex Test</CardTitle>
          <CardDescription className="text-base font-medium px-4">
            Tap the screen as soon as it turns GREEN. Let's measure your neural response time!
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4">
          <Button size="lg" className="w-full font-black py-7 text-xl rounded-2xl bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200" onClick={startWaiting}>
            Measure Reflexes
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div 
      onClick={handleTap}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-200 cursor-pointer ${
        gameState === 'waiting' ? 'bg-red-500' : 
        gameState === 'ready' ? 'bg-emerald-500' : 
        'bg-slate-900'
      }`}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-[100] text-white/50 hover:text-white hover:bg-white/10"
        onClick={(e) => { e.stopPropagation(); onBack(); }}
      >
        <ArrowLeft className="w-6 h-6" />
      </Button>

      <div className="text-white text-center p-8">
        {gameState === 'waiting' && (
          <div className="animate-pulse">
            <h2 className="text-4xl font-black uppercase tracking-widest mb-4">Wait for it...</h2>
            <p className="text-white/60 font-medium">Wait for Green</p>
          </div>
        )}
        {gameState === 'ready' && (
          <div className="animate-in zoom-in duration-75">
            <h2 className="text-7xl font-black uppercase tracking-tighter mb-4">TAP NOW!</h2>
          </div>
        )}
        {gameState === 'early' && (
          <div className="bg-white/10 backdrop-blur-md p-10 rounded-[3rem] border border-white/20">
            <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-4xl font-black mb-4">Too Early!</h2>
            <p className="mb-8 font-medium">Wait for the screen to turn green.</p>
            <Button size="lg" variant="secondary" className="font-black px-10 py-7 rounded-2xl text-xl" onClick={(e) => { e.stopPropagation(); startWaiting(); }}>Try Again</Button>
          </div>
        )}
        {gameState === 'result' && (
          <div className="bg-white/10 backdrop-blur-md p-10 rounded-[3rem] border border-white/20 animate-in fade-in slide-in-from-bottom-8">
            <Target className="w-16 h-16 text-white mx-auto mb-6" />
            <p className="text-xl font-bold text-white/70 mb-2 uppercase tracking-widest">Reaction Time</p>
            <h2 className="text-8xl font-black mb-10">{reactionTime} <span className="text-3xl text-white/50">ms</span></h2>
            <div className="flex flex-col gap-4">
              <Button size="lg" variant="secondary" className="font-black px-10 py-7 rounded-2xl text-xl w-full" onClick={(e) => { e.stopPropagation(); startWaiting(); }}>Beat Record</Button>
              <Button size="lg" variant="ghost" className="text-white font-bold w-full" onClick={(e) => { e.stopPropagation(); onBack(); }}>Back to Dashboard</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
