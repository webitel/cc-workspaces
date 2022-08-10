export default {
  computed: {
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
