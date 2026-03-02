import { Cell } from './Cell';
import { CellData } from '../lib/board';

interface GridProps {
    board: CellData[][];
    queens: { row: number, col: number }[];
    invalidQueens: Set<string>;
    onToggleQueen: (row: number, col: number) => void;
}

export function Grid({ board, queens, invalidQueens, onToggleQueen }: GridProps) {
    // Utility to determine thick borders based on adjacent regions
    const getBorderClasses = (r: number, c: number) => {
        const currentRegion = board[r][c].region;
        let classes = 'border-slate-800 '; // Base thin border color

        // Top
        if (r === 0 || board[r - 1][c].region !== currentRegion) {
            classes += 'border-t-[3px] border-t-slate-800 z-10 '; // Thick border between regions
        } else {
            classes += 'border-t border-t-slate-800/20 ';
        }

        // Bottom
        if (r === board.length - 1 || board[r + 1][c].region !== currentRegion) {
            classes += 'border-b-[3px] border-b-slate-800 z-10 ';
        } else {
            classes += 'border-b border-b-slate-800/20 ';
        }

        // Left
        if (c === 0 || board[r][c - 1].region !== currentRegion) {
            classes += 'border-l-[3px] border-l-slate-800 z-10 ';
        } else {
            classes += 'border-l border-l-slate-800/20 ';
        }

        // Right
        if (c === board[0].length - 1 || board[r][c + 1].region !== currentRegion) {
            classes += 'border-r-[3px] border-r-slate-800 z-10 ';
        } else {
            classes += 'border-r border-r-slate-800/20 ';
        }

        return classes;
    };

    return (
        <div className="w-full max-w-[400px] aspect-square rounded-xl shadow-2xl relative border-4 border-slate-800 vinyl-texture overflow-hidden">
            {/* Inner record label circle decoration (optional, but let's keep it simple) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-1/3 aspect-square rounded-full border-[20px] border-black/40 blur-sm"></div>
            </div>
            <div
                className="absolute inset-0 grid backdrop-blur-[2px]"
                style={{
                    gridTemplateColumns: `repeat(${board.length}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${board.length}, minmax(0, 1fr))`
                }}
            >
                {board.flat().map((cell, idx) => {
                    const { row, col, region } = cell;
                    const hasQueen = queens.some(q => q.row === row && q.col === col);
                    const isError = invalidQueens.has(`${row},${col}`);
                    const borderClasses = getBorderClasses(row, col);

                    return (
                        <Cell
                            key={idx}
                            row={row}
                            col={col}
                            region={region}
                            hasQueen={hasQueen}
                            isError={isError}
                            onToggle={onToggleQueen}
                            borderClasses={borderClasses}
                        />
                    );
                })}
            </div>
        </div>
    );
}
