
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Trophy, User } from "lucide-react";
import { playSound } from '@/lib/audio';

type GameState = 'idle' | 'waiting' | 'ready' | 'result';

export default function VersusMode({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [reactionTimes, setReactionTimes] = useState<{ p1: number | null, p2: number | null }>({ p1: null, p2: null });
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const startWaiting = () => {
    playSound('click');
    setGameState('waiting');
    setWinner(null);
    setReactionTimes({ p1: null, p2: null });
    
    const delay = Math.floor(Math.random() * 3000) + 2000;
    timeoutRef.current = setTimeout(() => {
      setGameState('ready');
    }, delay);
  };

  const handleTap = (player: 1 | 2) => {
    if (gameState === 'ready' && !winner) {
      playSound('success');
      setWinner(player);
      setGameState('result');
    } else if (gameState === 'waiting') {
      playSound('error');
      // Foul!
      setWinner(player === 1 ? 2 : 1);
      setGameState('result');
    }
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  if (gameState === 'idle') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-8">
          <Button variant="ghost" size="sm" className="w-fit mb-4 absolute left-4 top-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mx-auto bg-slate-100 p-5 rounded-3xl w-20 h-20 flex items-center justify-center mb-6">
            <User className="text-slate-600 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black">Versus Mode</CardTitle>
          <CardDescription className="text-base font-medium px-4">
            Place the phone between you and a friend. Tap your side when the screen turns GREEN!
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4 px-8">
          <Button size="lg" className="w-full font-black py-7 text-xl rounded-2xl bg-slate-900 text-white shadow-lg" onClick={startWaiting}>
            Start Battle
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Player 2 Side (Top - Rotated) */}
      <div 
        onClick={() => handleTap(2)}
        className={`flex-1 flex flex-col items-center justify-center rotate-180 transition-colors duration-200 cursor-pointer ${
          gameState === 'ready' ? 'bg-emerald-500' : gameState === 'waiting' ? 'bg-red-500' : 'bg-slate-900'
        }`}
      >
        <div className="text-white text-center p-8">
          <User className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase tracking-widest">Player 2</h2>
          {gameState === 'result' && winner === 2 && <Trophy className="w-12 h-12 text-yellow-400 mx-auto mt-4" />}
          {gameState === 'result' && winner === 1 && <span className="text-sm font-bold opacity-50 uppercase">Defeated</span>}
        </div>
      </div>

      {/* Middle Bar */}
      <div className="h-24 bg-white flex items-center justify-center relative border-y-8 border-slate-900">
        {gameState === 'result' ? (
          <Button onClick={startWaiting} className="bg-slate-900 text-white font-black px-10 py-4 rounded-full text-lg">REMATCH</Button>
        ) : (
          <span className="text-slate-900 font-black tracking-tighter text-2xl uppercase">Versus</span>
        )}
        <Button variant="ghost" onClick={onBack} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><X /></Button>
      </div>

      {/* Player 1 Side (Bottom) */}
      <div 
        onClick={() => handleTap(1)}
        className={`flex-1 flex flex-col items-center justify-center transition-colors duration-200 cursor-pointer ${
          gameState === 'ready' ? 'bg-emerald-500' : gameState === 'waiting' ? 'bg-red-500' : 'bg-slate-900'
        }`}
      >
        <div className="text-white text-center p-8">
          <User className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase tracking-widest">Player 1</h2>
          {gameState === 'result' && winner === 1 && <Trophy className="w-12 h-12 text-yellow-400 mx-auto mt-4" />}
          {gameState === 'result' && winner === 2 && <span className="text-sm font-bold opacity-50 uppercase">Defeated</span>}
        </div>
      </div>
    </div>
  );
}

function X(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );
}
