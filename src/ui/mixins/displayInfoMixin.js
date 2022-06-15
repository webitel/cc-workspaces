export default {
  computed: {
    displayName() {
      return this.task?.displayName;
    },
    displayNumber() {
      return this.task?.displayNumber;
    },
    displayQueueName() {
      return this.task?.attempt?.queue?.name;
    },
  },
};
