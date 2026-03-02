import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid } from './Grid';
import { useGameState } from '../hooks/useGameState';
import { Crown, Sparkles, AlertCircle, ArrowRight, Play } from 'lucide-react';

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

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-[300px]">
            <div className="mb-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">Try it out!</h3>
                <p className="text-sm text-slate-300">
                    Place exactly 4 Queens safely. If they highlight red, they are touching or sharing a row/col/region!
                </p>
            </div>

            <div className="w-full aspect-square pointer-events-auto">
                <Grid
                    board={board}
                    queens={queens}
                    invalidQueens={invalidQueens}
                    onToggleQueen={toggleQueen}
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
                    {queens.length} / 4 Queens
                </div>
            </div>
        </div>
    );
}

export function Tutorial({ onFinish }: { onFinish: () => void }) {
    const [step, setStep] = useState(0);

    const steps = [
        {
            icon: <Crown className="w-12 h-12 text-yellow-400 mb-4" />,
            title: "Welcome to Queens",
            content: "A beautiful logic puzzle where your goal is to place Queens on the board safely."
        },
        {
            icon: <AlertCircle className="w-12 h-12 text-indigo-400 mb-4" />,
            title: "The Golden Rules",
            content: "1. Exactly one Queen per row, column, and colored region.\n2. No two Queens can touch each other, not even diagonally."
        },
        {
            interactive: true
        },
        {
            icon: <Sparkles className="w-12 h-12 text-emerald-400 mb-4" />,
            title: "You got it!",
            content: "You're now ready to tackle the Daily Puzzle. Good luck!"
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
