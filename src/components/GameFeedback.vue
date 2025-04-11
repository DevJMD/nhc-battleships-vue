<template>
    <!--
        Feedback player interaction messages.
    -->
    <div class="c-feedback" role="region" aria-live="polite" aria-atomic="true">
        <div v-if="messages.length > 0">
            <h2 class="u-hidden-visually">Feedback</h2>
            <!--
                Feedback messages are displayed here.
                There a different types of messages that change the style.
            -->
            <p
                v-for="(message, index) in messages"
                :key="index"
                class="c-feedback__message"
                :class="`c-feedback__message--${message.type}`"
            >
                {{ message.text }}
            </p>
        </div>
        <div v-else>
            <!--
                If there are no messages, show a placeholder.
            -->
            <p class="c-feedback__empty">No feedback available... yet.</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { FeedbackMessage } from '../stores/interface';

// Props
defineProps<{
    messages: FeedbackMessage[];
}>();
</script>
