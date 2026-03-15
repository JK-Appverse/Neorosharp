
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateHighScores } from '@/lib/storage';
import { Timer, Zap, ArrowLeft } from "lucide-react";
import { playSound } from '@/lib/audio';

export default function MathRush({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [problem, setProblem] = useState({ q: '', a: 0 });
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [totalTime, setTotalTime] = useState(30);

  const generateProblem = useCallback(() => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b;

    if (op === '*') {
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
    } else {
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 50) + 1;
    }

    const answer = op === '+' ? a + b : op === '-' ? a - b : a * b;
    setProblem({ q: `${a} ${op === '*' ? '×' : op} ${b}`, a: answer });
    setTimeLeft(3);
  }, []);

  const startGame = () => {
    playSound('click');
    setGameState('playing');
    setScore(0);
    setTotalTime(30);
    setUserInput('');
    generateProblem();
  };

  useEffect(() => {
    if (gameState === 'playing') {
      if (totalTime <= 0 || timeLeft <= 0) {
        playSound('error');
        setGameState('ended');
        updateHighScores('math', score);
        return;
      }
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 0.1);
        setTotalTime(prev => prev - 0.1);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft, totalTime, score]);

  const checkAnswer = (val: string) => {
    if (parseInt(val) === problem.a) {
      playSound('success');
      setScore(prev => prev + 10);
      setUserInput('');
      generateProblem();
    }
  };

  if (gameState === 'idle') {
    return (
      <Card className="w-full max-w-lg mx-auto border-none shadow-xl bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Button variant="ghost" size="sm" className="w-fit mb-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Zap className="text-primary w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-bold">Math Rush</CardTitle>
          <CardDescription className="text-lg">Boost your calculation speed. You have 3 seconds per problem.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full font-bold py-6 text-xl" onClick={startGame}>Start Rush</Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full max-w-lg mx-auto border-none shadow-xl bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Game Over</CardTitle>
          <CardDescription className="text-lg">Final Score: {score}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button size="lg" className="w-full" onClick={startGame}>Play Again</Button>
          <Button variant="outline" size="lg" className="w-full" onClick={onBack}>Main Menu</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Score</span>
          <span className="text-2xl font-bold text-primary">{score}</span>
        </div>
        <div className="flex flex-col items-center">
           <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Rush Time</span>
           <div className="h-1.5 w-32 bg-muted rounded-full overflow-hidden mt-1">
             <div className="h-full bg-accent transition-all duration-100" style={{ width: `${(timeLeft / 3) * 100}%` }}></div>
           </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Session</span>
          <span className="text-2xl font-bold text-foreground">{Math.ceil(totalTime)}s</span>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-white h-64 flex flex-col items-center justify-center gap-6">
        <p className="text-5xl font-black text-foreground">{problem.q}</p>
        <div className="w-full max-w-[200px]">
          <Input
            autoFocus
            type="number"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
              checkAnswer(e.target.value);
            }}
            placeholder="?"
            className="text-center text-3xl h-16 border-2 focus:ring-accent"
          />
        </div>
      </Card>
      <p className="text-center text-sm text-muted-foreground font-medium italic">Type the answer as fast as you can!</p>
    </div>
  );
}
