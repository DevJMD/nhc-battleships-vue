/**
 * Contains the interfaces for the game state.
 */

export interface ShipPosition {
    row: number;
    col: number;
}

export interface BoardCell {
    shipId: number | null;
    isHit: boolean;
    isMiss: boolean;
    isSunk?: boolean;
}

export interface Ship {
    id: number;
    type: string;
    size: number;
    positions: ShipPosition[];
    sunk: boolean;
}

export interface LastShot {
    row: number;
    col: number;
    result: 'hit' | 'miss';
}

export interface FeedbackMessage {
    type: string;
    text: string;
}

export interface ShipState {
    ships: Ship[];
}

export interface BoardState {
    board: BoardCell[][];
    userInput: string;
    gameOver: boolean;
    lastShot: LastShot | null;
}

export interface FeedbackState {
    messages: FeedbackMessage[];
}
