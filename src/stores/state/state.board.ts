import type { BoardCell, BoardState } from '../interface';

const envRowCount = Number(import.meta.env.VITE_BS_ROW_COUNT) || 8;
const envColumnCount = Number(import.meta.env.VITE_BS_COLUMN_COUNT) || 8;
export const ROW_COUNT = Math.max(envRowCount, 8);
export const COLUMN_COUNT = Math.max(envColumnCount, 8);

export const createBoardState = (): BoardState => {
    /**
     * Creates a board state with the specified number of rows and columns.
     * We use `Array.from` to create a 2D array of board cells, each containing
     * a state object with properties:
     * - `shipId`: null (no ship placed)
     * - `isHit`: false (not hit)
     * - `isMiss`: false (not missed)
     * - `isSunk`: false (not sunk)
     *
     * This is to track the state of each ship on the board.
     *
     * @type {{isMiss: boolean, isSunk: boolean, isHit: boolean, shipId: null}[][]}
     */
    const board: BoardCell[][] = Array.from({ length: ROW_COUNT }, () =>
        Array.from({ length: COLUMN_COUNT }, () => ({
            shipId: null,
            isHit: false,
            isMiss: false,
            isSunk: false,
        })),
    );

    return {
        board,
        userInput: '',
        gameOver: false,
        lastShot: null,
    };
};
