export default {
  computed: {
    // Refactor to task after calls preview props
    displayName() {
      return this.call?.displayName || this.task?.displayName;
    },
    // Refactor to task after calls preview props

    displayNumber() {
      return this.call?.displayNumber || this.task?.displayName;
    },
    // Refactor to task after calls preview props
    displayQueueName() {
      return this.call?.task?.queue?.name || this.task?.task?.queue?.name;
    },
  },
};
