export default {
  computed: {
    displayChatName() {
      return this.task && this.task?.members?.map((member) => member.name).join(', ');
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
