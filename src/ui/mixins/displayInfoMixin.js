export default {
  computed: {
    displayChatName() {
      const chat = this.chat || this.task;

      if (this.contact?.name) {
        return this.contact.name;
      }

      if (chat?.members?.length) {
        return chat?.members?.map((member) => member.name).join(', ');
      }

      return chat.title;
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
