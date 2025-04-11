<template>
    <div class="c-controls">
        <form class="c-controls__form" @submit.prevent>
            <fieldset class="c-controls__fieldset">
                <legend class="c-controls__legend">
                    <p>Fire a missile to destroy the battleships.</p>
                </legend>
            </fieldset>
            <fieldset class="c-controls__fieldset c-controls__fieldset--inputs">
                <input
                    type="text"
                    class="c-controls__input c-controls__input--letter"
                    v-model="letterInput"
                    maxlength="1"
                    placeholder="e.g. A"
                    @input="onLetterInput"
                    @keyup="onLetterKeyup"
                />
                <input
                    type="number"
                    class="c-controls__input c-controls__input--number"
                    v-model="numberInput"
                    placeholder="e.g. 5"
                    @keydown="onNumberKeydown"
                    :max="maxRowCount"
                    :min="1"
                />
                <button class="c-controls__fire" @click="fireShot">Fire!</button>
            </fieldset>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBoardStore } from '../stores';

const letterInput = ref<string>('');
const numberInput = ref<string>('');
const numberField = ref<HTMLInputElement | null>(null);
const letterField = ref<HTMLInputElement | null>(null);
const maxRowCount = ref<number>(0);

const boardStore = useBoardStore();

onMounted(() => {
    letterField.value = document.querySelector('.c-controls__input--letter') as HTMLInputElement;
    numberField.value = document.querySelector('.c-controls__input--number') as HTMLInputElement;
    maxRowCount.value = boardStore.getMaxColumnLength;

    letterField.value?.focus();
});

/**
 * Handles the letter input and ensures it is uppercase.
 */
const onLetterInput = (): void => {
    letterInput.value = letterInput.value.toUpperCase();
};

/**
 * Moves focus to the number input when a letter is typed.
 */
const onLetterKeyup = (): void => {
    if (letterInput.value.length === 1) {
        numberField.value?.focus();
    }
};

/**
 * Handles backspace behavior in the number input.
 */
const onNumberKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Backspace' && !numberInput.value) {
        letterField.value?.focus();
    }
};


/**
 * Fires a shot at the coordinate entered by the player.
 *
 * @returns {void}
 */
const fireShot = (): void => {
    // Straight up reject empty inputs.
    if (!letterInput.value || !numberInput.value) {
        letterInput.value = '';
        numberInput.value = '';

        letterField.value?.focus();

        return;
    }

    // Combine the letter and number inputs into a single string.
    const combinedInput = `${letterInput.value.toUpperCase()}${numberInput.value}`;

    // Check if the input is valid.
    boardStore.processInput(combinedInput);

    // Reset the input fields.
    letterInput.value = '';
    numberInput.value = '';

    // Focus the letter input again.
    letterField.value?.focus();
};
</script>
