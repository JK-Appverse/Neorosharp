
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateHighScores, addPlayTime } from '@/lib/storage';
import { ArrowLeft, Brain, HelpCircle, Trophy, Clock } from "lucide-react";
import { playSound } from '@/lib/audio';

type Puzzle = {
  id: number;
  title: string;
  question: string | React.ReactNode;
  options: string[];
  answer: string;
  explanation: string;
};

const PUZZLES: Puzzle[] = [
  {
    id: 1,
    title: "False Connection",
    question: "Statement 1: All Lions are Cats.\nStatement 2: Some Cats are Blue.\nConclusion: Therefore, some Lions are Blue.",
    options: ["Logic is TRUE", "Logic is FALSE"],
    answer: "Logic is FALSE",
    explanation: "Standard Syllogism trap. Just because some cats are blue doesn't mean lions (who are cats) must be blue.",
  },
  {
    id: 2,
    title: "Sequence Breaker",
    question: "O, T, T, F, F, S, S, _?",
    options: ["S", "E", "N", "T"],
    answer: "E",
    explanation: "These are the first letters of numbers: One, Two, Three, Four, Five, Six, Seven. The next is Eight (E).",
  },
  {
    id: 3,
    title: "Weight Paradox",
    question: "If 3 Apples weigh the same as 2 Oranges, and 1 Banana is heavier than 1 Orange, which fruit is the heaviest?",
    options: ["Apple", "Orange", "Banana"],
    answer: "Banana",
    explanation: "3A = 2O implies 1O > 1A. Since B > O, then B > O > A. Banana is the heaviest.",
  },
  {
    id: 4,
    title: "Mirror Time",
    question: "A mirror shows an analog clock at 3:45. What is the real time?",
    options: ["3:45", "9:15", "8:15", "9:45"],
    answer: "8:15",
    explanation: "Real Time = 11:60 - Mirror Time. 11:60 - 3:45 = 8:15.",
  },
  {
    id: 5,
    title: "Letter Math",
    question: "A + A = B\nB + A = 6\nWhat is the value of B?",
    options: ["2", "4", "3", "6"],
    answer: "4",
    explanation: "A=2, B=4. 2+2=4 and 4+2=6.",
  },
  {
    id: 6,
    title: "Elevator Logic",
    question: "A man lives on the 10th floor. On rainy days he takes the lift to the 10th. On sunny days, he goes to the 7th and walks the rest. Why?",
    options: ["He likes exercise", "He is short", "The lift is broken", "He visits a friend"],
    answer: "He is short",
    explanation: "He can only reach the 10th button with his umbrella. On sunny days he lacks it and only reaches the 7th.",
  },
  {
    id: 7,
    title: "Silent Syllables",
    question: "How many silent letters are in the word 'PNEUMONIA'?",
    options: ["0", "1", "2", "3"],
    answer: "1",
    explanation: "The 'P' is silent.",
  },
  {
    id: 8,
    title: "Odd Shape Out",
    question: "Which of these does NOT belong?",
    options: ["Circle", "Sphere", "Triangle", "Square"],
    answer: "Sphere",
    explanation: "A Sphere is 3D; the others are 2D shapes.",
  },
  {
    id: 9,
    title: "The Color Path",
    question: "Instruction: Pick the word where Word and Color match.",
    options: ["RED (in Blue)", "GREEN (in Green)", "YELLOW (in Red)", "BLUE (in Yellow)"],
    answer: "GREEN (in Green)",
    explanation: "This tests inhibition. Only Green matches both word and color.",
  },
  {
    id: 10,
    title: "Logic Trap 2",
    question: "A plane crashes on the border of US and Canada. Where do you bury the survivors?",
    options: ["USA", "Canada", "Neutral Ground", "You don't"],
    answer: "You don't",
    explanation: "You don't bury survivors!",
  }
];

export default function LogicTraps({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
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
    setScore(0);
    setGameState('playing');
    setStartTime(Date.now());
    startPuzzle(0);
  };

  const handleChoice = (choice: string) => {
    const isCorrect = choice === PUZZLES[currentIdx].answer;
    setLastCorrect(isCorrect);
    setShowExplanation(true);
    
    if (isCorrect) {
      playSound('success');
      // Award a flat score for correct logic puzzles in unlimited mode
      setScore(prev => prev + 500);
    } else {
      playSound('error');
    }
  };

  const nextPuzzle = () => {
    playSound('click');
    if (currentIdx + 1 < PUZZLES.length) {
      startPuzzle(currentIdx + 1);
    } else {
      setGameState('ended');
      updateHighScores('logicTraps', score);
      addPlayTime(Math.floor((Date.now() - startTime) / 1000));
    }
  };

  if (gameState === 'idle') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-8">
          <Button variant="ghost" size="sm" className="w-fit mb-4 absolute left-4 top-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mx-auto bg-indigo-100 p-5 rounded-3xl w-20 h-20 flex items-center justify-center mb-6">
            <Brain className="text-indigo-600 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black">Logic Traps</CardTitle>
          <CardDescription className="text-base font-medium px-4">
            10 tricky puzzles designed to trap your mind. Take your time, focus is key!
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4 px-8">
          <Button size="lg" className="w-full font-black py-7 text-xl rounded-2xl bg-indigo-600 text-white shadow-lg" onClick={startGame}>
            Enter the Trap
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden text-center p-10">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
        <h2 className="text-3xl font-black mb-2">Traps Escaped!</h2>
        <p className="text-xl font-bold text-indigo-600 mb-8">Score: {score}</p>
        <div className="space-y-4">
          <Button size="lg" className="w-full font-black rounded-2xl bg-indigo-600 text-white" onClick={startGame}>Re-Run Traps</Button>
          <Button variant="outline" size="lg" className="w-full font-black rounded-2xl" onClick={onBack}>Dashboard</Button>
        </div>
      </Card>
    );
  }

  const current = PUZZLES[currentIdx];

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Puzzle</span>
          <span className="text-3xl font-black text-indigo-600">{currentIdx + 1}/10</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Status</span>
          <span className="text-lg font-black text-slate-800">UNLIMITED TIME</span>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
        {!showExplanation ? (
          <>
            <h3 className="text-xl font-black text-indigo-400 uppercase tracking-widest mb-6">{current.title}</h3>
            <p className="text-2xl font-bold text-slate-800 mb-10 whitespace-pre-line leading-relaxed px-4">
              {current.question}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
              {current.options.map((opt, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  className="h-16 rounded-2xl text-lg font-bold border-2 hover:bg-indigo-600 hover:text-white transition-all hover:border-indigo-600"
                  onClick={() => handleChoice(opt)}
                >
                  {opt}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className={`p-4 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-6 ${lastCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              {lastCorrect ? <Trophy className="w-8 h-8" /> : <HelpCircle className="w-8 h-8" />}
            </div>
            <h3 className={`text-2xl font-black mb-4 ${lastCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
              {lastCorrect ? 'Brilliant!' : 'Trapped!'}
            </h3>
            <p className="text-lg font-medium text-slate-600 mb-8 max-w-md">
              {current.explanation}
            </p>
            <Button size="lg" className="px-10 py-7 rounded-2xl text-xl font-black bg-indigo-600 text-white" onClick={nextPuzzle}>
              Next Challenge
            </Button>
          </div>
        )}
      </Card>
      
      <div className="bg-indigo-50 p-4 rounded-2xl flex items-center gap-3">
        <Brain className="w-5 h-5 text-indigo-400" />
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Score: {score}</p>
      </div>
    </div>
  );
}
