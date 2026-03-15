
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateHighScores } from '@/lib/storage';
import { ArrowLeft, RefreshCw, Type } from "lucide-react";
import { playSound } from '@/lib/audio';

const DICTIONARY = ['NEURON', 'SYNAPSE', 'MEMORY', 'BRAIN', 'LOGIC', 'FOCUS', 'SMART', 'GENIUS', 'PUZZLE', 'SHARP'];

export default function WordScramble({ onBack, isDaily }: { onBack: () => void, isDaily?: boolean }) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [originalWord, setOriginalWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);

  const startRound = useCallback(() => {
    const word = DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)];
    setOriginalWord(word);
    const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
    setScrambledWord(scrambled);
    setUserInput('');
  }, []);

  const startGame = () => {
    playSound('click');
    setScore(0);
    setTimeLeft(45);
    setGameState('playing');
    startRound();
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (gameState === 'playing' && timeLeft <= 0) {
      playSound('error');
      setGameState('ended');
      updateHighScores('wordScramble', score, isDaily);
    }
  }, [gameState, timeLeft, score, isDaily]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (userInput.toUpperCase() === originalWord) {
      playSound('success');
      setScore(prev => prev + 50);
      startRound();
    } else {
      playSound('error');
      setUserInput('');
    }
  };

  if (gameState === 'idle') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-8">
          <Button variant="ghost" size="sm" className="w-fit mb-4 absolute left-4 top-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mx-auto bg-pink-100 p-5 rounded-3xl w-20 h-20 flex items-center justify-center mb-6">
            <Type className="text-pink-600 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black">Unscramble Words</CardTitle>
          <CardDescription className="text-base font-medium px-4">
            Unscramble the letters to find the hidden brain-themed word!
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4 px-8">
          <Button size="lg" className="w-full font-black py-7 text-xl rounded-2xl bg-pink-600 shadow-lg" onClick={startGame}>
            Start Unscrambling
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden text-center p-10">
        <h2 className="text-3xl font-black mb-2">Round Over</h2>
        <p className="text-xl font-bold text-pink-600 mb-8">Score: {score}</p>
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
          <span className="text-3xl font-black text-pink-600">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Time Left</span>
          <span className={`text-3xl font-black ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>{timeLeft}s</span>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-10 flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-center mb-10">
           <p className="text-5xl font-black text-pink-600 tracking-widest uppercase mb-4">{scrambledWord}</p>
           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">What is this word?</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <Input 
            autoFocus
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.toUpperCase())}
            className="text-center text-3xl h-16 font-black border-4 rounded-2xl focus:ring-pink-500"
            placeholder="TYPE HERE"
          />
          <Button size="lg" className="w-full font-black h-16 text-xl rounded-2xl bg-pink-600">SUBMIT</Button>
        </form>
      </Card>
    </div>
  );
}
