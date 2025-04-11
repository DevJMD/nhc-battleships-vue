import {
    describe,
    it,
    expect,
    beforeEach,
} from 'vitest';
import {
    setActivePinia,
    createPinia,
} from 'pinia';

import { useShipStore } from '../../src/stores';

describe('Ship Store', () => {
    let shipStore: ReturnType<typeof useShipStore>;

    beforeEach(() => {
        setActivePinia(createPinia());
        shipStore = useShipStore();
    });

    it('resets ships correctly', () => {
        shipStore.ships.push({ id: 1, type: 'Battleship', size: 5, sunk: false, positions: [] });

        expect(shipStore.ships.length).toBeGreaterThan(0);

        shipStore.resetShips();

        expect(shipStore.ships.length).toBe(0);
    });

    it('gets all ships via getter', () => {
        shipStore.ships = [
            { id: 1, type: 'Battleship', size: 5, sunk: false, positions: [] },
            { id: 2, type: 'Destroyer', size: 3, sunk: false, positions: [] },
        ];

        const allShips = shipStore.getShips;

        expect(allShips.length).toBe(2);

        expect(allShips[0]?.type).toBe('Battleship');
        expect(allShips[1]?.type).toBe('Destroyer');
    });

    it('getter checks all ships are sunk', () => {
        shipStore.ships = [
            { id: 1, type: 'Battleship', size: 5, sunk: true, positions: [] },
            { id: 2, type: 'Destroyer', size: 3, sunk: true, positions: [] },
        ];

        const allSunk = shipStore.getAllSunk;

        expect(allSunk).toBe(true);
    });
});
