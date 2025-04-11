import { ROW_COUNT, COLUMN_COUNT } from '../state/state.board';
import { useShipStore } from '../store/store.ship';
import { useFeedbackStore } from '../store/store.feedback';
import { areAllShipsSunk, placeShipRandomly } from './actions.ship';
import { GAME_MESSAGES } from '../../constants';
import formatString from '../../utils/util.format-string';
import type { BoardState, Ship, ShipPosition } from '../interface';

const validColumns = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, COLUMN_COUNT);

/**
 * Checks if the input coordinate is valid based on dynamic board size.
 * Valid coordinates must be in the format of a letter (A to last valid letter (i.e., J))
 * followed by a row number (1 to ROW_COUNT (i.e., 10)).
 *
 * @param {string} input
 * @returns {boolean}
 */
const isValidCoordinateFormat = (input: string): boolean => {
    let isValid = true;

    // Minimum length is 2 (e.g., A1)
    if (input.length < 2) {
        isValid = false;
    }

    const colLetter = input.charAt(0).toUpperCase();

    // Check if the column letter is within the allowed range
    if (!validColumns.includes(colLetter)) {
        isValid = false;
    }

    // Check if the numeric part is valid.
    const rowPart = input.slice(1);
    const rowNumber = parseInt(rowPart, 10);

    // Check if the row number is valid.
    return isValid && !(isNaN(rowNumber) || rowNumber < 1 || rowNumber > ROW_COUNT);
};

/**
 * Processes the player input for firing at a coordinate on the board.
 * - Validates the input format (e.g., A5).
 * - Checks if the game is over.
 * - Checks if the coordinate has already been fired at.
 * - Updates the board state based on the hit or miss.
 * - Updates the feedback store with messages.
 *
 * @param {BoardState} state
 * @param {string} input
 * @returns {void}
 */
export const processInputAction = (state: BoardState, input: string): void => {
    const feedbackStore = useFeedbackStore();
    const shipStore = useShipStore();

    if (state.gameOver) {
        feedbackStore.addMessage(GAME_MESSAGES.GAME_OVER);
        return;
    }

    const trimmedInput = input.trim().toUpperCase();

    if (!isValidCoordinateFormat(trimmedInput)) {
        feedbackStore.addMessage({
            type: 'invalid-input',
            text: formatString(
                GAME_MESSAGES.COORDINATE_OUT_OF_BOUNDS,
                `${validColumns.slice(-1)}${ROW_COUNT}`,
            ),
        });

        return;
    }

    // Convert input like A1 to board indices (0-indexed).
    const colLetter: string = trimmedInput.charAt(0);
    const rowNumber: number = parseInt(trimmedInput.slice(1), 10) - 1;
    const colIndex: number = validColumns.indexOf(colLetter);

    // Check if the row number is valid.
    const cell = state.board[rowNumber][colIndex];

    // Check if the cell is already hit or missed.
    // If so, let the player know and end the sequence.
    if (cell.isHit || cell.isMiss) {
        feedbackStore.addMessage({
            type: 'already-fired',
            text: formatString(GAME_MESSAGES.COORDINATE_ALREADY_FIRED, trimmedInput),
        });

        return;
    }

    // Check if the cell has a ship ID (indicating a hit).
    if (cell.shipId !== null) {
        // Find the ship by ID.
        const ship = shipStore.ships.find((ship: Ship) => ship.id === cell.shipId);

        // Mark the cell as hit.
        cell.isHit = true;
        state.lastShot = { row: rowNumber, col: colIndex, result: 'hit' };

        // Send feedback to the player: They hit a ship...
        feedbackStore.addMessage({
            type: 'hit',
            // I did put the ship name in the message, but feel that gives it away...
            text: formatString(GAME_MESSAGES.SHIP_HIT, 'A ship', trimmedInput),
        });

        if (ship) {
            // Check if the ship is sunk...
            const sunk: boolean = ship.positions.every(
                (position: ShipPosition) => state.board[position.row][position.col].isHit,
            );

            // Update the ship store to mark the ship as sunk.
            if (sunk) {
                feedbackStore.addMessage({
                    type: 'sunk',
                    text: formatString(GAME_MESSAGES.SHIP_SUNK, ship.type),
                });

                // Mark all cells corresponding to the sunken ship.
                ship.positions.forEach((position: ShipPosition) => {
                    /**
                     * Mark the cell as sunk.
                     *
                     * @type {boolean}
                     */
                    state.board[position.row][position.col].isSunk = true;
                });

                // Update the ship store to mark the ship as sunk.
                ship.sunk = true;

                // If all ships are sunk, end the game and notify the player.
                if (areAllShipsSunk(shipStore.ships, state.board)) {
                    feedbackStore.addMessage({
                        type: 'win',
                        text: GAME_MESSAGES.ALL_SHIPS_SUNK,
                    });
                    state.gameOver = true;
                }
            }
        }
    } else {
        // The player missed... (internal sad faces)
        cell.isMiss = true;
        state.lastShot = { row: rowNumber, col: colIndex, result: 'miss' };

        // Send feedback to the player: They missed...
        feedbackStore.addMessage({
            type: 'miss',
            text: formatString(GAME_MESSAGES.SHIP_MISS, trimmedInput),
        });
    }
};

/**
 * Initializes the game state, including the board and ships.
 * - Creates a dynamic board with ROW_COUNT rows and COLUMN_COUNT columns (environment variables).
 * - Places 1 Battleship and 2 Destroyers randomly on the board.
 * - Clears any previous messages in the feedback store.
 * - Resets the ship store.
 * - Sets the "game over" state to false.
 * - Resets the player input within the board state.
 *
 * @param {BoardState} state
 */
export const initGameAction = (state: BoardState): void => {
    // Use the dynamic board dimensions.
    state.board = Array.from({ length: ROW_COUNT }, () =>
        Array.from({ length: COLUMN_COUNT }, () => ({
            shipId: null,
            isHit: false,
            isMiss: false,
            isSunk: false, // Added property to mark sunken ship cells.
        })),
    );

    // Reset game state.
    state.gameOver = false;
    state.playerInput = '';

    // Clear any previous messages in the feedback store.
    const feedbackStore = useFeedbackStore();
    feedbackStore.clearMessages();

    // Reset the ship store.
    const shipStore = useShipStore();
    shipStore.resetShips();

    /**
     * Sets a cell on the board with a given ship ID.
     *
     * @param {number} row
     * @param {number} col
     * @param {number} shipId
     */
    const setCell = (row: number, col: number, shipId: number): void => {
        state.board[row][col].shipId = shipId;
    };

    // Place 1 Battleship (size 5) and 2 Destroyers (size 4 each)
    // Of course, in a computer-generated game, this could be randomized on
    // each game start. Just following spec for now.
    placeShipRandomly('Battleship', 5, state.board, setCell, shipStore.ships);
    placeShipRandomly('Destroyer', 4, state.board, setCell, shipStore.ships);
    placeShipRandomly('Destroyer', 4, state.board, setCell, shipStore.ships);

    // Let the player know the game has started.
    feedbackStore.addMessage({
        type: 'game-started',
        text: formatString(GAME_MESSAGES.GAME_STARTED, validColumns.slice(-1), ROW_COUNT),
    });
};

/**
 * Clears the last shot made by the player.
 *
 * @param {BoardState} state
 */
export const clearLastShotAction = (state: BoardState): void => {
    state.lastShot = null;
};
