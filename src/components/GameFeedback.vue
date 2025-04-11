<template>
    <!-- Feedback component -->
    <div class="c-feedback" role="region" aria-live="polite" aria-atomic="true">
        <div v-if="messages.length > 0">
        <h2 class="u-hidden-visually">Feedback</h2>
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
