// Core
import { defineStore } from 'pinia';

// Types
import type { StoreDefinition } from 'pinia';
import type { Ship, ShipState } from '../interface';

// State
import { createShipState } from '../state/state.ship';
import { resetShipsAction } from '../actions/actions.ship';

/**
 * Ship store.
 *
 * @returns {ShipState} The state of the ship store.
 */
export const useShipStore: StoreDefinition = defineStore('shipStore', {
    /**
     * The state of the ship store.
     *
     * @returns {ShipState} The initial state.
     */
    state: (): ShipState => createShipState(),

    /**
     * The actions of the ship store.
     *
     * @returns {Object} The functions.
     */
    actions: {
        /**
         * Resets the ships in the store.
         *
         * @returns {void}
         */
        resetShips(): void {
            resetShipsAction(this);
        },
    },

    /**
     * The getters of the ship store.
     *
     * @returns {Object} The functions.
     */
    getters: {
        getShips(): Ship[] {
            return this.ships;
        },

        getAllSunk(): boolean {
            return this.ships.every((ship: Ship) => ship.sunk);
        },
    },
});
