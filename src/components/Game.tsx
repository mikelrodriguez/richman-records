import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Clock, Trophy } from 'lucide-react';
import { Grid } from './Grid';
import { Tutorial } from './Tutorial';
import { useGameState } from '../hooks/useGameState';

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
                                Queens
                            </h1>
                            <p className="text-sm font-medium text-slate-400">Daily Puzzle</p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-slate-300 font-mono text-lg bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                                <Clock className="w-4 h-4 text-indigo-400" />
                                <span>{formatTime(timeElapsed)}</span>
                            </div>

                            <button
                                onClick={reset}
                                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-colors active:scale-95"
                                aria-label="Reset Board"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Board Container */}
                    <Grid
                        board={board}
                        queens={queens}
                        invalidQueens={invalidQueens}
                        onToggleQueen={toggleQueen}
                    />

                    {/* Success Modal / Banner */}
                    <AnimatePresence>
                        {isWin && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="w-full bg-indigo-600 rounded-xl p-4 flex flex-col items-center justify-center space-y-3 shadow-lg shadow-indigo-900/20"
                            >
                                <div className="flex items-center space-x-2 text-indigo-100 text-xl font-bold">
                                    <Trophy className="w-6 h-6 text-yellow-300" />
                                    <span>Brilliant! You solved it.</span>
                                </div>
                                <p className="text-indigo-200 text-sm">Solved in {formatTime(timeElapsed)}</p>
                                <button
                                    onClick={reset}
                                    className="mt-2 bg-white text-indigo-600 font-semibold px-6 py-2 rounded-full hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
                                >
                                    Play Again
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>

            {showTutorial && (
                <Tutorial
                    onFinish={() => {
                        localStorage.setItem('hasSeenTutorial', 'true');
                        setShowTutorial(false);
                        reset(); // Reset the main board timer since it might have been running behind the tutorial
                    }}
                />
            )}
        </>
    );
}
