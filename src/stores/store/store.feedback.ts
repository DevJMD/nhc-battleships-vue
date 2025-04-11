// Core
import { defineStore } from 'pinia';

// Types
import type { StoreDefinition }                from 'pinia';
import type { FeedbackMessage, FeedbackState } from '../interface';

// State
import { createFeedbackState }                   from '../state/state.feedback';
import { addMessageAction, clearMessagesAction } from '../actions/actions.feedback';

export const useFeedbackStore: StoreDefinition = defineStore('feedbackStore', {
    /**
     * The state of the feedback store.
     *
     * @returns {FeedbackState} The initial state.
     */
    state: (): FeedbackState => createFeedbackState(),

    /**
     * The actions of the feedback store.
     *
     * @returns {Object} The functions.
     */
    actions: {
        addMessage(message: FeedbackMessage) {
            if (!message.text || !message.type) {
               return;
            }

            return addMessageAction(this, { ...message });
        },

        clearMessages() {
            return clearMessagesAction(this);
        },
    },

    /**
     * The getters of the feedback store.
     *
     * @returns {Object} The functions.
     */
    getters: {
        /**
         * Get the messages in the feedback store.
         *
         * @returns {FeedbackMessage[]}
         */
        getMessages(): FeedbackMessage[] {
            return this.messages;
        },

        /**
         * Get the last message in the feedback store.
         *
         * @returns {FeedbackMessage | null}
         */
        getMessageCount(): number {
            return this.messages.length;
        },

        /**
         * Get the first message in the feedback store.
         *
         * @returns {FeedbackMessage | null}
         */
        getFirstMessage(): FeedbackMessage | null {
            return this.messages.length > 0 ? this.messages[this.messages.length - 1] : null;
        },

        /**
         * Get the last message in the feedback store.
         *
         * @returns {FeedbackMessage | null}
         */
        getLastMessage(): FeedbackMessage | null {
            return this.messages.length > 0 ? this.messages[0] : null;
        },
    }
});
