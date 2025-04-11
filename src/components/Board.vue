<template>
    <div class="c-grid-wrapper" ref="gridWrapper">
        <!-- Game board -->
        <table class="c-game-board">
            <thead class="c-game-board__header">
                <tr>
                    <th class="c-game-board__header-cell">🚢</th>
                    <th class="c-game-board__header-cell" v-for="col in columns" :key="col">
                        {{ col }}
                    </th>
                </tr>
            </thead>
            <tbody class="c-game-board__body">
                <tr class="c-game-board__row" v-for="(row, rowIndex) in board" :key="rowIndex">
                    <th class="c-game-board__row-header">{{ rowIndex + 1 }}</th>
                    <td
                        class="c-game-board__cell"
                        v-for="(cell, colIndex) in row"
                        :key="colIndex"
                        :data-row="rowIndex"
                        :data-col="colIndex"
                        :class="{
                            'c-game-board__cell--sunk': cell.isSunk,
                            'c-game-board__cell--hit': cell.isHit,
                            'c-game-board__cell--miss': cell.isMiss,
                        }"
                    >
                        <div class="c-game-board__cell-content">
                            <span v-if="cell.isSunk" class="c-game-board__cell-symbol c-game-board__cell-symbol--sunk">⚓</span>
                            <span v-else-if="cell.isHit" class="c-game-board__cell-symbol c-game-board__cell-symbol--hit">💥</span>
                            <span v-else-if="cell.isMiss" class="c-game-board__cell-symbol c-game-board__cell-symbol--miss">🔴</span>
                            <span v-else class="c-game-board__cell-symbol">⭕</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Rocket overlay -->
        <div v-if="rocketVisible" class="rocket" :style="rocketStyle">🚀</div>
    </div>
</template>

<script setup lang="ts">
import {
    computed,
    ref,
    nextTick,
    watch,
} from 'vue';
import { useBoardStore } from '../stores';
import { COLUMN_COUNT } from '../stores/state/state.board';

const boardStore = useBoardStore();

// Generate column letters dynamically based on COLUMN_COUNT.
const columns = computed((): string[] =>
    Array.from({ length: COLUMN_COUNT }, (_, i) => String.fromCharCode(65 + i)),
) as unknown as string[];

// Reference to the grid-wrapper element.
const gridWrapper = ref<HTMLDivElement | null>(null);

// Reactive variables for the rocket animation.
const rocketVisible = ref<boolean>(false);
const rocketStyle = ref<Record<string, string>>({});

/**
 * Animate the rocket to simulate a shot being fired.
 *
 * @param {number} row
 * @param {number} col
 * @param {'hit' | 'miss'} result
 * @return {void}
 */
function animateRocket(row: number, col: number, result: 'hit' | 'miss'): void {
    if (!gridWrapper.value) return;

    const wrapperRect = gridWrapper.value.getBoundingClientRect();
    const startX = wrapperRect.width / 2;
    const startY = wrapperRect.height;

    // Locate the target cell using the data attributes.
    const targetCell = gridWrapper.value.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement;

    if (!targetCell) return;

    const targetRect = targetCell.getBoundingClientRect();
    const wrapperLeft = wrapperRect.left;
    const wrapperTop = wrapperRect.top;

    // Compute the cell's center relative to the grid-wrapper.
    const targetX = targetRect.left - wrapperLeft + targetRect.width / 2;
    const targetY = targetRect.top - wrapperTop + targetRect.height / 2;

    // Show the rocket element.
    rocketVisible.value = true;

    // This is a bit of a cheap way of handling animations, but for the sake
    // of brevity, I'm just using setTimeout to "fake" the time it takes for the
    // rocket to travel to the target cell.

    // Step 1: Position the rocket center-bottom of the grid.
    rocketStyle.value = {
        position: 'absolute',
        left: `${startX}px`,
        top: `${startY}px`,
        transform: 'translate(-50%, -50%) scale(0.5)',
        transition: 'transform .5s ease-out, left 0.5s ease-out, top .5s ease-out',
    };

    // Step 2: After a short delay, "fire" the rocket to the target cell the player entered.
    setTimeout(() => {
        rocketStyle.value = {
            position: 'absolute',
            left: `${targetX}px`,
            top: `${targetY}px`,
            transform: 'translate(-50%, -50%) scale(1.5)',
            transition: 'transform .63s ease-in-out, left 0.63s ease-in-out, top .63s ease-in-out',
        };
    }, 50);

    // Step 3: After 700ms, reduce the scale to simulate the rocket approaching the target.
    setTimeout(() => {
        rocketStyle.value = {
            position: 'absolute',
            left: `${targetX}px`,
            top: `${targetY}px`,
            transform: 'translate(-50%, -50%) scale(0.5)',
            transition: 'transform .33s ease-in',
        };
    }, 700);

    // Step 4: After 1s, hide the rocket.
    setTimeout(() => {
        rocketVisible.value = false;
    }, 1000);
}

// Watch for changes on boardStore.lastShot.
// This property is assumed to be an object like { row: number, col: number, result: 'hit' | 'miss' }.
// When a new shot is recorded, trigger the rocket animation.
watch(
    () => boardStore.lastShot,
    (shot) => {
        if (shot) {

            // Delay a tick to ensure the DOM is updated.
            nextTick(() => {
                animateRocket(shot.row, shot.col, shot.result);
            });
        }
    },
);

defineProps({
    board: {
        type: Array as () => number[][],
        required: true,
    },
});
</script>
