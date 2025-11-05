<template>
  <article v-if="queueName" class="client-info-chips">
    <wt-chip color="secondary">
      {{ queueName }}
    </wt-chip>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';
import { getQueueName } from '../../../../../queue-section/modules/_shared/scripts/getQueueName'

export default {
  name: 'ClientInfoChips',
  computed: {
    ...mapGetters('workspace', {
      taskOnWorkspace: 'TASK_ON_WORKSPACE',
    }),
    queueName() {
      return getQueueName(this.taskOnWorkspace)
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
