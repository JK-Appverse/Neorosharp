
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateHighScores, addPlayTime } from '@/lib/storage';
import { ArrowLeft, Brain, HelpCircle, Trophy } from "lucide-react";
import { playSound } from '@/lib/audio';
import { ALL_PUZZLES, Puzzle } from '@/lib/logic-puzzles';

export default function LogicTraps({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const startPuzzle = useCallback((idx: number) => {
    setCurrentIdx(idx);
    setShowExplanation(false);
  }, []);

  const startGame = () => {
    playSound('click');
    
    // Shuffle and pick 10 random puzzles
    const shuffled = [...ALL_PUZZLES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);
    
    setPuzzles(selected);
    setScore(0);
    setGameState('playing');
    setStartTime(Date.now());
    setCurrentIdx(0);
    setShowExplanation(false);
  };

  const handleChoice = (choice: string) => {
    const isCorrect = choice === puzzles[currentIdx].answer;
    setLastCorrect(isCorrect);
    setShowExplanation(true);
    
    if (isCorrect) {
      playSound('success');
      setScore(prev => prev + 500);
    } else {
      playSound('error');
    }
  };

  const nextPuzzle = () => {
    playSound('click');
    if (currentIdx + 1 < puzzles.length) {
      startPuzzle(currentIdx + 1);
    } else {
      setGameState('ended');
      updateHighScores('logicTraps', score);
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
          <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/40 p-5 rounded-3xl w-20 h-20 flex items-center justify-center mb-6">
            <Brain className="text-indigo-600 dark:text-indigo-400 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black text-slate-800 dark:text-slate-100">Tricky Riddles</CardTitle>
          <CardDescription className="text-base font-medium px-4 text-slate-600 dark:text-slate-400">
            Tricky puzzles designed to test your reasoning. Focus is key!
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4 px-8">
          <Button size="lg" className="w-full font-black py-7 text-xl rounded-2xl bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors" onClick={startGame}>
            Enter the Trap
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden text-center p-10">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
        <h2 className="text-3xl font-black mb-2 text-slate-800 dark:text-slate-100">Traps Escaped!</h2>
        <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">Score: {score}</p>
        <div className="space-y-4">
          <Button size="lg" className="w-full font-black rounded-2xl bg-indigo-600 text-white" onClick={startGame}>Re-Run Traps</Button>
          <Button variant="outline" size="lg" className="w-full font-black rounded-2xl hover:text-slate-900" onClick={onBack}>Dashboard</Button>
        </div>
      </Card>
    );
  }

  const current = puzzles[currentIdx];
  if (!current) return null;

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Puzzle</span>
          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{currentIdx + 1}/{puzzles.length}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Status</span>
          <span className="text-lg font-black text-slate-800 dark:text-slate-100">NO TIME LIMIT</span>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
        {!showExplanation ? (
          <>
            <h3 className="text-xl font-black text-indigo-400 uppercase tracking-widest mb-6">{current.title}</h3>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-10 whitespace-pre-line leading-relaxed px-4">
              {current.question}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
              {current.options.map((opt, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  className="h-16 rounded-2xl text-lg font-bold border-2 border-slate-100 dark:border-slate-800 hover:bg-slate-100 hover:text-slate-900 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-all hover:border-indigo-600 group"
                  onClick={() => handleChoice(opt)}
                >
                  <span className="group-hover:text-slate-900 dark:group-hover:text-slate-100">{opt}</span>
                </Button>
              ))}
            </div>
          </>
        ) : (
          <div className="animate-in fade-in zoom-in duration-300 w-full">
            <div className={`p-4 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-6 ${lastCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              {lastCorrect ? <Trophy className="w-8 h-8" /> : <HelpCircle className="w-8 h-8" />}
            </div>
            <h3 className={`text-2xl font-black mb-4 ${lastCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
              {lastCorrect ? 'Brilliant!' : 'Trapped!'}
            </h3>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
              {current.explanation}
            </p>
            <Button size="lg" className="px-10 py-7 rounded-2xl text-xl font-black bg-indigo-600 text-white" onClick={nextPuzzle}>
              Next Challenge
            </Button>
          </div>
        )}
      </Card>
      
      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl flex items-center gap-3">
        <Brain className="w-5 h-5 text-indigo-400" />
        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Score: {score}</p>
      </div>
    </div>
  );
}
