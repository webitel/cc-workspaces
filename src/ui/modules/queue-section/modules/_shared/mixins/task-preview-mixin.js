import TaskQueuePreview from '../components/task-queue-preview.vue';

export default {
  components: { TaskQueuePreview },
  props: {
    // item is for UI computing
    task: {
      type: Object,
      required: true,
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },
};
