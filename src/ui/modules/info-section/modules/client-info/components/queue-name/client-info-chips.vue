<template>
  <article v-if="queueName" class="client-info-chips">
    <wt-chip color="secondary">
      {{ queueName }}
    </wt-chip>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ClientInfoChips',
  computed: {
    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
    queueName() {
      return this.taskOnWorkspace.attempt?.queue?.name
        || this.taskOnWorkspace.queue?.name
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
