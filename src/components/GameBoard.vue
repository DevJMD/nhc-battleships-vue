<template>
    <div class="c-grid-wrapper" ref="gridWrapper">
        <table class="c-game-board">
            <!-- Game board header -->
            <thead class="c-game-board__header">
            <tr>
                <th class="c-game-board__header-cell">🚢</th>
                <th class="c-game-board__header-cell" v-for="col in columns" :key="col">
                    {{ col }}
                </th>
            </tr>
            </thead>
            <!-- Game board body -->
            <tbody class="c-game-board__body">
            <!--
                The game board is a grid of cells, each representing a part of the game.
                There are four states for each cell:

                - Sunk: The ship has been sunk.
                - Hit: The ship has been hit.
                - Miss: The shot missed.
                - Empty: The cell is empty.

                The `board` prop is an array of arrays. They represent the rows and columns of the game board
                containing the state of each cell.
            -->
            <tr class="c-game-board__row" v-for="(row, rowIndex) in board" :key="rowIndex">
                <!-- Row header: i.e., 1, 2, 3... -->
                <th class="c-game-board__row-header">{{ rowIndex + 1 }}</th>
                <!-- Each cell in the row -->
                <!--
                    Each cell has a data attribute for its row and column index.
                    This is used to identify the cell when the player makes a shot.
                    Used for the rocket animation, as it stands...
                -->
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
                    <!--
                        The cell content is determined by its state.

                        - If the cell is sunk, show ⚓.
                        - If the cell is hit, show 💥.
                        - If the cell is a miss, show 🔴.
                        - Otherwise, show ⭕.
                    -->
                    <div class="c-game-board__cell-content">
                        <span v-if="cell.isSunk"
                              class="c-game-board__cell-symbol c-game-board__cell-symbol--sunk">⚓</span>
                        <span v-else-if="cell.isHit"
                              class="c-game-board__cell-symbol c-game-board__cell-symbol--hit">💥</span>
                        <span v-else-if="cell.isMiss" class="c-game-board__cell-symbol c-game-board__cell-symbol--miss">🔴</span>
                        <span v-else class="c-game-board__cell-symbol">⭕</span>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>

        <!-- Rocket animation -->
        <!--
            The rocket is animated to simulate a shot being fired.
            It's positioned center-bottom of the grid to start.
            When the shot is fired, it'll move to the cell fired at.
        -->
        <div v-if="rocketVisible" class="rocket" :style="rocketStyle">🚀</div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue';
import { useBoardStore } from '../stores';
import type { BoardCell } from '../stores/interface';
import { COLUMN_COUNT } from '../stores/state/state.board';

// Store
const boardStore = useBoardStore();

// Computed properties
// Generate column letters dynamically based on COLUMN_COUNT.
const columns = computed((): string[] =>
    Array.from({ length: COLUMN_COUNT }, (_, i) => String.fromCharCode(65 + i)),
) as unknown as string[];

// References
const gridWrapper = ref<HTMLDivElement | null>(null);
const rocketVisible = ref<boolean>(false);
const rocketStyle = ref<Record<string, string>>({});

/**
 * Animate the rocket to simulate a shot being fired.
 *
 * @param {number} row
 * @param {number} col
 * @return {void}
 */
function animateRocket(row: number, col: number): void {
    if (!gridWrapper.value) return;

    const wrapperRect: DOMRect = gridWrapper.value.getBoundingClientRect();
    const startX: number = wrapperRect.width / 2;
    const startY: number = wrapperRect.height;

    // Locate the target cell using the data attributes.
    const targetCell: HTMLElement = gridWrapper.value.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLElement;

    if (!targetCell) return;

    const targetRect: DOMRect = targetCell.getBoundingClientRect();
    const wrapperLeft: number = wrapperRect.left;
    const wrapperTop: number = wrapperRect.top;

    // Compute the cell's center relative to the grid-wrapper.
    const targetX: number = targetRect.left - wrapperLeft + targetRect.width / 2;
    const targetY: number = targetRect.top - wrapperTop + targetRect.height / 2;

    // Show the rocket element.
    rocketVisible.value = true;

    // This is a bit of a rubbish way of handling animations, but for the sake
    // of brevity, I'm just using setTimeout to "fake" the time it takes for the
    // rocket to travel to the target cell.

    // Step 1: Position the rocket center-bottom of the grid.
    rocketStyle.value = {
        position: 'absolute',
        left: `${startX}px`,
        top: `${startY}px`,
        transform: 'translate(-50%, -50%) scale(0.5)',
        transition: 'transform .5s ease-out, left .5s ease-out, top .5s ease-out',
    };

    // Step 2: After a short delay, "fire" the rocket to the target cell the player entered.
    setTimeout(() => {
        rocketStyle.value = {
            position: 'absolute',
            left: `${targetX}px`,
            top: `${targetY}px`,
            transform: 'translate(-50%, -50%) scale(1.5)',
            transition: 'transform .63s ease-in-out, left .63s ease-in-out, top .63s ease-in-out',
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
                animateRocket(shot.row, shot.col);
            });
        }
    },
);

// Set props
defineProps({
    board: {
        type: Array as () => BoardCell[][],
        required: true,
    },
});
</script>
