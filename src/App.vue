<template>
    <div id="app" class="c-app">
        <!-- Main container -->
        <div class="c-app__container" role="main">
            <!-- Left Panel: Header, Controls, Feedback -->
            <div class="c-app__panel">
                <!-- Header -->
                <Header />
                <!-- Game controls -->
                <Controls/>
                <!-- Game feedback -->
                <Feedback :messages="feedbackStore.messages"/>
            </div>

            <!-- Right Panel: Board and winner overlay -->
            <div class="c-app__board">
                <!-- Game board -->
                <Board :board="boardStore.board"/>
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

import Board         from './components/Board.vue';
import Controls      from './components/Controls.vue';
import Header        from './components/Header.vue';
import WinnerOverlay from './components/WinnerOverlay.vue';
import Feedback      from './components/Feedback.vue';

import {
    useBoardStore,
    useFeedbackStore,
} from './stores';

export default defineComponent({
    name: 'App',
    components: { Header, WinnerOverlay, Board, Controls, Feedback },
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
