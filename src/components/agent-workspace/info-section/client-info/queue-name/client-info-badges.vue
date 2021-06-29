<template>
  <article class="client-info-badges" v-if="queueName">
    <wt-badge color="secondary">
      {{ queueName }}
    </wt-badge>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'client-info-badges',
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
.client-info-badges {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--component-padding);
}
</style>
