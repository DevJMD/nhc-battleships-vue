import type { Ship, BoardCell, ShipPosition } from '../interface';

/**
 * Resets the ship store by clearing the list of ships.
 *
 * @param {{ships: Ship[]}} shipStore
 *
 * @returns {void}
 */
export const resetShipsAction = (shipStore: {
    ships: Ship[];
}): void => {
    shipStore.ships = [];
};


/**
 * Tries to randomly place a ship on the board.
 *
 * @param shipType - The type of ship (Battleship, Destroyer, etc.)
 * @param shipSize - The number of cells the ship occupies.
 * @param board - The game board.
 * @param setCell - A callback to update a board cell with a ship id.
 * @param ships - The list of ships from the Ship store.
 *
 * @returns {void}
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
        // Randomly choose orientation: 0 for horizontal, 1 for vertical.
        const orientation: number = Math.random() < 0.5 ? 0 : 1;
        let maxRow: number = boardSize;
        let maxCol: number = boardSize;

        // Determine the maximum row and column based on orientation.
        // 0 for horizontal, 1 for vertical.
        if (orientation === 0) {
            maxCol = boardSize - shipSize;
        } else {
            maxRow = boardSize - shipSize;
        }

        // Generate random row and column positions.
        const row: number = Math.floor(Math.random() * maxRow);
        const col: number = Math.floor(Math.random() * maxCol);
        const positions: ShipPosition[] = [];

        let canPlace: boolean = true;

        for (let i = 0; i < shipSize; i++) {
            // Calculate the row and column for the current position.
            const inRow: number = orientation === 0 ? row : row + i;
            const inCol: number = orientation === 0 ? col + i : col;

            // Check if the position is already occupied by another ship.
            // If so, we canny place the ship here.
            if (board[inRow][inCol].shipId !== null) {
                canPlace = false;
                break;
            }

            // Otherwise, add the position to the list of positions for this ship.
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
 *
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
 *
 * @returns {boolean}
 */
export const areAllShipsSunk = (ships: Ship[], board: BoardCell[][]): boolean => {
    return ships.every(ship => isShipSunk(ship, board));
};
