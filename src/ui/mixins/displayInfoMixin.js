export default {
  computed: {
    displayChatName() {
      const chat = this.chat || this.task;

      if (chat?.members?.length) {
        return chat?.members?.map((member) => member.name).join(', ');
      }

      if (chat?.title) {
        return chat.title;
      }

      return 'unknown';
    },
    displayName() {
      return (this.task || this.call)?.displayName;
    },
    displayNumber() {
      return (this.task || this.call)?.displayNumber;
    },
    displayQueueName() {
      return (this.task || this.call)?.attempt?.queue?.name;
    },
  },
};
