<template>
    <div class="c-controls">
        <form class="c-controls__form" @submit.prevent>
            <fieldset class="c-controls__fieldset">
                <legend class="c-controls__legend">
                    <p>Fire a missile to destroy the battleships</p>
                </legend>
            </fieldset>
            <fieldset class="c-controls__fieldset">
                <input
                    type="text"
                    class="c-controls__input"
                    v-model="userInput"
                    placeholder="Enter coordinate e.g., A5"
                />
                <button class="c-controls__fire" @click="fireShot">Fire missile!</button>
            </fieldset>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBoardStore } from '../stores';

const userInput = ref<string>('');
const maxRowCount = ref<number>(0);

const boardStore = useBoardStore();

/**
 * The input field for entering coordinates.
 *
 * @type {HTMLInputElement | null}
 */
let inputField: HTMLInputElement | null = null;

/**
 * 1. Focuses the input field when the component is mounted.
 */
onMounted(() => {
    inputField = document.querySelector('.c-controls__input') as HTMLInputElement; /* [1] */

    maxRowCount.value = boardStore.getMaxColumnLength; /* [2] */
});

/**
 * Fires a shot at the coordinate entered by the player.
 *
 * @returns {void}
 */
const fireShot = (): void => {
    // Straight up reject empty inputs.
    if (!userInput.value) {
        inputField?.focus();
        return;
    }

    // Check if the input is valid.
    boardStore.processInput(userInput.value);

    // Clear the input field.
    userInput.value = '';

    // Focus the input field again for the next shot.
    inputField?.focus();
};
</script>
