import type { FeedbackState } from '../interface';

/**
 * Creates the initial state for the feedback store.
 *
 * @returns {FeedbackState}
 */
export const createFeedbackState = (): FeedbackState => ({
    messages: [],
});
