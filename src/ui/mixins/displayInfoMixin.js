import { getChatPreviewName } from '../../features/modules/chat/scripts/getChatPreviewName';
import { getQueueName } from '../modules/queue-section/modules/_shared/scripts/getQueueName';

export default {
	computed: {
		displayChatName() {
			return getChatPreviewName(this.chat || this.task);
		},
		displayName() {
			return (this.task || this.call)?.displayName;
		},
		displayNumber() {
			return (this.task || this.call)?.displayNumber;
		},
		displayQueueName() {
			return getQueueName(this.task || this.call);
		},
	},
};
