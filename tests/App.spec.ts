import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises, DOMWrapper } from '@vue/test-utils';
import { createPinia } from 'pinia';

import App from '../src/App.vue';
import { useBoardStore, useShipStore } from '../src/stores';

describe('App.vue', () => {
    let wrapper: ReturnType<typeof mount>;
    let shipStore: ReturnType<typeof useShipStore>;
    let boardStore: ReturnType<typeof useBoardStore>;

    beforeEach(() => {
        wrapper = mount(App, {
            global: {
                plugins: [createPinia()],
            },
        });

        boardStore = useBoardStore();
        shipStore = useShipStore();

        shipStore.ships = [
            {
                id: 1,
                type: 'Test Ship',
                size: 2,
                sunk: false,
                positions: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
            },
            { id: 2, type: 'Test Ship', size: 1, sunk: false, positions: [{ row: 0, col: 1 }] },
            { id: 3, type: 'Test Ship', size: 1, sunk: false, positions: [{ row: 0, col: 2 }] },
        ];

        boardStore.board[0][0].shipId = 1;
        boardStore.board[1][1].shipId = 2;
        boardStore.board[2][2].shipId = 3;
    });

    it('renders the game title and input elements', async () => {
        expect(wrapper.find('.c-app__header-title').text()).toBe('Battleships  🔄 Reset Game');

        const input: DOMWrapper<Element> = wrapper.find('.c-controls__input');
        const button: DOMWrapper<Element> = wrapper.find('.c-controls__fire');

        expect(input.exists()).toBe(true);
        expect(button.exists()).toBe(true);
    });

    it('renders the grid and feedback elements', async () => {
        const gameBoard: DOMWrapper<Element> = wrapper.find('.c-game-board');
        const feedback: DOMWrapper<Element> = wrapper.find('.c-feedback');

        expect(gameBoard.exists()).toBe(true);
        expect(feedback.exists()).toBe(true);
    });

    it('allows firing a shot and updates board, recieving feedback', async () => {
        await flushPromises();

        const input: DOMWrapper<Element> = wrapper.find('.c-controls__input');
        await input.setValue('A1');

        const button: DOMWrapper<Element> = wrapper.find('.c-controls__fire');
        await button.trigger('click');

        await flushPromises();

        // Find first
        const feedbackMessage: DOMWrapper<Element> = wrapper.find('.c-feedback__message');

        expect(feedbackMessage.text()).toContain('A ship was a hit at A1!');

        const firstGridRow: DOMWrapper<Element> = wrapper.find('.c-game-board__cell');
        const firstGridCell: DOMWrapper<Element> = firstGridRow.find('.c-game-board__cell-content');

        // Match one of three emojis
        expect(firstGridCell.text()).toMatch(/💥|⭕|🔴/);
    });

    it('allows hitting a ship at a specific position', async () => {
        await flushPromises();

        const input: DOMWrapper<Element> = wrapper.find('.c-controls__input');
        const button: DOMWrapper<Element> = wrapper.find('.c-controls__fire');

        await input.setValue('A1');
        await button.trigger('click');

        await flushPromises();

        const gridCell: DOMWrapper<Element> = wrapper.find('.c-game-board__cell--hit');
        expect(gridCell.exists()).toBe(true);

        const feedbackMessage: DOMWrapper<Element> = wrapper.find('.c-feedback__message');
        expect(feedbackMessage.text()).toContain('A ship was a hit at A1!');
    });

    it('prevents firing at the same cell twice', async () => {
        await flushPromises();

        const input: DOMWrapper<Element> = wrapper.find('.c-controls__input');
        const button: DOMWrapper<Element> = wrapper.find('.c-controls__fire');

        await input.setValue('A1');
        await button.trigger('click');
        await input.setValue('A1');
        await button.trigger('click');

        await flushPromises();

        const feedbackMessage: DOMWrapper<Element> = wrapper.find('.c-feedback__message');

        expect(feedbackMessage.text()).toContain('You\'ve already fired at that coordinate.');
    });

    it('can win the game by sinking all ships', async () => {
        // Initialize the game
        boardStore.initGame();

        await flushPromises();

        const input: DOMWrapper<Element> = wrapper.find('.c-controls__input');
        const button: DOMWrapper<Element> = wrapper.find('.c-controls__fire');

        // Fire at all ship positions as defined in the shipStore.ships array
        await input.setValue('A1');
        await button.trigger('click');

        // Simulate a click at all cells
        for (const col of 'ABCDEFGHIJ'.split('')) {
            for (let row = 1; row <= 10; row++) {
                await input.setValue(`${col}${row}`);
                await button.trigger('click');
            }
        }

        await flushPromises();

        // Check if all ships are sunk
        expect(shipStore.getAllSunk).toBe(true);

        // Check if the game is over
        expect(boardStore.gameOver).toBe(true);

        const feedbackMessage: DOMWrapper<Element> = wrapper.find('.c-feedback__message');

        // Check if the feedback message indicates that the player has won the game...
        expect(feedbackMessage.text()).toContain('🥳 Congratulations! You sank all the ships. You win!');
    });

    it('can reset the game via reset button', async () => {
        await flushPromises();

        const resetButton: DOMWrapper<Element> = wrapper.find('.c-app__reset-game');
        const input: DOMWrapper<Element> = wrapper.find('.c-controls__input');
        const button: DOMWrapper<Element> = wrapper.find('.c-controls__fire');

        // Fire at a cell to simulate game play
        await input.setValue('A1');
        await button.trigger('click');

        expect(wrapper.findAll('.c-feedback__message').length).toBe(2);

        await flushPromises();

        // Click the reset button
        await resetButton.trigger('click');

        await flushPromises();

        // Check if the feedback messages have been cleared
        expect(wrapper.findAll('.c-feedback__message').length).toBe(1);

        // Check the messages only show the intro message
        const feedbackMessages: DOMWrapper<Element> = wrapper.find('.c-feedback__message');
        expect(feedbackMessages.text()).toContain(
            '🚀 Game started! Enter a coordinate (you can type anywhere from A1 to J10) to fire at a ship.');
    });
});
