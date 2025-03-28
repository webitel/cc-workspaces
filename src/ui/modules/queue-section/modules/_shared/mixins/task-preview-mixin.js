import QueuePreviewTimer from '../components/queue-preview-timer.vue';
import TaskQueuePreviewMd from '../components/task-preview/task-queue-preview-md.vue';
import TaskQueuePreviewSm from '../components/task-preview/task-queue-preview-sm.vue';

export default {
  components: {
    TaskQueuePreviewMd,
    TaskQueuePreviewSm,
    QueuePreviewTimer,
  },
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
