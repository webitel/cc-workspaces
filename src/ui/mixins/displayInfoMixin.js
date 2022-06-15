export default {
  computed: {
    displayName() {
      return this.task?.displayName;
    },
    displayNumber() {
      return this.task?.displayName;
    },
    displayQueueName() {
      return this.task?.attempt?.queue?.name;
    },
  },
};
