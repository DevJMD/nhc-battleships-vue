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
                    @focusin="onLetterFocus"
                />
                <input
                    type="number"
                    class="c-controls__input c-controls__input--number"
                    v-model="numberInput"
                    placeholder="e.g. 5"
                    @keyup="onNumberKeyUp"
                    @focusin="onNumberFocus"
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
 * Converts the letter input to uppercase.
 *
 * @returns {void}
 */
const onLetterInput = (): void => {
    letterInput.value = letterInput.value.toUpperCase();
};

/**
 * Handles the behavior when the letter input is filled.
 * If the letter input is filled, focus on the number input.
 *
 * @returns {void}
 */
const onLetterKeyup = (): void => {
    if (letterInput.value.length === 1) {
        numberField.value?.focus();
    }
};

const onNumberFocus = (): void => {
    numberInput.value = '';
};

/**
 * Handles backspace behavior in the number input.
 *
 * If the backspace key is pressed and the number input is empty,
 * focus back on the letter input.
 * We need to handle logic for number inputs where "-" can be used
 * to indicate negative numbers.
 *
 * @param {KeyboardEvent} event - The keyboard event.
 * @returns {void}
 */
const onNumberKeyUp = (event: KeyboardEvent): void => {
    const rawValue = numberField.value?.value || '';

    if (rawValue.includes('-')) {
        numberField.value!.value = rawValue.replace('-', '');
    }

    if (event.key === 'Backspace' && rawValue === '') {
        letterField.value?.focus();
    }
};

/**
 * Fires a shot at the coordinate entered by the player.
 *
 * 1. Checks if the letter and number inputs are empty.
 *    If they are, it resets the inputs and focuses on the letter input.
 * 2. Combines the letter and number inputs into a single string.
 * 3. Calls the `processInput` method from the board store to process the input.
 * 4. Resets the input fields.
 * 5. Focuses the letter input again.
 *
 * @returns {void}
 */
const fireShot = (): void => {
    /* [1] */
    if (!letterInput.value || !numberInput.value) {
        letterInput.value = '';
        numberInput.value = '';

        letterField.value?.focus();

        return;
    }

    /* [2] */
    const combinedInput = `${letterInput.value.toUpperCase()}${numberInput.value}`;

    /* [3] */
    boardStore.processInput(combinedInput);

    /* [4] */
    letterInput.value = '';
    numberInput.value = '';

    /* [5] */
    letterField.value?.focus();
};
</script>
