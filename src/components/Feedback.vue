<template>
    <!-- Feedback component -->
    <div class="c-feedback" role="region" aria-live="polite" aria-atomic="true">
        <h2 class="u-hidden-visually">Feedback</h2>
        <p
            v-if="messages.length > 0"
            v-for="(message, index) in messages"
            :key="index"
            class="c-feedback__message"
            :class="`c-feedback__message--${message.type}`"
        >
            {{ message.text }}
        </p>
        <p v-else class="c-feedback__empty">No feedback available... yet.</p>
    </div>
</template>

<script lang="ts" setup>
import type { FeedbackMessage } from '../stores/interface';

// Props
defineProps<{
    messages: FeedbackMessage[];
}>();
</script>
