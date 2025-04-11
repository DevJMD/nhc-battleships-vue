import type { ShipState } from '../interface';

/**
 * Creates the initial state for the ship store.
 *
 * @returns {ShipState}
 */
export const createShipState = (): ShipState => ({
    ships: [],
});
