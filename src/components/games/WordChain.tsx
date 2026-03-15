
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateHighScores, addPlayTime } from '@/lib/storage';
import { Link as LinkIcon, ArrowLeft, Brain, Sparkles } from "lucide-react";
import { playSound } from '@/lib/audio';
import { cn } from '@/lib/utils';

const WORD_POOL = [
  'APPLE', 'BRAIN', 'FOCUS', 'SMART', 'LIGHT', 'DREAM', 'THINK', 'SHARP',
  'PLANET', 'GUITAR', 'WINDOW', 'BOTTLE', 'FLOWER', 'COFFEE', 'SILVER',
  'DYNAMIC', 'MYSTERY', 'SCIENCE', 'FORWARD', 'NEURON', 'CRYSTAL',
  'WATER', 'FIRE', 'CLOUD', 'BIRD', 'FISH', 'TREE', 'BOOK', 'ROAD', 'SPACE',
  'MUSIC', 'DANCE', 'HEART', 'SMILE', 'NIGHT', 'STORM', 'WIND', 'OCEAN'
];

export default function WordChain({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'ended'>('idle');
  const [chain, setChain] = useState<string[]>([]);
  const [currentRecallIdx, setCurrentRecallIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showChainTimer, setShowChainTimer] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [selectionPool, setSelectionPool] = useState<string[]>([]);

  const startLevel = useCallback((currentChain: string[]) => {
    let nextWord;
    do {
      nextWord = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
    } while (currentChain.includes(nextWord));

    const newChain = [...currentChain, nextWord];
    setChain(newChain);
    setCurrentRecallIdx(0);
    setGameState('showing');
    setShowChainTimer(Math.max(2, newChain.length * 1.5));
  }, []);

  const startGame = () => {
    playSound('click');
    setScore(0);
    setStartTime(Date.now());
    startLevel([]);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'showing' && showChainTimer > 0) {
      interval = setInterval(() => {
        setShowChainTimer(prev => Math.max(0, prev - 0.1));
      }, 100);
    } else if (gameState === 'showing' && showChainTimer <= 0) {
      // Pool now only contains the words from the chain, shuffled.
      const pool = [...chain].sort(() => Math.random() - 0.5);
      setSelectionPool(pool);
      setGameState('playing');
    }
    return () => clearInterval(interval);
  }, [gameState, showChainTimer, chain]);

  const handleWordSelect = (word: string) => {
    if (gameState !== 'playing') return;

    const targetWord = chain[currentRecallIdx];
    if (word === targetWord) {
      playSound('success');
      const nextIdx = currentRecallIdx + 1;
      
      if (nextIdx === chain.length) {
        // Level complete
        setScore(prev => prev + chain.length * 100);
        setTimeout(() => startLevel(chain), 800);
      } else {
        // Next word in current chain
        setCurrentRecallIdx(nextIdx);
      }
    } else {
      playSound('error');
      setGameState('ended');
      updateHighScores('wordChain', score);
      addPlayTime(Math.floor((Date.now() - startTime) / 1000));
    }
  };

  if (gameState === 'idle') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-8">
          <Button variant="ghost" size="sm" className="w-fit mb-4 absolute left-4 top-4 hover:text-slate-900" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mx-auto bg-emerald-100 dark:bg-emerald-900/40 p-5 rounded-3xl w-20 h-20 flex items-center justify-center mb-6">
            <LinkIcon className="text-emerald-600 dark:text-emerald-400 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black text-slate-800 dark:text-slate-100">Word Sequence Chain</CardTitle>
          <CardDescription className="text-base font-medium px-4 text-slate-600 dark:text-slate-400">
            Memorize the sequence of words. Then, tap them in the exact order they appeared.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4 px-8">
          <Button size="lg" className="w-full font-black py-7 text-xl rounded-2xl bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-colors" onClick={startGame}>
            Start Memory Chain
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden text-center p-10">
        <Brain className="w-16 h-16 text-emerald-200 mx-auto mb-6" />
        <h2 className="text-3xl font-black mb-2 text-slate-800 dark:text-slate-100">Chain Broken!</h2>
        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-8">Score: {score}</p>
        <div className="space-y-4">
          <Button size="lg" className="w-full font-black rounded-2xl bg-emerald-600 text-white" onClick={startGame}>Try Again</Button>
          <Button variant="outline" size="lg" className="w-full font-black rounded-2xl hover:text-slate-900" onClick={onBack}>Dashboard</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Score</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Chain Length</span>
          <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{chain.length}</span>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 min-h-[450px] flex flex-col items-center justify-center text-center relative overflow-hidden">
        {gameState === 'showing' ? (
          <div className="animate-in fade-in zoom-in duration-300 w-full">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-10 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Memorize the Sequence
            </h3>
            <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
              {chain.map((word, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "px-8 py-4 rounded-2xl font-black text-2xl transition-all w-full text-center shadow-sm",
                    idx === chain.length - 1 
                      ? "bg-emerald-600 text-white scale-105 shadow-xl border-2 border-emerald-400 animate-in slide-in-from-bottom-2" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <span className="text-xs opacity-50 mr-3">#{idx + 1}</span>
                  {word}
                </div>
              ))}
            </div>
            <div className="mt-12 flex flex-col items-center">
              <div className="h-1.5 w-32 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-100 linear" 
                  style={{ width: `${(showChainTimer / (chain.length * 1.5)) * 100}%` }}
                />
              </div>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Recall starts in {Math.ceil(showChainTimer)}s</p>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-6">Reconstruct the Chain</h3>
            
            <div className="flex justify-center gap-2 mb-10">
              {chain.map((_, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "w-8 h-1.5 rounded-full transition-all duration-300",
                    idx < currentRecallIdx ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
                    idx === currentRecallIdx ? "bg-emerald-200 animate-pulse" : 
                    "bg-slate-100 dark:bg-slate-800"
                  )}
                />
              ))}
            </div>
            
            <p className="text-slate-500 font-black mb-8 uppercase tracking-tighter text-sm">
              Tap Word <span className="text-emerald-600 dark:text-emerald-400">#{currentRecallIdx + 1}</span>
            </p>
            
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {selectionPool.map((word, idx) => (
                <Button 
                  key={idx}
                  variant="outline"
                  onClick={() => handleWordSelect(word)}
                  className="h-16 text-lg font-black rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-slate-900 dark:hover:text-slate-100 hover:text-white transition-all active:scale-95"
                >
                  {word}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
