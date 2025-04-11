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
        <div class="c-overlay__content">
            <span class="c-overlay__emoji" aria-hidden="true">🎉</span>
            <p id="overlay-title" class="c-overlay__message">Well done! You sank all the ships. There are more enemy
                ships lurking on the coast of Scarborough, though... <br><br></p>
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

const boardStore = useBoardStore();
const feedbackStore = useFeedbackStore();
const overlay = ref<HTMLElement | null>(null);

const restartGame = () => {
    feedbackStore.clearMessages();
    boardStore.initGame();

    closeOverlay();
};

const closeOverlay = () => {
    boardStore.gameOver = false;

    const appHeader = document.querySelector('.app__header-title') as HTMLElement;

    appHeader?.focus();
};

onMounted(() => {
    if (overlay.value) {
        overlay.value?.focus();
    }
});

onUnmounted(() => {
    closeOverlay();
});
</script>
