<template>
    <header class="c-app__header" role="banner">
        <h1 class="c-app__header-title">
            Battleships
            <a class="c-app__reset-game" @click="resetGame" href="#">
                🔄
                <span class="u-hidden-visually" aria-hidden="true">Reset Game</span>
            </a>
        </h1>
    </header>
</template>

<script lang="ts" setup>
import { useBoardStore }    from '../stores';
import { useFeedbackStore } from '../stores';

// Stores
const boardStore = useBoardStore();
const feedbackStore = useFeedbackStore();

/**
 * Resets the game.
 *
 * @returns {void}
 */
const resetGame = (): void => {
    const appHeader: HTMLElement = document.querySelector('.c-controls__input') as HTMLElement;

    // Reset the game state and clear messages.
    feedbackStore.clearMessages();
    boardStore.initGame();

    appHeader?.focus();
};
</script>
