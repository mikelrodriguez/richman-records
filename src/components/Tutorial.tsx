import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid } from './Grid';
import { useGameState } from '../hooks/useGameState';
import { Mic, Music, AlertCircle, ArrowRight, Play } from 'lucide-react';
import { playPlunk } from '../lib/audio';

const TUTORIAL_REGIONS = [
    [0, 0, 1, 1],
    [0, 2, 2, 1],
    [3, 3, 2, 1],
    [3, 3, 2, 2]
];

function TutorialGame({ onComplete }: { onComplete: () => void }) {
    const { board, queens, invalidQueens, isWin, toggleQueen, reset } = useGameState(TUTORIAL_REGIONS);

    useEffect(() => {
        if (isWin) {
            setTimeout(() => onComplete(), 1500); // Wait a moment so they can see the win
        }
    }, [isWin, onComplete]);

    const handleToggle = (row: number, col: number) => {
        playPlunk();
        toggleQueen(row, col);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[300px]">
            <div className="mb-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Try it out!</h3>
                <p className="text-sm text-slate-300">
                    Place exactly 4 Lead Singers so none clash. If they highlight red, their vocal spaces overlap!
                </p>
            </div>

            <div className="w-full aspect-square pointer-events-auto">
                <Grid
                    board={board}
                    queens={queens}
                    invalidQueens={invalidQueens}
                    onToggleQueen={handleToggle}
                />
            </div>

            <div className="w-full flex justify-between mt-6">
                <button
                    onClick={reset}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                    Reset Board
                </button>
                <div className="text-sm font-bold text-indigo-400">
                    {queens.length} / 4 Singers
                </div>
            </div>
        </div>
    );
}

export function Tutorial({ onFinish }: { onFinish: () => void }) {
    const [step, setStep] = useState(0);

    const steps = [
        {
            icon: <Mic className="w-12 h-12 text-yellow-400 mb-4" />,
            title: "Welcome to Richman Records",
            content: "A musical logic puzzle where your goal is to place Lead Singers on their tracks perfectly."
        },
        {
            icon: <AlertCircle className="w-12 h-12 text-indigo-400 mb-4" />,
            title: "Harmony over Dissonance",
            content: "1. Exactly one Singer per track (row), column, and colored vocal space.\n2. Singers need space—no two can touch, not even diagonally."
        },
        {
            interactive: true
        },
        {
            icon: <Music className="w-12 h-12 text-emerald-400 mb-4" />,
            title: "Beautiful!",
            content: "You've successfully cut the record! You're ready to tackle the full puzzle. Good luck, Nancy!"
        }
    ];

    const handleNext = () => setStep(s => Math.min(s + 1, steps.length - 1));

    return (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-sm flex flex-col items-center text-center"
                >
                    {!steps[step].interactive ? (
                        <div className="flex flex-col items-center bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
                            {steps[step].icon}
                            <h2 className="text-2xl font-bold text-white mb-4">{steps[step].title}</h2>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {steps[step].content}
                            </p>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={step === steps.length - 1 ? onFinish : handleNext}
                                className="mt-8 flex items-center justify-center space-x-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-900/50"
                            >
                                <span>{step === steps.length - 1 ? "Start Playing" : "Next"}</span>
                                {step === steps.length - 1 ? <Play className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                            </motion.button>
                        </div>
                    ) : (
                        <TutorialGame onComplete={handleNext} />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
