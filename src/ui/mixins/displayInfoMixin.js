import { getQueueName } from '../modules/queue-section/modules/_shared/scripts/getQueueName';

export default {
	computed: {
		displayChatName() {
			const chat = this.chat || this.task;
			if (chat?.members?.length) {
				return chat.members.map((member) => member.name).join(', ');
			}

			return chat?.title || 'unknown';
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
