export type CellData = {
    row: number;
    col: number;
    region: number;
};

export const INITIAL_REGIONS = [
    [0, 0, 0, 1, 1, 1, 2, 2, 2],
    [0, 0, 3, 1, 1, 4, 2, 2, 2],
    [0, 3, 3, 3, 1, 4, 4, 2, 2],
    [0, 3, 5, 3, 4, 4, 4, 6, 2],
    [5, 5, 5, 5, 4, 6, 6, 6, 6],
    [7, 5, 5, 8, 8, 6, 6, 6, 6],
    [7, 7, 8, 8, 8, 8, 6, 6, 6],
    [7, 7, 7, 8, 8, 8, 8, 8, 6],
    [7, 7, 7, 7, 7, 8, 8, 8, 8]
];

export const BOARD_SIZE = 9; // Default size

export function generateBoard(customRegions?: number[][]): CellData[][] {
    const regions = customRegions || INITIAL_REGIONS;
    const size = regions.length;
    const board: CellData[][] = [];
    for (let r = 0; r < size; r++) {
        const row: CellData[] = [];
        for (let c = 0; c < size; c++) {
            row.push({
                row: r,
                col: c,
                region: regions[r][c]
            });
        }
        board.push(row);
    }
    return board;
}

export function checkValidations(
    queens: { row: number; col: number }[],
    board: CellData[][]
): {
    invalidQueens: Set<string>; // 'row,col' string set
    isWin: boolean;
} {
    const invalidQueens = new Set<string>();

    // Check rows
    const rowCounts = new Map<number, typeof queens>();
    // Check cols
    const colCounts = new Map<number, typeof queens>();
    // Check regions
    const regionCounts = new Map<number, typeof queens>();

    for (const q of queens) {
        if (!rowCounts.has(q.row)) rowCounts.set(q.row, []);
        rowCounts.get(q.row)!.push(q);

        if (!colCounts.has(q.col)) colCounts.set(q.col, []);
        colCounts.get(q.col)!.push(q);

        const region = board[q.row][q.col].region;
        if (!regionCounts.has(region)) regionCounts.set(region, []);
        regionCounts.get(region)!.push(q);
    }

    // Mark errors
    for (const list of rowCounts.values()) {
        if (list.length > 1) list.forEach((q) => invalidQueens.add(`${q.row},${q.col}`));
    }
    for (const list of colCounts.values()) {
        if (list.length > 1) list.forEach((q) => invalidQueens.add(`${q.row},${q.col}`));
    }
    for (const list of regionCounts.values()) {
        if (list.length > 1) list.forEach((q) => invalidQueens.add(`${q.row},${q.col}`));
    }

    // Check diagonals / touching (including orthogonal touching, but row/col handle exact orthogonal.
    // Wait, Queens rules: No two Queens can touch, even diagonally. So a 3x3 square around any queen cannot contain another queen!
    for (let i = 0; i < queens.length; i++) {
        for (let j = i + 1; j < queens.length; j++) {
            const q1 = queens[i];
            const q2 = queens[j];
            const rowDiff = Math.abs(q1.row - q2.row);
            const colDiff = Math.abs(q1.col - q2.col);

            // Touching if rowDiff <= 1 and colDiff <= 1
            if (rowDiff <= 1 && colDiff <= 1) {
                invalidQueens.add(`${q1.row},${q1.col}`);
                invalidQueens.add(`${q2.row},${q2.col}`);
            }
        }
    }

    const size = board.length;
    const isWin = queens.length === size && invalidQueens.size === 0;

    return { invalidQueens, isWin };
}
