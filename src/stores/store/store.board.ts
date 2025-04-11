// Core
import { defineStore } from 'pinia';

// Types
import type { StoreDefinition } from 'pinia';
import type { BoardState } from '../interface';

// State
import { createBoardState } from '../state/state.board';
import { processInputAction, initGameAction, clearLastShotAction } from '../actions/actions.board';

export const useBoardStore: StoreDefinition = defineStore('boardStore', {
    /**
     * The state of the board store.
     *
     * @returns {BoardState}
     */
    state: (): BoardState => createBoardState(),

    /**
     * The actions of the board store.
     *
     * @returns {Object}
     */
    actions: {
        /**
         * Processes the player input for firing at a coordinate on the board.
         *
         * @param {string} input
         */
        processInput(input: string) {
            return processInputAction(this, input);
        },

        /**
         * Initializes the game by creating a new board and placing ships.
         */
        initGame() {
            return initGameAction(this);
        },

        /**
         * Clears the last shot result.
         */
        clearLastShot() {
            return clearLastShotAction(this);
        },
    },

    /**
     * The getters of the board store.
     *
     * @returns {Object}
     */
    getters: {
        /**
         * Gets the board state.
         *
         * @returns {BoardState['board']}
         */
        getBoard(): BoardState['board'] {
            return this.board;
        },

        /**
         * Gets the user input used to take a shot.
         *
         * @returns {BoardState['userInput']}
         */
        getUserInput(): BoardState['userInput'] {
            return this.userInput;
        },

        /**
         * Checks if the game is over.
         *
         * @returns {BoardState['gameOver']}
         */
        isGameOver(): BoardState['gameOver'] {
            return this.gameOver;
        },

        /**
         * Gets the maximum row letter based on the board size.
         *
         * @returns {string}
         */
        getMaxRowLetter(): string {
            const maxColIndex = this.board[0]?.length - 1 || 0;
            return String.fromCharCode(65 + maxColIndex);
        },

        /**
         * Gets the maximum column number based on the board size.
         *
         * @returns {number}
         */
        getMaxRowNumber(): number {
            return this.board[0]?.length || 0;
        },

        /**
         * Gets the maximum column length based on the board size.
         *
         * @returns {number}
         */
        getMaxColumnLength(): number {
            return this.board.length;
        },

        /**
         * Gets the last shot result.
         *
         * @returns {BoardState['lastShot']}
         */
        getLastShot(): BoardState['lastShot'] {
            return this.lastShot;
        },
    },
});
