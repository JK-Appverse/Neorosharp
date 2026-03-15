
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateHighScores, addPlayTime } from '@/lib/storage';
import { Link as LinkIcon, ArrowLeft, Brain, CheckCircle2 } from "lucide-react";
import { playSound } from '@/lib/audio';

const WORD_POOL = [
  'APPLE', 'BRAIN', 'FOCUS', 'SMART', 'LIGHT', 'DREAM', 'THINK', 'SHARP',
  'PLANET', 'GUITAR', 'WINDOW', 'BOTTLE', 'FLOWER', 'COFFEE', 'SILVER',
  'DYNAMIC', 'MYSTERY', 'SCIENCE', 'FORWARD', 'NEURON', 'CRYSTAL',
  'WATER', 'FIRE', 'CLOUD', 'BIRD', 'FISH', 'TREE', 'BOOK', 'ROAD'
];

export default function WordChain({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'ended'>('idle');
  const [chain, setChain] = useState<string[]>([]);
  const [currentRecallIdx, setCurrentRecallIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [showChainTimer, setShowChainTimer] = useState(0);
  const [startTime, setStartTime] = useState(0);

  const startLevel = useCallback((currentChain: string[]) => {
    let nextWord;
    do {
      nextWord = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
    } while (currentChain.includes(nextWord));

    const newChain = [...currentChain, nextWord];
    setChain(newChain);
    setCurrentRecallIdx(0);
    setUserInput('');
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
        setShowChainTimer(prev => prev - 1);
      }, 1000);
    } else if (gameState === 'showing' && showChainTimer <= 0) {
      setGameState('playing');
    }
    return () => clearInterval(interval);
  }, [gameState, showChainTimer]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const targetWord = chain[currentRecallIdx];
    if (userInput.trim().toUpperCase() === targetWord) {
      playSound('success');
      const nextIdx = currentRecallIdx + 1;
      
      if (nextIdx === chain.length) {
        // Level complete
        setScore(prev => prev + chain.length * 100);
        setTimeout(() => startLevel(chain), 500);
      } else {
        // Next word in current chain
        setCurrentRecallIdx(nextIdx);
        setUserInput('');
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
          <Button variant="ghost" size="sm" className="w-fit mb-4 absolute left-4 top-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mx-auto bg-emerald-100 dark:bg-emerald-900/40 p-5 rounded-3xl w-20 h-20 flex items-center justify-center mb-6">
            <LinkIcon className="text-emerald-600 dark:text-emerald-400 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black text-slate-800 dark:text-slate-100">Word Chain</CardTitle>
          <CardDescription className="text-base font-medium px-4 text-slate-600 dark:text-slate-400">
            Memorize the growing list of words and repeat them back in the exact order.
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
          <Button variant="outline" size="lg" className="w-full font-black rounded-2xl" onClick={onBack}>Dashboard</Button>
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

      <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden">
        {gameState === 'showing' ? (
          <div className="animate-in fade-in zoom-in duration-300">
            <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-10">New Chain Sequence</h3>
            <div className="flex flex-wrap justify-center gap-4 max-w-md">
              {chain.map((word, idx) => (
                <div 
                  key={idx} 
                  className={`px-6 py-3 rounded-2xl font-black text-xl transition-all ${
                    idx === chain.length - 1 
                      ? "bg-emerald-600 text-white scale-110 shadow-xl" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {word}
                </div>
              ))}
            </div>
            <p className="mt-12 text-slate-400 font-bold text-xs uppercase tracking-widest">Memorizing... {Math.ceil(showChainTimer)}s</p>
          </div>
        ) : (
          <div className="w-full max-w-sm">
            <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-8">Recall Sequence</h3>
            <div className="flex justify-center gap-2 mb-10 flex-wrap">
              {chain.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-10 h-1 rounded-full transition-all ${
                    idx < currentRecallIdx ? "bg-emerald-500" : 
                    idx === currentRecallIdx ? "bg-emerald-200 animate-pulse" : 
                    "bg-slate-100 dark:bg-slate-800"
                  }`}
                />
              ))}
            </div>
            
            <p className="text-slate-500 font-bold mb-4 uppercase tracking-tighter text-sm">Word #{currentRecallIdx + 1} of {chain.length}</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input 
                autoFocus
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                placeholder="Next word..."
                className="text-center text-3xl h-16 font-black border-4 rounded-2xl border-emerald-50 focus:ring-emerald-500 uppercase"
              />
              <Button size="lg" className="w-full font-black py-8 text-xl rounded-2xl bg-emerald-600 text-white">Enter Word</Button>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
}
