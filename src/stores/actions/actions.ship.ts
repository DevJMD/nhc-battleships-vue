import type { Ship, BoardCell, ShipPosition } from '../interface';

/**
 * Resets the ship store by clearing the list of ships.
 *
 * @param {{ships: Ship[]}} shipStore
 */
export const resetShipsAction = (shipStore: {
    ships: Ship[];
}) => {
    shipStore.ships = [];
};


/**
 * Tries to randomly place a ship on the board.
 * @param shipType - The type of ship (Battleship, Destroyer, etc.)
 * @param shipSize - The number of cells the ship occupies.
 * @param board - The game board.
 * @param setCell - A callback to update a board cell with a ship id.
 * @param ships - The list of ships from the Ship store.
 */
export const placeShipRandomly = (
    shipType: string,
    shipSize: number,
    board: BoardCell[][],
    setCell: (row: number, col: number, shipId: number) => void,
    ships: {
        length: number;
        push(ship: Ship): void
    }, // using array-like interface for ships
): void => {
    const boardSize = board.length;
    let placed = false;

    while (!placed) {
        const orientation = Math.random() < 0.5 ? 0 : 1;
        let maxRow = boardSize;
        let maxCol = boardSize;

        if (orientation === 0) {
            maxCol = boardSize - shipSize;
        } else {
            maxRow = boardSize - shipSize;
        }

        const row = Math.floor(Math.random() * maxRow);
        const col = Math.floor(Math.random() * maxCol);
        const positions: ShipPosition[] = [];

        let canPlace = true;

        for (let i = 0; i < shipSize; i++) {
            const inRow = orientation === 0 ? row : row + i;
            const inCol = orientation === 0 ? col + i : col;

            if (board[inRow][inCol].shipId !== null) {
                canPlace = false;
                break;
            }

            positions.push({ row: inRow, col: inCol });
        }

        if (canPlace) {
            const shipId = ships.length + 1;

            positions.forEach(pos => setCell(pos.row, pos.col, shipId));

            ships.push({
                id: shipId,
                type: shipType,
                size: shipSize,
                sunk: false,
                positions,
            });

            placed = true;
        }
    }
};

/**
 * Checks if a ship is sunk.
 *
 * @param {Ship} ship
 * @param {BoardCell[][]} board
 * @returns {boolean}
 */
export const isShipSunk = (ship: Ship, board: BoardCell[][]): boolean => {
    return ship.positions.every(pos => board[pos.row][pos.col].isHit);
};

/**
 * Checks if all ships are sunk.
 *
 * @param {Ship[]} ships
 * @param {BoardCell[][]} board
 * @returns {boolean}
 */
export const areAllShipsSunk = (ships: Ship[], board: BoardCell[][]): boolean => {
    return ships.every(ship => isShipSunk(ship, board));
};
