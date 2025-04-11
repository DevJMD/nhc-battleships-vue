<template>
    <div id="app" class="c-app">
        <!-- Main container -->
        <div class="c-app__container" role="main">
            <!-- Left Panel: Header, Controls, Feedback -->
            <div class="c-app__panel">
                <!-- Header -->
                <ControlHeader/>
                <!-- Game controls -->
                <GameControl/>
                <!-- Game feedback -->
                <GameFeedback :messages="feedbackStore.messages"/>
            </div>

            <!-- Right Panel: Board and winner overlay -->
            <div class="c-app__board">
                <!-- Game board -->
                <GameBoard :board="boardStore.board"/>
                <!-- Winner overlay -->
                <WinnerOverlay
                    v-if="boardStore.gameOver"
                    :winner="boardStore.winner"
                    @restartGame="boardStore.initGame"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
} from 'vue';

import GameBoard from './components/GameBoard.vue';
import GameControl from './components/GameControl.vue';
import ControlHeader from './components/GameControlHeader.vue';
import GameFeedback from './components/GameFeedback.vue';
import WinnerOverlay from './components/WinnerOverlay.vue';

import {
    useBoardStore,
    useFeedbackStore,
} from './stores';

export default defineComponent({
    name: 'App',
    components: { GameFeedback, ControlHeader, WinnerOverlay, GameBoard, GameControl },
    setup() {
        const boardStore = useBoardStore();
        const feedbackStore = useFeedbackStore();

        onMounted(() => {
            boardStore.initGame();
        });

        return {
            boardStore,
            feedbackStore,
        };
    },
});
</script>
