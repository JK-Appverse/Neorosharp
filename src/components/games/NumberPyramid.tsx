
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateHighScores, addPlayTime } from '@/lib/storage';
import { Triangle, ArrowLeft, Brain } from "lucide-react";
import { playSound } from '@/lib/audio';

export default function NumberPyramid({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [pyramid, setPyramid] = useState<number[][]>([]);
  const [targetCell, setTargetCell] = useState<{ r: number, c: number, value: number } | null>(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [startTime, setStartTime] = useState(0);

  const generatePyramid = useCallback((l: number) => {
    const rows = 3;
    const base = Array.from({ length: rows }, () => Math.floor(Math.random() * (5 + l)) + 1);
    const fullPyramid: number[][] = [base];
    
    for (let r = 1; r < rows; r++) {
      const currentRow = [];
      const prevRow = fullPyramid[r - 1];
      for (let c = 0; c < prevRow.length - 1; c++) {
        currentRow.push(prevRow[c] + prevRow[c + 1]);
      }
      fullPyramid.push(currentRow);
    }

    const displayPyramid = [...fullPyramid].reverse();
    const flatIdx = Math.floor(Math.random() * 6); // 3+2+1 cells
    let count = 0;
    let target = null;

    for (let r = 0; r < displayPyramid.length; r++) {
      for (let c = 0; c < displayPyramid[r].length; c++) {
        if (count === flatIdx) {
          target = { r, c, value: displayPyramid[r][c] };
        }
        count++;
      }
    }

    setPyramid(displayPyramid);
    setTargetCell(target);
    setUserInput('');
  }, []);

  const startGame = () => {
    playSound('click');
    setScore(0);
    setLevel(1);
    setGameState('playing');
    setStartTime(Date.now());
    generatePyramid(1);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (parseInt(userInput) === targetCell?.value) {
      playSound('success');
      setScore(prev => prev + level * 20);
      setLevel(prev => prev + 1);
      generatePyramid(level + 1);
    } else {
      playSound('error');
      setGameState('ended');
      updateHighScores('numberPyramid', score);
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
            <Triangle className="text-indigo-600 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black">Number Pyramid</CardTitle>
          <CardDescription className="text-base font-medium px-4">
            Each number is the sum of the two numbers directly below it. Find the missing value!
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4 px-8">
          <Button size="lg" className="w-full font-black py-7 text-xl rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200" onClick={startGame}>
            Start Solving
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white rounded-3xl overflow-hidden text-center p-10">
        <Triangle className="w-16 h-16 text-indigo-200 mx-auto mb-6" />
        <h2 className="text-3xl font-black mb-2">Pyramid Collapsed</h2>
        <p className="text-xl font-bold text-indigo-600 mb-8">Score: {score}</p>
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
          <span className="text-3xl font-black text-indigo-600">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Level</span>
          <span className="text-3xl font-black text-slate-800">{level}</span>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 mb-10">
          {pyramid.map((row, r) => (
            <div key={r} className="flex gap-4">
              {row.map((val, c) => (
                <div 
                  key={c} 
                  className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl text-2xl font-black border-4 transition-all ${
                    targetCell?.r === r && targetCell?.c === c 
                      ? "bg-indigo-50 border-indigo-200 text-indigo-600 animate-pulse" 
                      : "bg-slate-50 border-slate-100 text-slate-800"
                  }`}
                >
                  {targetCell?.r === r && targetCell?.c === c ? "?" : val}
                </div>
              ))}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
          <Input
            autoFocus
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Missing number..."
            className="text-center text-3xl h-16 font-black border-4 rounded-2xl focus:ring-indigo-500"
          />
          <Button size="lg" className="w-full font-black h-16 text-xl rounded-2xl bg-indigo-600">Check Answer</Button>
        </form>
      </Card>
    </div>
  );
}
