import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import { useFeedbackStore } from '../../src/stores';

describe('Feedback Store', () => {
    let feedbackStore: ReturnType<typeof useFeedbackStore>;

    beforeEach(() => {
        setActivePinia(createPinia());
        feedbackStore = useFeedbackStore();
    });

    it('adds messages correctly', () => {
        feedbackStore.addMessage({
            type: 'hit',
            text: 'Test Message',
        });

        expect(feedbackStore.messages).toStrictEqual([{
            type: 'hit',
            text: 'Test Message',
        }]);
    });

    it('clears messages correctly', () => {
        feedbackStore.addMessage({
            type: 'hit',
            text: 'Test Message',
        });

        expect(feedbackStore.messages.length).toBeGreaterThan(0);

        feedbackStore.clearMessages();

        expect(feedbackStore.messages.length).toBe(0);
    });
});
