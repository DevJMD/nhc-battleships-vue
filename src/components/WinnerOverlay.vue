<template>
    <div
        class="c-overlay"
        v-if="boardStore.gameOver"
        role="dialog"
        aria-labelledby="overlay-title"
        aria-describedby="overlay-message"
        tabindex="-1"
        @keydown.esc="closeOverlay"
        ref="overlay"
    >
        <!--
            Simple modal overlay to show when the game is over.
        -->
        <div class="c-overlay__modal">
            <span class="c-overlay__emoji" aria-hidden="true">🎉</span>
            <p id="overlay-title" class="c-overlay__message">
                Well done! You sank all the ships. There are more enemy
                ships lurking on the coast of Scarborough, though... <br><br>
            </p>
            <!--
                The game is over, show the player the result.
                The player can either play again or close the overlay.
            -->
            <button
                class="c-overlay__button"
                @click="restartGame"
                @keydown.enter="restartGame"
            >
                Play Again
            </button>
            <button
                class="c-overlay__button"
                @click="closeOverlay"
                @keydown.enter="closeOverlay"
            >
                Close
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useBoardStore, useFeedbackStore } from '../stores';

// References
const boardStore = useBoardStore();
const feedbackStore = useFeedbackStore();
const overlay = ref<HTMLElement | null>(null);

/**
 * Restart the game.
 *
 * @returns {void}
 */
const restartGame = (): void => {
    feedbackStore.clearMessages();
    boardStore.initGame();

    closeOverlay();
};

/**
 * Close the overlay.
 *
 * @returns {void}
 */
const closeOverlay = (): void => {
    boardStore.gameOver = false;

    const appHeader = document.querySelector('.app__header-title') as HTMLElement;

    appHeader?.focus();
};

// On mounted lifecycle hook
onMounted(() => {
    if (overlay.value) {
        overlay.value?.focus();
    }
});


// On unmounted lifecycle hook
onUnmounted(() => {
    closeOverlay();
});
</script>
