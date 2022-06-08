<template>
  <article class="client-info-chips" v-if="queueName">
    <wt-chip color="secondary">
      {{ queueName }}
    </wt-chip>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'client-info-chips',
  computed: {
    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
    queueName() {
      return this.taskOnWorkspace.task?.queue?.name;
    },
  },
};
</script>

<style lang="scss" scoped>
.client-info-chips {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}
</style>
