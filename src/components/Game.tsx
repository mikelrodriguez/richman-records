import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Clock, Music } from 'lucide-react';
import { Grid } from './Grid';
import { Tutorial } from './Tutorial';
import { useGameState } from '../hooks/useGameState';
import { playPlunk, playHarmony } from '../lib/audio';
import { getRandomLyric } from '../constants/beatles';

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export function Game() {
    const [showTutorial, setShowTutorial] = useState(() => {
        return localStorage.getItem('hasSeenTutorial') !== 'true';
    });
    const { board, queens, invalidQueens, isWin, timeElapsed, toggleQueen, reset } = useGameState();
    const [winLyric, setWinLyric] = useState<string>('');

    useEffect(() => {
        if (isWin) {
            playHarmony();
            setWinLyric(getRandomLyric());
        }
    }, [isWin]);

    const handleToggleQueen = (row: number, col: number) => {
        playPlunk();
        toggleQueen(row, col);
    };

    useEffect(() => {
        const handleResize = () => { }; // placeholder if needed
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
                <div className="w-full max-w-[400px] flex flex-col items-center space-y-6">

                    {/* Header Options */}
                    <div className="w-full flex justify-between items-end mb-2">
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
                                Richman Records
                            </h1>
                            <p className="text-sm font-medium text-slate-400">Musical Logic Puzzle</p>
                        </div>

                        <div className="flex bg-slate-900/50 backdrop-blur-md p-1 rounded-xl border border-white/5 space-x-1 shadow-inner">
                            <div className="flex items-center space-x-2 text-amber-200/90 font-mono text-lg bg-black/40 px-4 py-2 rounded-lg border border-white/5 shadow-md">
                                <Clock className="w-4 h-4 text-emerald-400" />
                                <span>{formatTime(timeElapsed)}</span>
                            </div>

                            <button
                                onClick={reset}
                                className="p-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 rounded-lg border border-indigo-500/20 transition-all duration-300 active:scale-95 flex items-center justify-center group"
                                aria-label="Reset Board"
                            >
                                <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500 ease-in-out" />
                            </button>
                        </div>
                    </div>

                    {/* Board Container */}
                    <div className="relative w-full max-w-[400px]">
                        {/* Subtle glow behind the board on win */}
                        <AnimatePresence>
                            {isWin && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1.05 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full rounded-xl z-0"
                                />
                            )}
                        </AnimatePresence>

                        <motion.div
                            animate={isWin ? {
                                scale: [1, 1.02, 1],
                                boxShadow: [
                                    "0px 0px 0px rgba(234, 179, 8, 0)",
                                    "0px 0px 30px rgba(234, 179, 8, 0.3)",
                                    "0px 0px 0px rgba(234, 179, 8, 0)"
                                ]
                            } : { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
                            transition={isWin ? { duration: 2, ease: "easeInOut", repeat: Infinity } : { duration: 0.5 }}
                            className="w-full max-w-[400px] relative z-10"
                        >
                            <Grid
                                board={board}
                                queens={queens}
                                invalidQueens={invalidQueens}
                                onToggleQueen={handleToggleQueen}
                            />

                            {/* Success Modal / Banner */}
                            <AnimatePresence>
                                {isWin && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className="w-full bg-slate-900/80 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 shadow-2xl relative overflow-hidden mt-6"
                                    >
                                        {/* Decorative gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-indigo-500/10 pointer-events-none" />

                                        <div className="flex items-center space-x-3 text-yellow-500 text-2xl font-black tracking-tight z-10">
                                            <Music className="w-8 h-8 text-yellow-400" />
                                            <span>Beautiful Harmony!</span>
                                        </div>
                                        <p className="text-slate-200 text-lg font-serif italic text-center px-4 leading-relaxed z-10">
                                            "{winLyric}"
                                        </p>

                                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent my-2 z-10" />

                                        <div className="flex flex-col items-center w-full z-10 space-y-4">
                                            <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">
                                                Session Time: <span className="text-amber-200 ml-1">{formatTime(timeElapsed)}</span>
                                            </p>
                                            <button
                                                onClick={reset}
                                                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold px-8 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] active:scale-95 transition-all duration-300"
                                            >
                                                Flip the Record (Play Again)
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                </div>
            </div>

            {showTutorial && (
                <Tutorial
                    onFinish={() => {
                        localStorage.setItem('hasSeenTutorial', 'true');
                        setShowTutorial(false);
                        reset();
                    }}
                />
            )}
        </>
    );
}
