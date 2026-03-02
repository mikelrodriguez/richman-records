import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CellProps {
    row: number;
    col: number;
    region: number;
    hasQueen: boolean;
    isError: boolean;
    onToggle: (row: number, col: number) => void;
    // To draw borders based on adjacencies we would need the board, but for a 9x9 we can compute it in Grid
    borderClasses: string;
}

const REGION_COLORS: Record<number, string> = {
    0: 'bg-region-0',
    1: 'bg-region-1',
    2: 'bg-region-2',
    3: 'bg-region-3',
    4: 'bg-region-4',
    5: 'bg-region-5',
    6: 'bg-region-6',
    7: 'bg-region-7',
    8: 'bg-region-8',
};

export function Cell({ row, col, region, hasQueen, isError, onToggle, borderClasses }: CellProps) {
    const shakeAnimation = {
        shake: {
            x: [0, -4, 4, -4, 4, 0],
            transition: { duration: 0.4 },
        },
    };

    return (
        <motion.button
            onClick={() => onToggle(row, col)}
            whileTap={{ scale: 0.95 }}
            animate={isError ? "shake" : ""}
            variants={shakeAnimation}
            className={cn(
                'relative w-full h-full flex items-center justify-center select-none',
                'border-slate-800 transition-colors',
                REGION_COLORS[region] || 'bg-white',
                borderClasses, // Custom thick borders for regions
                isError && hasQueen ? 'bg-red-400' : '' // Flash red if error
            )}
            aria-label={`Cell at row ${row}, col ${col}, region ${region}`}
        >
            {/* If error on empty cell (e.g. sharing row), we could put a small red dot, but standard is just full red cell or error icon.
          Actually, let's make the background slightly red if it's an error but no queen? No, usually only queens show error.
          We will only show error if it has a queen and is in an error state. Wait, the validation logic only adds queens to invalidQueens set.
      */}
            {hasQueen && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                >
                    <Crown
                        className={cn(
                            "w-6 h-6 sm:w-8 sm:h-8 drop-shadow-md",
                            isError ? "text-red-900" : "text-slate-900"
                        )}
                        strokeWidth={2.5}
                    />
                </motion.div>
            )}

            {/* Optional: Add a subtle overlay if it's conflicting but empty? No, the hook only returns invalid queens. */}
        </motion.button>
    );
}
