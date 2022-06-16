<template>
  <task-footer class="job-footer">
    <wt-button
      v-if="task.allowAccept"
      color="task"
      wide
      @click="task.accept()"
    >{{ $t('reusable.accept') }}
    </wt-button>
    <wt-button
      v-if="task.allowAccept"
      color="secondary"
      wide
      @click="task.decline()"
    >{{ $t('reusable.decline') }}
    </wt-button>
    <wt-button
      v-if="task.allowClose"
      color="secondary"
      wide
      @click="task.close()"
    >{{ $t('reusable.close') }}
    </wt-button>
  </task-footer>
</template>

<script>
import TaskFooter from '../../../_shared/components/task-footer/task-footer.vue';

export default {
  name: 'job-footer',
  components: { TaskFooter },
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
