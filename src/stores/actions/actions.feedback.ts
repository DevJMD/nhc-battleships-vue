import type {
    FeedbackMessage,
    FeedbackState,
} from '../interface';

/**
 * Adds a message to the feedback state.
 *
 * @param {FeedbackState} state
 * @param {string} message
 */
export const addMessageAction = (state: FeedbackState, message: FeedbackMessage): void => {
    state.messages.unshift({
        type: message.type,
        text: message.text,
    });
};

/**
 * Clears all messages from the feedback state.
 *
 * @param {FeedbackState} state
 */
export const clearMessagesAction = (state: FeedbackState): void => {
    state.messages = [];
};
