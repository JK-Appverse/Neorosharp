
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateHighScores, addPlayTime } from '@/lib/storage';
import { Image as ImageIcon, ArrowLeft, RefreshCw, Trophy, Clock, MoveHorizontal } from "lucide-react";
import { playSound } from '@/lib/audio';

const GRID_SIZE = 3;
const PUZZLE_IMAGE = "https://picsum.photos/seed/neuropuzzle/600/600";

export default function ImagePuzzle({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState(0);

  const initPuzzle = useCallback(() => {
    // Correct order is 0, 1, 2, 3, 4, 5, 6, 7, 8 (where 8 is empty)
    const initialTiles = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);
    
    // Scramble tiles
    let scrambled = [...initialTiles];
    for (let i = 0; i < 200; i++) {
      const emptyIdx = scrambled.indexOf(8);
      const possibleMoves: number[] = [];
      const row = Math.floor(emptyIdx / GRID_SIZE);
      const col = emptyIdx % GRID_SIZE;

      if (row > 0) possibleMoves.push(emptyIdx - GRID_SIZE); // Top
      if (row < GRID_SIZE - 1) possibleMoves.push(emptyIdx + GRID_SIZE); // Bottom
      if (col > 0) possibleMoves.push(emptyIdx - 1); // Left
      if (col < GRID_SIZE - 1) possibleMoves.push(emptyIdx + 1); // Right

      const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      [scrambled[emptyIdx], scrambled[move]] = [scrambled[move], scrambled[emptyIdx]];
    }

    setTiles(scrambled);
    setMoves(0);
    setTimer(0);
  }, []);

  const startGame = () => {
    playSound('click');
    initPuzzle();
    setGameState('playing');
    setStartTime(Date.now());
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const handleTileClick = (index: number) => {
    if (gameState !== 'playing') return;

    const emptyIdx = tiles.indexOf(8);
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const emptyRow = Math.floor(emptyIdx / GRID_SIZE);
    const emptyCol = emptyIdx % GRID_SIZE;

    const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
                      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      playSound('click');
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[index]];
      setTiles(newTiles);
      setMoves(prev => prev + 1);

      // Check win
      const isWin = newTiles.every((t, i) => t === i);
      if (isWin) {
        playSound('success');
        setGameState('ended');
        updateHighScores('imagePuzzle', timer);
        addPlayTime(timer);
      }
    } else {
      playSound('error');
    }
  };

  if (gameState === 'idle') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-8">
          <Button variant="ghost" size="sm" className="w-fit mb-4 absolute left-4 top-4" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="mx-auto bg-cyan-100 dark:bg-cyan-900/40 p-5 rounded-3xl w-20 h-20 flex items-center justify-center mb-6">
            <ImageIcon className="text-cyan-600 dark:text-cyan-400 w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-black text-slate-800 dark:text-slate-100">Image Puzzle</CardTitle>
          <CardDescription className="text-base font-medium px-4">
            Slide the pieces to reassemble the scrambled image. Challenge your spatial memory!
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-10 pt-4 px-8">
          <div className="relative aspect-square w-full max-w-[200px] mx-auto mb-8 rounded-2xl overflow-hidden border-4 border-slate-100 dark:border-slate-800">
             <img src={PUZZLE_IMAGE} alt="Target" className="object-cover w-full h-full opacity-50" />
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white/80 dark:bg-slate-900/80 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">Target View</span>
             </div>
          </div>
          <Button size="lg" className="w-full font-black py-7 text-xl rounded-2xl bg-cyan-600 text-white shadow-lg hover:bg-cyan-700 transition-colors" onClick={startGame}>
            Start Reassembling
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'ended') {
    return (
      <Card className="w-full border-none shadow-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden text-center p-10">
        <div className="relative aspect-square w-48 mx-auto mb-6 rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-500">
            <img src={PUZZLE_IMAGE} alt="Solved" className="object-cover w-full h-full" />
        </div>
        <h2 className="text-3xl font-black mb-2 text-slate-800 dark:text-slate-100">Picture Perfect!</h2>
        <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
                <span className="block text-[10px] text-slate-400 font-black uppercase">Time</span>
                <span className="text-2xl font-black text-cyan-600">{timer}s</span>
            </div>
            <div className="text-center">
                <span className="block text-[10px] text-slate-400 font-black uppercase">Moves</span>
                <span className="text-2xl font-black text-emerald-600">{moves}</span>
            </div>
        </div>
        <div className="space-y-4">
          <Button size="lg" className="w-full font-black rounded-2xl bg-cyan-600 text-white" onClick={startGame}>New Puzzle</Button>
          <Button variant="outline" size="lg" className="w-full font-black rounded-2xl" onClick={onBack}>Dashboard</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <Clock className="text-cyan-600 w-6 h-6" />
            <div>
                <span className="block text-[10px] text-slate-400 font-black uppercase">Time</span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-100">{timer}s</span>
            </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <MoveHorizontal className="text-emerald-600 w-6 h-6" />
            <div>
                <span className="block text-[10px] text-slate-400 font-black uppercase">Moves</span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-100">{moves}</span>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-3 gap-2 aspect-square relative">
            {tiles.map((tile, i) => (
                <div 
                    key={i}
                    onClick={() => handleTileClick(i)}
                    className={`relative overflow-hidden rounded-xl transition-all duration-200 cursor-pointer border-2 ${
                        tile === 8 
                        ? 'bg-slate-100 dark:bg-slate-800 border-transparent' 
                        : 'border-white/20 shadow-sm active:scale-95'
                    }`}
                >
                    {tile !== 8 && (
                        <div 
                            className="absolute w-[300%] h-[300%]"
                            style={{
                                backgroundImage: `url(${PUZZLE_IMAGE})`,
                                backgroundSize: '100% 100%',
                                backgroundPosition: `${(tile % 3) * 50}% ${Math.floor(tile / 3) * 50}%`
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button variant="ghost" className="font-bold text-slate-400" onClick={initPuzzle}>
            <RefreshCw className="mr-2 w-4 h-4" /> Scramble Again
        </Button>
      </div>
    </div>
  );
}
