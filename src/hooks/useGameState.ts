import { useState, useCallback, useEffect } from 'react';
import { generateBoard, checkValidations, generateRandomBoardData, CellData } from '../lib/board';

export function useGameState(initialRegions?: number[][]) {
    const [board, setBoard] = useState<CellData[][]>(() => {
        if (initialRegions) return generateBoard(initialRegions);
        return generateRandomBoardData();
    });
    const [queens, setQueens] = useState<{ row: number, col: number }[]>([]);
    const [invalidQueens, setInvalidQueens] = useState<Set<string>>(new Set());
    const [isWin, setIsWin] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);

    // Timer
    useEffect(() => {
        if (isWin) return;
        const interval = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [isWin]);

    const toggleQueen = useCallback((row: number, col: number) => {
        if (isWin) return;

        setQueens(prev => {
            const existingIdx = prev.findIndex(q => q.row === row && q.col === col);
            let newQueens: { row: number, col: number }[];

            if (existingIdx >= 0) {
                newQueens = [...prev];
                newQueens.splice(existingIdx, 1);
            } else {
                newQueens = [...prev, { row, col }];
            }

            // We handle validations in a separate useEffect or immediately here.
            // Immediate is better for instant feedback.
            return newQueens;
        });
    }, [isWin]);

    // Re-run validations anytime queens change
    useEffect(() => {
        const { invalidQueens: newInvalids, isWin: newWin } = checkValidations(queens, board);
        setInvalidQueens(newInvalids);

        if (newWin && !isWin) {
            setIsWin(true);
            // Mock Supabase save
            console.log('Saved to Supabase: Time', timeElapsed, 'Score:', queens.length);
        }
    }, [queens, board, isWin, timeElapsed]);

    const reset = useCallback(() => {
        setQueens([]);
        setIsWin(false);
        setTimeElapsed(0);
        setInvalidQueens(new Set());
        // For the main game, generate a new random board
        if (!initialRegions) {
            setBoard(generateRandomBoardData());
        }
    }, [initialRegions]);

    return {
        board,
        queens,
        invalidQueens,
        isWin,
        timeElapsed,
        toggleQueen,
        reset
    };
}
