<template>
    <div class="c-controls">
        <form class="c-controls__form" @submit.prevent>
            <!--
                The form is used to take input from the player.
                The player enters a letter (A-J) and a number (1-10) to fire a shot at the game board.
            -->
            <fieldset class="c-controls__fieldset">
                <legend class="c-controls__legend">
                    <p>Fire a missile to destroy the battleships.</p>
                </legend>
            </fieldset>
            <fieldset class="c-controls__fieldset c-controls__fieldset--inputs">
                <!--
                    The letter input is used to enter the row (A-ROW_COUNT) of the game board.
                -->
                <input
                    type="text"
                    class="c-controls__input c-controls__input--letter"
                    v-model="letterInput"
                    maxlength="1"
                    placeholder="e.g. A"
                    @input="onLetterInput"
                    @keyup="onLetterKeyup"
                />
                <!--
                    The number input is used to enter the column (1-COLUMN_COUNT) of the game board.
                -->
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
                <!--
                    Action: Fire...
                -->
                <button class="c-controls__fire" @click="fireShot">Fire!</button>
            </fieldset>
        </form>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useBoardStore } from '../stores';

// References
const letterInput = ref<string>('');
const numberInput = ref<string>('');
const numberField = ref<HTMLInputElement | null>(null);
const letterField = ref<HTMLInputElement | null>(null);

// Store
const boardStore = useBoardStore();

// Computed properties
const maxRowCount = computed(() => boardStore.getMaxColumnLength);
const isNumberInputNegative = computed(() => numberInput.value.includes('-'));
const combinedInput = computed(() => `${letterInput.value.toUpperCase()}${numberInput.value}`);

// On mounted lifecycle hook
onMounted(() => {
    letterField.value = document.querySelector('.c-controls__input--letter') as HTMLInputElement;
    numberField.value = document.querySelector('.c-controls__input--number') as HTMLInputElement;

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
 *
 * @returns {void}
 */
const onNumberKeyUp = (event: KeyboardEvent): void => {
    const rawValue = numberField.value?.value || '';

    if (isNumberInputNegative) {
        numberInput.value = (numberField.value!.value = rawValue.replace('-', ''));
    }

    if (event.key === 'Backspace' && rawValue === '') {
        letterField.value?.focus();
    }
};

/**
 * @example Better way I'd write comments usually - let the code do the talking.
 *
 * Fires a shot at the coordinate entered by the player.
 *
 * 1. Checks if the letter and number inputs are empty.
 *    If they are, it resets the inputs and focuses on the letter input.
 * 2. Calls the `processInput` method from the board store to process the input.
 * 3. Resets the input fields.
 * 4. Focuses the letter input again.
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
    boardStore.processInput(combinedInput.value);

    /* [3] */
    letterInput.value = '';
    numberInput.value = '';

    /* [4] */
    letterField.value?.focus();
};
</script>
