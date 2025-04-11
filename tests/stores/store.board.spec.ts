import {
    describe,
    it,
    expect,
    beforeEach,
}                        from 'vitest';
import {
    setActivePinia,
    createPinia,
}                        from 'pinia';
import { GAME_MESSAGES } from '../../src/constants';

import {
    useBoardStore,
    useShipStore,
    useFeedbackStore,
}                   from '../../src/stores';
import {
    FeedbackMessage,
    Ship,
    ShipPosition,
}                   from '../../src/stores/interface';
import formatString from '../../src/utils/util.format-string';


describe('Board Store', () => {
    let boardStore: ReturnType<typeof useBoardStore>;
    let shipStore: ReturnType<typeof useShipStore>;
    let feedbackStore: ReturnType<typeof useFeedbackStore>;

    beforeEach(() => {
        setActivePinia(createPinia());

        boardStore = useBoardStore();
        shipStore = useShipStore();
        feedbackStore = useFeedbackStore();
    });

    it('initializes game correctly', () => {
        boardStore.initGame();

        expect(boardStore.board.length).toBe(boardStore.getMaxColumnLength);
        expect(boardStore.board[0].length).toBe(boardStore.getMaxRowNumber);
        expect(boardStore.gameOver).toBe(false);

        const messageToCheck: FeedbackMessage = feedbackStore.messages[0];
        const ships: Ship[] = shipStore.ships;

        expect(ships.length).toBe(3);

        expect(messageToCheck.text).toContain(formatString(
            GAME_MESSAGES.GAME_STARTED, boardStore.getMaxRowLetter, boardStore.getMaxRowNumber,
        ));
    });

    it('processes a valid hit input', () => {
        boardStore.initGame();

        const firstShip: Ship = shipStore.ships[0];
        const firstPos: ShipPosition = firstShip.positions[0];
        const colLetter: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[firstPos.col];
        const rowNumber: number = firstPos.row + 1;
        const input: string = `${colLetter}${rowNumber}`;

        boardStore.processInput(input);

        expect(boardStore.board[firstPos.row][firstPos.col].isHit).toBe(true);

        expect(feedbackStore.messages.find((msg) => {
            return msg.text === formatString(GAME_MESSAGES.SHIP_HIT, 'A ship', input);
        }))
            .toBeDefined();
    });

    it('processes invalid input and reports it', () => {
        boardStore.initGame();
        boardStore.processInput('Z99');

        const maxInput: string = `${boardStore.getMaxRowLetter}${boardStore.getMaxColumnLength}`;

        const getMessage: FeedbackMessage = feedbackStore.messages[0];

        expect(getMessage.text).toContain(formatString(
            GAME_MESSAGES.COORDINATE_OUT_OF_BOUNDS,
            maxInput,
        ));
    });

    it('prevents firing at the same cell twice', () => {
        boardStore.initGame();

        const input: string = 'A1';

        boardStore.processInput(input);

        const initialMessageCount = feedbackStore.messages.length;

        boardStore.processInput(input);

        const firstMessage: FeedbackMessage = feedbackStore.messages[0];

        expect(feedbackStore.messages.length).toBeGreaterThan(initialMessageCount);
        expect(firstMessage.text).toContain(GAME_MESSAGES.COORDINATE_ALREADY_FIRED);
    });
});
